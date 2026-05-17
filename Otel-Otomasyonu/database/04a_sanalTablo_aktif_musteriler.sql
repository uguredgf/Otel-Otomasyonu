-- Otelde Aktif  Bulunan Kişilerin Listesini Gösteren Sanal Tablo

DROP VIEW IF EXISTS vw_aktif_musteriler;
CREATE VIEW vw_aktif_musteriler AS
SELECT 
    r.rezervasyon_id,
    m.musteri_adi,
    m.musteri_soyadi,
    m.musteri_telefon,
    o.oda_no,
    r.rezerve_giris_tarihi,
    r.rezerve_cikis_tarihi
FROM Rezervasyonlar r
JOIN Musteriler m ON r.musteri_id = m.musteri_id
JOIN Odalar o ON r.oda_id = o.oda_id
WHERE r.rezerve_durumu = 'Onaylandı';