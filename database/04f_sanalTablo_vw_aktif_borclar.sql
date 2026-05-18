CREATE OR REPLACE VIEW vw_aktif_borclar AS
SELECT 
    CONCAT(am.musteri_adi, ' ', am.musteri_soyadi, ' (Oda ', am.oda_no, ')') AS musteri_adi,
    (DATEDIFF(am.rezerve_cikis_tarihi, am.rezerve_giris_tarihi) * od.fiyat) AS tutar
FROM vw_aktif_musteriler am
JOIN vw_oda_detaylari od ON am.oda_no = od.odaNumarasi
WHERE am.rezerve_giris_tarihi <= CURDATE() AND am.rezerve_cikis_tarihi >= CURDATE()
ORDER BY tutar DESC;