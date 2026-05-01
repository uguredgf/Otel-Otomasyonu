# backend/main.py
from fastapi import FastAPI, HTTPException
from database import get_db_connection

app = FastAPI(title="Otel Otomasyonu API")

@app.get("/")
def ana_sayfa():
    return {"mesaj": "Otel Otomasyonu Backend Sistemi Çalışıyor!"}

# Senaryo 1: Müsait odaları listeleme API'si
@app.get("/odalar/musait")
def musait_odalari_getir():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantısı kurulamadı")

    try:
        cursor = conn.cursor(dictionary=True)
        # Sadece durumu 'Boş' olan odaları ve oda türü detaylarını çeken SQL sorgusu
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