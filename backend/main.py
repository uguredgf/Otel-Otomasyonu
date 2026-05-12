# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import get_db_connection
import mysql.connector
import queries

app = FastAPI(title="Otel Otomasyonu API")

# --- PYDANTIC MODELLERİ ---

class YeniRezervasyon(BaseModel):
    tc_kimlik: str
    ad: str
    soyad: str
    telefon: str
    email: str
    oda_tipi: str  # Ece "Kral Dairesi" gibi bir metin gönderecek
    giris_tarihi: str
    cikis_tarihi: str
    kisi_sayisi: int

class PersonelGiris(BaseModel):
    kullanici_adi: str
    sifre: str

class HizmetEkleme(BaseModel):
    rezervasyon_id: int
    hizmet_id: int
    adet: int

class RezervasyonDurum(BaseModel):
    rezervasyon_id: int
    yeni_durum: str # 'Onaylandı', 'İptal Edildi' vb.

class FiyatGuncelleme(BaseModel):
    id: int
    yeni_fiyat: float

class MusteriEkle(BaseModel):
    musteri_adi: str
    musteri_soyadi: str
    musteri_tc_no: str
    musteri_telefon: str = None
    musteri_email: str = None


# --- API UÇLARI (ENDPOINTS) ---

@app.get("/")
def ana_sayfa():
    return {"mesaj": "Otel Otomasyonu Backend Sistemi Çalışıyor!"}

# 1. Dashboard ve Pano Verileri
@app.get("/dashboard/ozet")
def dashboard_verilerini_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_DASHBOARD_OZET)
        return cursor.fetchone() 
    finally:
        conn.close()

# 2. Oda Durumları ve Detaylı Liste (Tüm Odalar)
@app.get("/odalar/detayli")
def tum_oda_detaylarini_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_ODA_DETAYLARI)
        return cursor.fetchall()
    finally:
        conn.close()

# Sadece Müsait Odalar (Opsiyonel / Hoca Sunumu İçin)
@app.get("/odalar/musait")
def musait_odalari_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_MUSAIT_ODALAR) 
        musait_odalar = cursor.fetchall()
        return {"musait_oda_sayisi": len(musait_odalar), "odalar": musait_odalar}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# 3. Rezervasyon Oluşturma (sp_YeniRezervasyonEkle)
@app.post("/rezervasyonlar", status_code=201)
def rezervasyon_olustur(veri: YeniRezervasyon):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        parametreler = (veri.tc_kimlik, veri.ad, veri.soyad, veri.telefon, veri.email,
                        veri.oda_tipi, veri.giris_tarihi, veri.cikis_tarihi, veri.kisi_sayisi)
        cursor.callproc('sp_YeniRezervasyonEkle', parametreler)
        conn.commit()
        return {"mesaj": "Rezervasyon başarıyla oluşturuldu, müsaitlik kontrol edildi."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# 4. Hizmet Harcaması Ekleme (sp_HizmetEkle)
@app.post("/rezervasyonlar/hizmet-ekle")
def harcama_ekle(veri: HizmetEkleme):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.callproc('sp_HizmetEkle', (veri.rezervasyon_id, veri.hizmet_id, veri.adet))
        conn.commit()
        return {"mesaj": "Harcama başarıyla eklendi."}
    finally:
        conn.close()

# 5. Rezervasyon Durumu Güncelle (Onay/İptal)
@app.put("/rezervasyonlar/durum")
def rezervasyon_durum_guncelle(veri: RezervasyonDurum):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.callproc('sp_RezervasyonDurumGuncelle', (veri.rezervasyon_id, veri.yeni_durum))
        conn.commit()
        return {"mesaj": f"Rezervasyon durumu '{veri.yeni_durum}' olarak güncellendi."}
    finally:
        conn.close()

# 6. Ayarlar - Oda Türü Fiyat Güncelleme
@app.put("/ayarlar/oda-fiyat")
def oda_fiyati_guncelle(veri: FiyatGuncelleme):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.callproc('sp_OdaTuruGuncelle', (veri.id, veri.yeni_fiyat))
        conn.commit()
        return {"mesaj": "Oda türü fiyatı başarıyla güncellendi."}
    finally:
        conn.close()

# 7. Sadece Müşteri Ekleme (Hoca Sunumu İçin)
@app.post("/musteriler", status_code=201)
def yeni_musteri_ekle(musteri: MusteriEkle):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")
    try:
        cursor = conn.cursor()
        degerler = (musteri.musteri_adi, musteri.musteri_soyadi, musteri.musteri_tc_no, musteri.musteri_telefon, musteri.musteri_email)
        cursor.execute(queries.INSERT_YENI_MUSTERI, degerler)
        yeni_id = cursor.lastrowid 
        conn.commit() 
        return {"mesaj": "Müşteri başarıyla eklendi", "musteri_id": yeni_id}
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=400, detail="Bu TC Kimlik numarası ile sistemde zaten bir kayıt var.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# 8. Tüm Müşterileri Getir
@app.get("/musteriler")
def tum_musterileri_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_TUM_MUSTERILER)
        musteriler = cursor.fetchall()
        return {"musteri_sayisi": len(musteriler), "musteriler": musteriler}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# 9. Aktif Misafirleri Listeleme
@app.get("/aktif-misafirler")
def aktif_misafirleri_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_AKTIF_MUSTERILER)
        return cursor.fetchall()
    finally:
        conn.close()

# 10. Ödeme Bekleyenleri Listeleme
@app.get("/finans/odeme-bekleyenler")
def odeme_bekleyenleri_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_FATURA_BEKLEYENLER)
        return cursor.fetchall()
    finally:
        conn.close()

# 11. Fatura Kesme İşlemi
@app.post("/finans/fatura-kes/{rezervasyon_id}")
def fatura_kes(rezervasyon_id: int, odeme_yontemi: str = "Nakit"):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.callproc('sp_FaturaKes', (rezervasyon_id, odeme_yontemi))
        conn.commit()
        return {"mesaj": f"{rezervasyon_id} ID'li rezervasyonun faturası kesildi ve oda temizliğe alındı."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# 12. Personel Girişi (Login)
@app.post("/login")
def sisteme_giris_yap(bilgiler: PersonelGiris):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_PERSONEL_GIRIS, (bilgiler.kullanici_adi, bilgiler.sifre))
        personel = cursor.fetchone()
        if personel:
            return {
                "mesaj": "Giriş başarılı",
                "token": f"fake-jwt-token-{personel['personel_id']}",
                "role": personel['personel_rol']
            }
        else:
            raise HTTPException(status_code=401, detail="Geçersiz kullanıcı adı veya şifre")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()