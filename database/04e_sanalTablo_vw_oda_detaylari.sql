DROP VIEW IF EXISTS vw_oda_detaylari;

CREATE VIEW vw_oda_detaylari AS
SELECT 
    o.oda_id,
    o.oda_no AS odaNumarasi, 
    o.oda_kat AS kat,
    ot.odaTur_adi AS tip,
    ot.odaTur_kapasite AS kapasite,
    ot.odaTur_taban_fiyat AS fiyat,
    o.oda_durumu AS durum,
    CASE 
        WHEN o.oda_durumu = 'Boş' THEN 'oda-bos'
        WHEN o.oda_durumu = 'Dolu' THEN 'oda-dolu'
        WHEN o.oda_durumu = 'Temizlikte' THEN 'oda-temizlik'
        WHEN o.oda_durumu = 'Arızalı' THEN 'oda-arizali'
        ELSE 'oda-bos'
    END AS durumSinifi
FROM Odalar o
JOIN Oda_Turleri ot ON o.odaTur_id = ot.odaTur_id
ORDER BY o.oda_id ASC; 