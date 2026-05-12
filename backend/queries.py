# backend/queries.py

# --- TEMEL TABLO SORGULARI ---
GET_PERSONEL_GIRIS = """
    SELECT personel_id, personel_rol 
    FROM Personeller 
    WHERE personel_kullanici_adi = %s AND personel_sifre = %s
"""

# --- HİLAL'İN HAZIRLADIĞI VIEW YAPILARI ---
GET_AKTIF_MUSTERILER = "SELECT * FROM vw_aktif_musteriler"
GET_FATURA_BEKLEYENLER = "SELECT * FROM vw_fatura_bekleyenler"
GET_DASHBOARD_OZET = "SELECT * FROM vw_dashboard_ozet"
GET_ODA_DETAYLARI = "SELECT * FROM vw_oda_detaylari"

# --- STORED PROCEDURE ÇAĞRILARI (Procedure isimlerini Python içinden de çağırabiliriz) ---
# sp_YeniRezervasyonEkle
# sp_FaturaKes
# sp_HizmetEkle
# sp_RezervasyonDurumGuncelle
# sp_OdaTuruGuncelle
# sp_HizmetFiyatGuncelle