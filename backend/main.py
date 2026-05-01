# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel # Gelen veriyi kontrol etmek için bunu ekledik
from database import get_db_connection
import mysql.connector # Hata yakalama (IntegrityError) için gerekli

app = FastAPI(title="Otel Otomasyonu API")

# --- PYDANTIC MODELLERİ ---
# Dışarıdan gelecek müşteri verisinin şablonu (ID yok çünkü veritabanı kendi atıyor)
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

@app.get("/odalar/musait")
def musait_odalari_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor(dictionary=True)
        sorgu = """
            SELECT o.oda_no, o.oda_kat, t.odaTur_adi, t.odaTur_taban_fiyat
            FROM Odalar o
            JOIN Oda_Turleri t ON o.odaTur_id = t.odaTur_id
            WHERE o.oda_durumu = 'Boş'
        """
        cursor.execute(sorgu)
        musait_odalar = cursor.fetchall()
        return {"musait_oda_sayisi": len(musait_odalar), "odalar": musait_odalar}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# Senaryo 2: Yeni Müşteri Kaydetme API'si (POST)
@app.post("/musteriler", status_code=201)
def yeni_musteri_ekle(musteri: MusteriEkle):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor()
        # SQL Injection saldırılarına karşı %s (parametre) yöntemi kullanılır
        sorgu = """
            INSERT INTO Musteriler (musteri_adi, musteri_soyadi, musteri_tc_no, musteri_telefon, musteri_email)
            VALUES (%s, %s, %s, %s, %s)
        """
        degerler = (musteri.musteri_adi, musteri.musteri_soyadi, musteri.musteri_tc_no, musteri.musteri_telefon, musteri.musteri_email)
        
        cursor.execute(sorgu, degerler)
        yeni_id = cursor.lastrowid # ÖNCE otomatik atanan ID'yi alıyoruz
        conn.commit() # SONRA işlemi veritabanına kalıcı olarak kaydediyoruz

        return {"mesaj": "Müşteri başarıyla eklendi", "musteri_id": yeni_id}

    except mysql.connector.IntegrityError:
        # TC Kimlik alanı veritabanında UNIQUE olduğu için aynı TC ile biri gelirse çökmesin diye bu hatayı yakalıyoruz.
        raise HTTPException(status_code=400, detail="Bu TC Kimlik numarası ile sistemde zaten bir kayıt var.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


# Senaryo 3: Tüm Müşterileri Listeleme API'si (GET)
@app.get("/musteriler")
def tum_musterileri_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor(dictionary=True)
        sorgu = "SELECT * FROM Musteriler ORDER BY musteri_id DESC" # En son eklenenler en üstte görünsün
        cursor.execute(sorgu)
        musteriler = cursor.fetchall()
        return {"musteri_sayisi": len(musteriler), "musteriler": musteriler}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()