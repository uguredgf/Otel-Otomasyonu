-- Oda türlerinin taban fiyatlarını dinamik olarak güncellemek için oluşturulan prosedür
DROP PROCEDURE IF EXISTS sp_OdaTuruFiyatGuncelle;
DELIMITER //

CREATE PROCEDURE sp_OdaTuruFiyatGuncelle(
    IN p_odaTur_id INT,
    IN p_yeni_fiyat DECIMAL(10,2)
)
BEGIN
    -- İlgili oda türünün taban fiyatını yeni fiyat ile değiştiriyoruz
    UPDATE Oda_Turleri 
    SET odaTur_taban_fiyat = p_yeni_fiyat
    WHERE odaTur_id = p_odaTur_id;
    
END //

DELIMITER ;