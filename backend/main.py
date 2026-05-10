# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import get_db_connection
import mysql.connector
import queries # SQL sorgularımızı ayrı dosyadan çekiyoruz

app = FastAPI(title="Otel Otomasyonu API")

# --- PYDANTIC MODELLERİ ---
class MusteriEkle(BaseModel):
    musteri_adi: str
    musteri_soyadi: str
    musteri_tc_no: str
    musteri_telefon: str = None
    musteri_email: str = None

class PersonelGiris(BaseModel):
    kullanici_adi: str
    sifre: str
# --- API UÇLARI (ENDPOINTS) ---

@app.get("/")
def ana_sayfa():
    return {"mesaj": "Otel Otomasyonu Backend Sistemi Çalışıyor!"}

@app.get("/odalar/musait")
def musait_odalari_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor(dictionary=True)
        # Uzun SQL yerine queries dosyasındaki değişkeni çağırdık
        cursor.execute(queries.GET_MUSAIT_ODALAR) 
        musait_odalar = cursor.fetchall()
        return {"musait_oda_sayisi": len(musait_odalar), "odalar": musait_odalar}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/musteriler", status_code=201)
def yeni_musteri_ekle(musteri: MusteriEkle):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor()
        degerler = (musteri.musteri_adi, musteri.musteri_soyadi, musteri.musteri_tc_no, musteri.musteri_telefon, musteri.musteri_email)
        
        # Uzun SQL yerine queries dosyasındaki değişkeni çağırdık
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

@app.get("/musteriler")
def tum_musterileri_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor(dictionary=True)
        # Uzun SQL yerine queries dosyasındaki değişkeni çağırdık
        cursor.execute(queries.GET_TUM_MUSTERILER)
        musteriler = cursor.fetchall()
        return {"musteri_sayisi": len(musteriler), "musteriler": musteriler}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# 1. Aktif Misafirleri Listeleme (Dashboard için)
@app.get("/aktif-misafirler")
def aktif_misafirleri_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_AKTIF_MUSTERILER)
        return cursor.fetchall()
    finally:
        conn.close()

# 2. Ödeme Bekleyenleri Listeleme
@app.get("/finans/odeme-bekleyenler")
def odeme_bekleyenleri_getir():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(queries.GET_FATURA_BEKLEYENLER)
        return cursor.fetchall()
    finally:
        conn.close()

# 3. Fatura Kesme İşlemi (Stored Procedure Tetikleme)
@app.post("/finans/fatura-kes/{rezervasyon_id}")
def fatura_kes(rezervasyon_id: int, odeme_yontemi: str = "Nakit"):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        # Hilal'in yazdığı SQL metodunu çağırıyoruz
        # Procedure parametreleri: rezervasyon_id ve odeme_yontemi
        cursor.callproc('sp_FaturaKes', (rezervasyon_id, odeme_yontemi))
        conn.commit()
        return {"mesaj": f"{rezervasyon_id} ID'li rezervasyonun faturası kesildi ve oda temizliğe alındı."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/login")
def sisteme_giris_yap(bilgiler: PersonelGiris):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor(dictionary=True)
        # Kullanıcının gönderdiği ad ve şifreyi veritabanında arıyoruz
        cursor.execute(queries.GET_PERSONEL_GIRIS, (bilgiler.kullanici_adi, bilgiler.sifre))
        personel = cursor.fetchone()

        if personel:
            # Şifre doğruysa Ece'nin istediği formatta token/rol bilgisini dönüyoruz
            return {
                "mesaj": "Giriş başarılı",
                "token": f"fake-jwt-token-{personel['personel_id']}", # Şimdilik simülasyon token'ı
                "role": personel['personel_rol']
            }
        else:
            # Şifre veya kullanıcı adı yanlışsa hata fırlatıyoruz
            raise HTTPException(status_code=401, detail="Geçersiz kullanıcı adı veya şifre")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()