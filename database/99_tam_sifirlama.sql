USE otel_otomasyonu;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Islem_Kayitlari;
TRUNCATE TABLE Faturalar;
TRUNCATE TABLE Rezervasyon_Hizmetleri;
TRUNCATE TABLE Rezervasyonlar;
TRUNCATE TABLE Musteriler;
TRUNCATE TABLE Odalar;
TRUNCATE TABLE Hizmetler;
TRUNCATE TABLE Personeller;
TRUNCATE TABLE Oda_Turleri;

SET FOREIGN_KEY_CHECKS = 1;

-- Ardindan sirasiyla su dosyalari tekrar calistir:
-- 1. database/01_tablo_kurulumu.sql   (sadece tablolar yoksa)
-- 2. database/02_ornek_veriler.sql
-- 3. database/03a_tetikleyici_oda_durumu_guncelle.sql
-- 4. database/03b_tetikleyici_tarih_kontrolu.sql
-- 5. database/04a_sanalTablo_aktif_musteriler.sql
-- 6. database/04b_sanalTablo_fatura_bekleyenler.sql
-- 7. database/04c_sanalTablo_vw_dashboard_ozet.sql
-- 8. database/04d_sanalTablo_vw_rezervasyon_listesi.sql
-- 9. database/04e_sanalTablo_vw_oda_detaylari.sql
-- 10. database/05a_sanalMethod_fatura_hesapla.sql
-- 11. database/05b_sanalMethod_hizmet_ekleme.sql
-- 12. database/05c_sanalMethod_yeni_rezervasyon_ekle.sql
-- 13. database/05d_sanalMethod_musait_oda_Ara.sql
-- 14. database/05e_sanalMethod_rezervasyon_durum_guncelle.sql
