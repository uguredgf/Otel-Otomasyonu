-- Yeni bir hizmet eklemek için basit metot
DROP PROCEDURE IF EXISTS sp_HizmetEkle;
DELIMITER //

CREATE PROCEDURE sp_HizmetEkle(
    IN p_rezervasyon_id INT,
    IN p_hizmet_id INT,
    IN p_adet INT
)
BEGIN
    INSERT INTO Rezervasyon_Hizmetleri (rezervasyon_id, hizmet_id, hizmet_adet)
    VALUES (p_rezervasyon_id, p_hizmet_id, p_adet);
END //

DELIMITER ;