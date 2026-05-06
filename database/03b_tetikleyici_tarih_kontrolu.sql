-- Rezervasyon Tarih Kontrolü İçin Yazılan Trigger
DELIMITER //

CREATE TRIGGER trg_tarih_kontrol
BEFORE INSERT ON Rezervasyonlar
FOR EACH ROW
BEGIN

    -- Eğer çıkış tarihi, giriş tarihinden daha eski bir günse veya aynı günse:
    IF NEW.rezerve_cikis_tarihi <= NEW.rezerve_giris_tarihi THEN
        
        -- İşlemi iptal et ve backend tarafına  şu hatayı fırlat:
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Hata: Çıkış tarihi, giriş tarihinden daha önce veya aynı gün olamaz!';
        
    END IF;

END //

DELIMITER ;