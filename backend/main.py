from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_db_connection
import mysql.connector
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


@app.get("/")
def ana_sayfa():
    return {"mesaj": "Otel Otomasyonu Backend Sistemi Calisiyor!"}


@app.get("/dashboard/ozet")
def dashboard_verilerini_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_AKTIF_MUSTERILER)
        aktif_misafirler = cursor.fetchall()
        gercek_dolu_oda = len(aktif_misafirler)

        cursor.execute("SELECT COUNT(*) as toplam FROM Odalar")
        toplam_oda = cursor.fetchone()["toplam"]
        gercek_bos_oda = toplam_oda - gercek_dolu_oda

        cursor.execute(queries.GET_DASHBOARD_OZET)
        ozet = cursor.fetchone()

        if ozet:
            ozet["dolu_oda_sayisi"] = gercek_dolu_oda
            ozet["bos_oda_sayisi"] = gercek_bos_oda
            return ozet

        return {"dolu_oda_sayisi": gercek_dolu_oda, "bos_oda_sayisi": gercek_bos_oda, "toplam_ciro": 0}
    finally:
        conn.close()


@app.get("/odalar/detayli")
def tum_oda_detaylarini_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_ODA_DETAYLARI)
        return cursor.fetchall()
    finally:
        conn.close()


@app.get("/odalar/musait")
def musait_odalari_getir(giris_tarihi: str, cikis_tarihi: str, kisi_sayisi: int = 1):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")

    try:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.callproc("sp_MusaitOdaAra", (giris_tarihi, cikis_tarihi, kisi_sayisi))
        except Exception as procedure_error:
            if "expected 2, got 3" not in str(procedure_error):
                raise
            cursor.callproc("sp_MusaitOdaAra", (giris_tarihi, cikis_tarihi))

        musait_odalar = []
        for result in cursor.stored_results():
            musait_odalar = result.fetchall()

        return {"musait_oda_sayisi": len(musait_odalar), "odalar": musait_odalar}
    except Exception as e:
        print("REZERVASYON HATASI YAKALANDI:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


@app.post("/rezervasyonlar", status_code=201)
def rezervasyon_olustur(veri: YeniRezervasyon):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        parametreler = (
            veri.ad,
            veri.soyad,
            veri.tc_kimlik,
            veri.telefon,
            veri.email,
            veri.oda_tipi,
            veri.giris_tarihi,
            veri.cikis_tarihi,
        )
        cursor.callproc("sp_YeniRezervasyonEkle", parametreler)
        conn.commit()
        return {"mesaj": "Rezervasyon basariyla olusturuldu, musaitlik kontrol edildi."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@app.get("/rezervasyonlar")
def tum_rezervasyonlari_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_REZERVASYON_LISTESI)
        return cursor.fetchall()
    finally:
        conn.close()


@app.post("/rezervasyonlar/hizmet-ekle")
def harcama_ekle(veri: HizmetEkleme):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_HizmetEkle", (veri.rezervasyon_id, veri.hizmet_id, veri.adet))
        conn.commit()
        return {"mesaj": "Harcama basariyla eklendi."}
    finally:
        conn.close()


@app.put("/rezervasyonlar/durum")
def rezervasyon_durum_guncelle(veri: RezervasyonDurum):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_RezervasyonDurumGuncelle", (veri.rezervasyon_id, veri.yeni_durum))
        conn.commit()
        return {"mesaj": f"Rezervasyon durumu '{veri.yeni_durum}' olarak guncellendi."}
    finally:
        conn.close()


@app.put("/ayarlar/oda-fiyat")
def oda_fiyati_guncelle(veri: FiyatGuncelleme):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_OdaTuruGuncelle", (veri.oda_turu_adi, veri.yeni_fiyat, veri.yeni_kapasite))
        conn.commit()
        return {"mesaj": "Oda turu fiyati basariyla guncellendi."}
    finally:
        conn.close()


@app.get("/musteriler")
def tum_musterileri_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_AKTIF_MUSTERILER)
        musteriler = cursor.fetchall()
        return {"musteri_sayisi": len(musteriler), "musteriler": musteriler}
    finally:
        conn.close()


@app.get("/aktif-misafirler")
def aktif_misafirleri_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_AKTIF_MUSTERILER)
        return cursor.fetchall()
    finally:
        conn.close()


@app.get("/finans/odeme-bekleyenler")
def odeme_bekleyenleri_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_FATURA_BEKLEYENLER)
        return cursor.fetchall()
    finally:
        conn.close()


@app.post("/finans/fatura-kes/{rezervasyon_id}")
def fatura_kes(rezervasyon_id: int, odeme_yontemi: str):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_FaturaKes", (rezervasyon_id, odeme_yontemi))
        conn.commit()
        return {"mesaj": f"{rezervasyon_id} ID'li rezervasyonun faturasi kesildi ve oda temizlige alindi."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@app.post("/login")
def sisteme_giris_yap(bilgiler: PersonelGiris):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabani baglantisi kurulamadi")

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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


@app.put("/ayarlar/hizmet-fiyat")
def hizmet_fiyati_guncelle(veri: HizmetFiyatGuncelleme):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.callproc("sp_HizmetFiyatGuncelle", (veri.hizmet_adi, veri.yeni_fiyat))
        conn.commit()
        return {"mesaj": f"{veri.hizmet_adi} hizmetinin fiyati basariyla guncellendi."}
    finally:
        conn.close()
