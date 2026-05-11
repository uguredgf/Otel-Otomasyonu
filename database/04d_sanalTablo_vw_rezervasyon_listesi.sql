-- Tüm Rezervasyon Detaylarını ve Ödeme Durumunu Gösteren View
DROP VIEW IF EXISTS vw_rezervasyon_listesi;

CREATE VIEW vw_rezervasyon_listesi AS
SELECT 
    r.rezervasyon_id,
    m.musteri_adi,
    m.musteri_soyadi,
    o.oda_no,
    ot.odaTur_adi,
    r.rezerve_giris_tarihi,
    r.rezerve_cikis_tarihi,
    r.rezerve_durumu,
    -- Fatura tablosunda kayıt varsa 'Ödendi', yoksa 'Bekliyor'
    CASE 
        WHEN f.fatura_id IS NOT NULL THEN 'Ödendi'
        ELSE 'Ödeme Bekliyor'
    END AS odeme_durumu
FROM Rezervasyonlar r
JOIN Musteriler m ON r.musteri_id = m.musteri_id
JOIN Odalar o ON r.oda_id = o.oda_id
JOIN Oda_Turleri ot ON o.odaTur_id = ot.odaTur_id
LEFT JOIN Faturalar f ON r.rezervasyon_id = f.rezervasyon_id;