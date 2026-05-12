-- Yönetim Paneli İçin Özet Veriler View'ı
DROP VIEW IF EXISTS vw_dashboard_ozet;

CREATE VIEW vw_dashboard_ozet AS
SELECT 
    -- 1. Toplam Rezervasyon Kutusu
    (SELECT COUNT(*) FROM Rezervasyonlar) AS toplam_rezervasyon,
    
    -- 2. Beklenen Giriş Kutusu (Onay bekleyen veya girişi beklenenler)
    (SELECT COUNT(*) FROM Rezervasyonlar WHERE rezerve_durumu = 'Beklemede') AS beklenen_giris_sayisi,
    
    -- 3. Toplam Ciro Kutusu
    (SELECT IFNULL(SUM(fatura_toplam_tutar), 0) FROM Faturalar) AS toplam_ciro,
    
    -- 4. Oda Durum Özetleri
    (SELECT COUNT(*) FROM Odalar WHERE oda_durumu = 'Dolu') AS dolu_oda_sayisi,
    (SELECT COUNT(*) FROM Odalar WHERE oda_durumu = 'Boş') AS bos_oda_sayisi,
    (SELECT COUNT(*) FROM Odalar WHERE oda_durumu = 'Temizlikte') AS temizlikteki_oda_sayisi
FROM DUAL; 