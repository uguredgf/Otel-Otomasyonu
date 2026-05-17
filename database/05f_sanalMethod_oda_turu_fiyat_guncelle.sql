-- Oda türlerinin taban fiyatlarını ve kapasitesini isimlerine göre dinamik olarak güncellemek için oluşturulan prosedür
DROP PROCEDURE IF EXISTS sp_OdaTuruGuncelle;
DELIMITER //

CREATE PROCEDURE sp_OdaTuruGuncelle(
    IN p_oda_turu_adi VARCHAR(100),
    IN p_yeni_fiyat DECIMAL(10,2),
    IN p_yeni_kapasite INT
)
BEGIN
    -- Oda türünün hem fiyatını hem de kapasitesini ismine göre güncelliyoruz
    UPDATE Oda_Turleri 
    SET 
        odaTur_taban_fiyat = p_yeni_fiyat,
        odaTur_kapasite = p_yeni_kapasite
    WHERE odaTur_adi = p_oda_turu_adi;
    
END //

DELIMITER ;