# backend/queries.py

GET_MUSAIT_ODALAR = """
    SELECT o.oda_no, o.oda_kat, t.odaTur_adi, t.odaTur_taban_fiyat
    FROM Odalar o
    JOIN Oda_Turleri t ON o.odaTur_id = t.odaTur_id
    WHERE o.oda_durumu = 'Boş'
"""

INSERT_YENI_MUSTERI = """
    INSERT INTO Musteriler (musteri_adi, musteri_soyadi, musteri_tc_no, musteri_telefon, musteri_email)
    VALUES (%s, %s, %s, %s, %s)
"""

GET_TUM_MUSTERILER = """
    SELECT * FROM Musteriler ORDER BY musteri_id DESC
"""

GET_AKTIF_MUSTERILER = "SELECT * FROM vw_aktif_musteriler"
GET_FATURA_BEKLEYENLER = "SELECT * FROM vw_fatura_bekleyenler"

GET_PERSONEL_GIRIS = """
    SELECT personel_id, personel_rol 
    FROM Personeller 
    WHERE personel_kullanici_adi = %s AND personel_sifre = %s
"""