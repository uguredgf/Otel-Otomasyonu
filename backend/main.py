from datetime import date
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_db_connection
import queries

app = FastAPI(title="Otel Otomasyonu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class YeniRezervasyon(BaseModel):
    tc_kimlik: str
    ad: str
    soyad: str
    telefon: str
    email: str
    oda_tipi: str
    oda_no: str  # Ece'nin kat planından seçtiği spesifik oda numarası eklendi!
    giris_tarihi: str
    cikis_tarihi: str


class PersonelGiris(BaseModel):
    kullanici_adi: str
    sifre: str


class HizmetEkleme(BaseModel):
    rezervasyon_id: int
    hizmet_id: int
    adet: int


class RezervasyonDurum(BaseModel):
    rezervasyon_id: int
    yeni_durum: str


class FiyatGuncelleme(BaseModel):
    oda_turu_adi: str
    yeni_fiyat: float
    yeni_kapasite: int


class HizmetFiyatGuncelleme(BaseModel):
    hizmet_adi: str
    yeni_fiyat: float


class HizmetSilVerisi(BaseModel):
    rezervasyon_id: int
    hizmet_id: int


class OdaDurumVerisi(BaseModel):
    oda_no: str
    yeni_durum: str


def parse_iso_date(value: str, field_name: str) -> date:
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"{field_name} YYYY-AA-GG formatinda olmalidir.") from exc


def close_db(conn, cursor=None):
    if cursor:
        cursor.close()
    if conn and conn.is_connected():
        conn.close()


def normalize_text(value: str) -> str:
    if not value:
        return ""
    translation = str.maketrans({
        "ç": "c", "Ç": "c",
        "ğ": "g", "Ğ": "g",
        "ı": "i", "İ": "i",
        "ö": "o", "Ö": "o",
        "ş": "s", "Ş": "s",
        "ü": "u", "Ü": "u",
    })
    return " ".join(value.translate(translation).lower().split())


def resolve_room_type_name(requested_type: str, db_room_types: list[str]) -> str | None:
    requested_normalized = normalize_text(requested_type)
    if not requested_normalized:
        return None
    for room_type in db_room_types:
        if normalize_text(room_type) == requested_normalized:
            return room_type
    return None


@app.get("/")
def ana_sayfa():
    return {"mesaj": "Otel Otomasyonu Backend Sistemi Calisiyor!"}


@app.get("/dashboard/ozet")
def dashboard_verilerini_getir():
    conn = get_db_connection()
    if not conn:
        return {"dolu_oda_sayisi": 0, "bos_oda_sayisi": 0, "toplam_ciro": 0, "bugun_cikis_yapacaklar": 0}
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_AKTIF_MUSTERILER)
        aktif_misafirler = cursor.fetchall()
        gercek_dolu_oda = len(aktif_misafirler)

        cursor.execute("SELECT COUNT(*) as toplam FROM Odalar")
        toplam_oda_sonuc = cursor.fetchone()
        toplam_oda = toplam_oda_sonuc["toplam"] if toplam_oda_sonuc else 0
        gercek_bos_oda = toplam_oda - gercek_dolu_oda

        cursor.execute(queries.GET_DASHBOARD_OZET)
        ozet = cursor.fetchone()

        bugun_sorgusu = """
            SELECT COUNT(*) as cikis_sayisi 
            FROM Rezervasyonlar 
            WHERE rezerve_durumu NOT IN ('İptal Edildi', 'Tamamlandı') 
            AND rezerve_cikis_tarihi = CURDATE()
        """
        cursor.execute(bugun_sorgusu)
        bugun_cikis_sonuc = cursor.fetchone()
        bugun_cikis = bugun_cikis_sonuc["cikis_sayisi"] if bugun_cikis_sonuc else 0

        sonuc = {
            "dolu_oda_sayisi": gercek_dolu_oda,
            "bos_oda_sayisi": gercek_bos_oda,
            "bugun_cikis_yapacaklar": bugun_cikis,
            "toplam_ciro": 0.0
        }

        if ozet:
            ciro_degeri = ozet.get("toplam_ciro") or ozet.get("ciro") or ozet.get("toplam_tutar") or 0
            sonuc["toplam_ciro"] = float(ciro_degeri)

        return sonuc
    except Exception as e:
        print("Dashboard Hatası:", str(e))
        return {"dolu_oda_sayisi": 0, "bos_oda_sayisi": 0, "toplam_ciro": 0, "bugun_cikis_yapacaklar": 0}
    finally:
        close_db(conn, cursor)


@app.get("/odalar/detayli")
def tum_oda_detaylarini_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_ODA_DETAYLARI)
        return cursor.fetchall()
    finally:
        close_db(conn, cursor)


@app.get("/odalar/musait")
def musait_odalari_getir(giris_tarihi: str, cikis_tarihi: str, oda_tipi: str = "all"):
    giris = parse_iso_date(giris_tarihi, "giris_tarihi")
    cikis = parse_iso_date(cikis_tarihi, "cikis_tarihi")
    if cikis <= giris:
        raise HTTPException(status_code=422, detail="cikis_tarihi giris_tarihi'nden sonra olmalidir.")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        secili_oda_tipi = oda_tipi

        if oda_tipi != "all":
            cursor.execute("SELECT odaTur_adi FROM Oda_Turleri")
            tum_tipler = [item["odaTur_adi"] for item in cursor.fetchall()]
            eslesen_tip = resolve_room_type_name(oda_tipi, tum_tipler)
            if not eslesen_tip:
                return {
                    "bos_oda_sayisi": 0,
                    "musait_oda_sayisi": 0,
                    "istenen_oda_tipi": oda_tipi,
                    "eslesen_oda_tipi": None
                }
            secili_oda_tipi = eslesen_tip
        
        sorgu = """
            SELECT o.oda_no, ot.odaTur_adi AS oda_tipi
            FROM Odalar o
            JOIN Oda_Turleri ot ON o.odaTur_id = ot.odaTur_id
            WHERE o.oda_durumu != 'Arızalı'
            AND o.oda_id NOT IN (
                SELECT oda_id FROM Rezervasyonlar
                WHERE rezerve_durumu NOT IN ('İptal Edildi', 'Tamamlandı')
                AND (rezerve_giris_tarihi < %s AND rezerve_cikis_tarihi > %s)
            )
        """
        parametreler = [cikis_tarihi, giris_tarihi]

        if oda_tipi != "all":
            sorgu += " AND ot.odaTur_adi = %s"
            parametreler.append(secili_oda_tipi)

        sorgu += " ORDER BY o.oda_no ASC"
        cursor.execute(sorgu, tuple(parametreler))
        odalar = cursor.fetchall() or []
        sayi = len(odalar)
        return {
            "bos_oda_sayisi": sayi,
            "musait_oda_sayisi": sayi,
            "odalar": odalar,
            "istenen_oda_tipi": oda_tipi,
            "eslesen_oda_tipi": secili_oda_tipi if oda_tipi != "all" else "all"
        }
    finally:
        close_db(conn, cursor)


@app.post("/rezervasyonlar")
def rezervasyon_olustur(veri: YeniRezervasyon):
    giris = parse_iso_date(veri.giris_tarihi, "giris_tarihi")
    cikis = parse_iso_date(veri.cikis_tarihi, "cikis_tarihi")
    if cikis <= giris:
        raise HTTPException(status_code=422, detail="cikis_tarihi giris_tarihi'nden sonra olmalidir.")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        
        # 1. Adım: Frontend'den gelen oda_no'dan veritabanındaki oda_id'yi bul
        cursor.execute("SELECT oda_id FROM Odalar WHERE oda_no = %s AND oda_durumu != 'Arızalı'", (veri.oda_no,))
        oda = cursor.fetchone()
        
        if not oda:
            raise HTTPException(status_code=404, detail=f"{veri.oda_no} numaralı oda bulunamadı veya arızalı.")
            
        # 2. Adım: HİLAL'İN VERİTABANI PROSEDÜRÜNÜ ÇAĞIR
        cursor.callproc(
            "sp_YeniRezervasyonEkle", 
            (veri.ad, veri.soyad, veri.tc_kimlik, veri.telefon, veri.email, oda["oda_id"], veri.giris_tarihi, veri.cikis_tarihi)
        )
        
        conn.commit()
        return {"basarili": True, "mesaj": f"{veri.oda_no} numaralı oda için rezervasyonunuz 'Beklemede' statüsüyle oluşturuldu."}
        
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        # Uğur'un orijinal tarzı: Hiçbir yeni import gerektirmez!
        conn.rollback()
        hata_mesaji = str(e)
        print("Rezervasyon Kayıt Hatası:", hata_mesaji)
        raise HTTPException(status_code=400, detail=hata_mesaji)
    finally:
        close_db(conn, cursor)


@app.get("/rezervasyonlar")
def tum_rezervasyonlari_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_REZERVASYON_LISTESI)
        return cursor.fetchall()
    finally:
        close_db(conn, cursor)


@app.post("/rezervasyonlar/hizmet-ekle")
def harcama_ekle(veri: HizmetEkleme):
    if veri.adet < 1:
        raise HTTPException(status_code=422, detail="adet en az 1 olmalidir")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_HizmetEkle", (veri.rezervasyon_id, veri.hizmet_id, veri.adet))
        conn.commit()
        return {"mesaj": "Harcama basariyla eklendi."}
    finally:
        close_db(conn, cursor)


@app.put("/rezervasyonlar/durum")
def rezervasyon_durum_guncelle(veri: RezervasyonDurum):
    izinli_durumlar = {"Beklemede", "Onaylandı", "Tamamlandı", "İptal Edildi"}
    if veri.yeni_durum not in izinli_durumlar:
        raise HTTPException(status_code=422, detail="Gecersiz rezervasyon durumu")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_RezervasyonDurumGuncelle", (veri.rezervasyon_id, veri.yeni_durum))
        conn.commit()
        return {"mesaj": f"Rezervasyon durumu '{veri.yeni_durum}' olarak guncellendi."}
    finally:
        close_db(conn, cursor)


@app.put("/ayarlar/oda-fiyat")
def oda_fiyati_guncelle(veri: FiyatGuncelleme):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_OdaTuruGuncelle", (veri.oda_turu_adi, veri.yeni_fiyat, veri.yeni_kapasite))
        conn.commit()
        return {"mesaj": "Oda turu fiyati basariyla guncellendi."}
    finally:
        close_db(conn, cursor)


@app.get("/musteriler")
def tum_musterileri_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        sorgu = """
            SELECT 
                v.*, 
                m.musteri_tc_no AS tc_kimlik, 
                m.musteri_email AS email, 
                m.musteri_telefon AS telefon 
            FROM vw_aktif_musteriler v
            JOIN Rezervasyonlar r ON v.rezervasyon_id = r.rezervasyon_id
            JOIN Musteriler m ON r.musteri_id = m.musteri_id
            WHERE v.rezerve_giris_tarihi <= CURDATE() AND v.rezerve_cikis_tarihi >= CURDATE()
        """
        cursor.execute(sorgu)
        musteriler = cursor.fetchall()
        return {"musteri_sayisi": len(musteriler), "musteriler": musteriler}
    finally:
        close_db(conn, cursor)


@app.get("/aktif-misafirler")
def aktif_misafirleri_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_AKTIF_MUSTERILER)
        return cursor.fetchall()
    finally:
        close_db(conn, cursor)


@app.get("/finans/odeme-bekleyenler")
def odeme_bekleyenleri_getir():
    conn = get_db_connection()
    if not conn:
        return []
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_AKTIF_BORCLAR)
        return cursor.fetchall()
    except Exception as e:
        print("Bekleyen Ödeme Hatası:", str(e))
        return []
    finally:
        close_db(conn, cursor)


@app.post("/finans/fatura-kes/{rezervasyon_id}")
def fatura_kes(rezervasyon_id: int, odeme_yontemi: str):
    izinli_odeme_yontemleri = {"Nakit", "Kredi Kartı"}
    if odeme_yontemi not in izinli_odeme_yontemleri:
        raise HTTPException(status_code=422, detail="odeme_yontemi sadece 'Nakit' veya 'Kredi Kartı' olabilir")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_FaturaKes", (rezervasyon_id, odeme_yontemi))
        conn.commit()
        return {"mesaj": f"{rezervasyon_id} ID'li rezervasyonun faturasi kesildi ogrenildi."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_db(conn, cursor)


@app.post("/login")
def sisteme_giris_yap(bilgiler: PersonelGiris):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_PERSONEL_GIRIS, (bilgiler.kullanici_adi, bilgiler.sifre))
        personel = cursor.fetchone()
        if personel:
            return {
                "mesaj": "Giris basarili",
                "token": f"fake-jwt-token-{personel['personel_id']}",
                "role": personel["personel_rol"],
            }
        raise HTTPException(status_code=401, detail="Gecersiz kullanici adi veya sifre")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_db(conn, cursor)


@app.put("/ayarlar/hizmet-fiyat")
def hizmet_fiyati_guncelle(veri: HizmetFiyatGuncelleme):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_HizmetFiyatGuncelle", (veri.hizmet_adi, veri.yeni_fiyat))
        conn.commit()
        return {"mesaj": f"{veri.hizmet_adi} hizmetinin fiyati basariyla guncellendi."}
    finally:
        close_db(conn, cursor)


@app.delete("/rezervasyonlar/hizmet-sil")
def hizmet_sil(veri: HizmetSilVerisi):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor()
        sorgu = "DELETE FROM Rezervasyon_Hizmetleri WHERE rezervasyon_id = %s AND hizmet_id = %s LIMIT 1"
        cursor.execute(sorgu, (veri.rezervasyon_id, veri.hizmet_id))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Silinecek hizmet kaydi bulunamadi")
        return {"mesaj": "Hizmet faturadan başarıyla silindi."}
    finally:
        close_db(conn, cursor)


@app.get("/rezervasyonlar/{rezervasyon_id}/hizmetler")
def rezervasyon_hizmetlerini_getir(rezervasyon_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        sorgu = """
            SELECT rh.hizmet_id, h.hizmet_adi, h.hizmet_birim_fiyat, rh.hizmet_adet
            FROM Rezervasyon_Hizmetleri rh
            JOIN Hizmetler h ON rh.hizmet_id = h.hizmet_id
            WHERE rh.rezervasyon_id = %s
        """
        cursor.execute(sorgu, (rezervasyon_id,))
        return cursor.fetchall()
    finally:
        close_db(conn, cursor)


@app.put("/odalar/durum")
def oda_durumunu_guncelle(veri: OdaDurumVerisi):
    izinli_oda_durumlari = {"Boş", "Dolu", "Temizlikte", "Arızalı"}
    if veri.yeni_durum not in izinli_oda_durumlari:
        raise HTTPException(status_code=422, detail="Gecersiz oda durumu")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor()
        sorgu = "UPDATE Odalar SET oda_durumu = %s WHERE oda_no = %s"
        cursor.execute(sorgu, (veri.yeni_durum, veri.oda_no))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Belirtilen oda bulunamadi")
        return {"mesaj": f"{veri.oda_no} numaralı oda durumu '{veri.yeni_durum}' olarak güncellendi."}
    finally:
        close_db(conn, cursor)


@app.get("/odalar/fiyatlar")
def oda_fiyatlarini_getir():
    conn = get_db_connection()
    if not conn:
        return []
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        sorgu = "SELECT odaTur_adi AS oda_tipi, odaTur_taban_fiyat AS fiyat FROM Oda_Turleri"
        cursor.execute(sorgu)
        return cursor.fetchall()
    finally:
        close_db(conn, cursor)


# Ece'nin İstediği Yeni Log Getirme Endpoint'i
@app.get("/islem-kayitlari")
def islem_kayitlarini_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_ISLEM_KAYITLARI)
        return cursor.fetchall()
    finally:
        close_db(conn, cursor)