-- Henüz faturası kesilmemiş müşterilerin bilgilerini gösteren sanal tablo  

CREATE VIEW vw_fatura_bekleyenler AS
SELECT 
    r.rezervasyon_id,
    m.musteri_adi,
    m.musteri_soyadi,
    o.oda_no,
    r.rezerve_cikis_tarihi
FROM Rezervasyonlar r
JOIN Musteriler m ON r.musteri_id = m.musteri_id
JOIN Odalar o ON r.oda_id = o.oda_id
LEFT JOIN Faturalar f ON r.rezervasyon_id = f.rezervasyon_id
WHERE r.rezerve_durumu = 'Tamamlandı' AND f.fatura_id IS NULL;