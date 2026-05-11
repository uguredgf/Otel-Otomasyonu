-- Ece'nin Oda Kartlarını (Dolu/Boş/Fiyat) Otomatik Besleyen View
DROP VIEW IF EXISTS vw_oda_detaylari;

CREATE VIEW vw_oda_detaylari AS
SELECT 
    o.oda_id,
    o.oda_no,
    o.oda_kat,
    ot.odaTur_adi,
    ot.odaTur_kapasite,
    ot.odaTur_taban_fiyat,
    o.oda_durumu
FROM Odalar o
JOIN Oda_Turleri ot ON o.odaTur_id = ot.odaTur_id;