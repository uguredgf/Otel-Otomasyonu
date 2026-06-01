# backend/queries.py

# TEMEL TABLO SORGULARI
GET_PERSONEL_GIRIS = """
    SELECT personel_id, personel_rol 
    FROM Personeller 
    WHERE personel_kullanici_adi = %s AND personel_sifre = %s
"""

# VIEW YAPILARI, GÜNCELLEMELER
GET_AKTIF_MUSTERILER = "SELECT * FROM vw_aktif_musteriler WHERE rezerve_giris_tarihi <= CURDATE() AND rezerve_cikis_tarihi >= CURDATE()"
GET_FATURA_BEKLEYENLER = "SELECT * FROM vw_fatura_bekleyenler"
GET_DASHBOARD_OZET = "SELECT * FROM vw_dashboard_ozet"
GET_REZERVASYON_LISTESI = "SELECT * FROM vw_rezervasyon_listesi ORDER BY rezerve_giris_tarihi DESC, rezervasyon_id DESC"

# Yeni Akıllı Oda Sorgumuz (Tarih Kontrollü ve Senkronize)
GET_ODA_DETAYLARI = """
    SELECT 
        od.oda_id, 
        od.odaNumarasi, 
        od.kat, 
        od.tip, 
        od.kapasite, 
        od.fiyat,
        CASE 
            WHEN od.durum IN ('Arızalı', 'Temizlikte') THEN od.durum
            WHEN am.oda_no IS NOT NULL THEN 'Dolu'
            ELSE 'Boş'
        END as durum
    FROM vw_oda_detaylari od
    LEFT JOIN (
        SELECT DISTINCT oda_no 
        FROM vw_aktif_musteriler 
        WHERE rezerve_giris_tarihi <= CURDATE() AND rezerve_cikis_tarihi >= CURDATE()
    ) am ON od.odaNumarasi = am.oda_no
"""

GET_AKTIF_BORCLAR = "SELECT * FROM vw_aktif_borclar"

# Frontendin Renkli Rozetleri İçin İşlem Logları Sorgusu
GET_ISLEM_KAYITLARI = """
    SELECT 
        kayit_id, 
        personel_id, 
        kayit_islem_tipi AS type, 
        kayit_aciklama AS aciklama, 
        kayit_islem_tarihi AS tarih 
    FROM Islem_Kayitlari 
    ORDER BY kayit_islem_tarihi DESC
"""