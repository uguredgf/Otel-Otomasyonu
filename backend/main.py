# backend/main.py
from fastapi import FastAPI, HTTPException
<<<<<<< HEAD
from pydantic import BaseModel
from database import get_db_connection
import mysql.connector
import queries # SQL sorgularımızı ayrı dosyadan çekiyoruz
=======
from pydantic import BaseModel # Gelen veriyi kontrol etmek için bunu ekledik
from database import get_db_connection
import mysql.connector # Hata yakalama (IntegrityError) için gerekli
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)

app = FastAPI(title="Otel Otomasyonu API")

# --- PYDANTIC MODELLERİ ---
<<<<<<< HEAD
=======
# Dışarıdan gelecek müşteri verisinin şablonu (ID yok çünkü veritabanı kendi atıyor)
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
class MusteriEkle(BaseModel):
    musteri_adi: str
    musteri_soyadi: str
    musteri_tc_no: str
    musteri_telefon: str = None
    musteri_email: str = None

<<<<<<< HEAD
class PersonelGiris(BaseModel):
    kullanici_adi: str
    sifre: str
=======
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
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
<<<<<<< HEAD
        # Uzun SQL yerine queries dosyasındaki değişkeni çağırdık
        cursor.execute(queries.GET_MUSAIT_ODALAR) 
=======
        sorgu = """
            SELECT o.oda_no, o.oda_kat, t.odaTur_adi, t.odaTur_taban_fiyat
            FROM Odalar o
            JOIN Oda_Turleri t ON o.odaTur_id = t.odaTur_id
            WHERE o.oda_durumu = 'Boş'
        """
        cursor.execute(sorgu)
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        musait_odalar = cursor.fetchall()
        return {"musait_oda_sayisi": len(musait_odalar), "odalar": musait_odalar}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

<<<<<<< HEAD
=======
# Senaryo 2: Yeni Müşteri Kaydetme API'si (POST)
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
@app.post("/musteriler", status_code=201)
def yeni_musteri_ekle(musteri: MusteriEkle):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor()
<<<<<<< HEAD
        degerler = (musteri.musteri_adi, musteri.musteri_soyadi, musteri.musteri_tc_no, musteri.musteri_telefon, musteri.musteri_email)
        
        # Uzun SQL yerine queries dosyasındaki değişkeni çağırdık
        cursor.execute(queries.INSERT_YENI_MUSTERI, degerler)
        
        yeni_id = cursor.lastrowid 
        conn.commit() 
=======
        # SQL Injection saldırılarına karşı %s (parametre) yöntemi kullanılır
        sorgu = """
            INSERT INTO Musteriler (musteri_adi, musteri_soyadi, musteri_tc_no, musteri_telefon, musteri_email)
            VALUES (%s, %s, %s, %s, %s)
        """
        degerler = (musteri.musteri_adi, musteri.musteri_soyadi, musteri.musteri_tc_no, musteri.musteri_telefon, musteri.musteri_email)
        
        cursor.execute(sorgu, degerler)
        yeni_id = cursor.lastrowid # ÖNCE otomatik atanan ID'yi alıyoruz
        conn.commit() # SONRA işlemi veritabanına kalıcı olarak kaydediyoruz
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)

        return {"mesaj": "Müşteri başarıyla eklendi", "musteri_id": yeni_id}

    except mysql.connector.IntegrityError:
<<<<<<< HEAD
=======
        # TC Kimlik alanı veritabanında UNIQUE olduğu için aynı TC ile biri gelirse çökmesin diye bu hatayı yakalıyoruz.
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        raise HTTPException(status_code=400, detail="Bu TC Kimlik numarası ile sistemde zaten bir kayıt var.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

<<<<<<< HEAD
=======

# Senaryo 3: Tüm Müşterileri Listeleme API'si (GET)
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
@app.get("/musteriler")
def tum_musterileri_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor(dictionary=True)
<<<<<<< HEAD
        # Uzun SQL yerine queries dosyasındaki değişkeni çağırdık
        cursor.execute(queries.GET_TUM_MUSTERILER)
=======
        sorgu = "SELECT * FROM Musteriler ORDER BY musteri_id DESC" # En son eklenenler en üstte görünsün
        cursor.execute(sorgu)
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        musteriler = cursor.fetchall()
        return {"musteri_sayisi": len(musteriler), "musteriler": musteriler}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
<<<<<<< HEAD
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
=======
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
            conn.close()