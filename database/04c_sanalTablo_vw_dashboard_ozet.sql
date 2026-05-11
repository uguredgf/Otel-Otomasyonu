-- Yönetim Paneli İçin Özet Veriler View'ı
DROP VIEW IF EXISTS vw_dashboard_ozet;

CREATE VIEW vw_dashboard_ozet AS
SELECT 
    (SELECT COUNT(*) FROM Odalar WHERE oda_durumu = 'Dolu') AS dolu_oda_sayisi,
    (SELECT COUNT(*) FROM Odalar WHERE oda_durumu = 'Boş') AS bos_oda_sayisi,
    (SELECT COUNT(*) FROM Odalar WHERE oda_durumu = 'Temizlikte') AS temizlikteki_oda_sayisi,
    (SELECT IFNULL(SUM(fatura_toplam_tutar), 0) FROM Faturalar) AS toplam_ciro,
    (SELECT COUNT(*) FROM Rezervasyonlar WHERE rezerve_durumu = 'Beklemede') AS bekleyen_rezervasyon_sayisi
FROM DUAL;