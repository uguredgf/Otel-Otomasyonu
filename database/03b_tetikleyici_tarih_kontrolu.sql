<<<<<<< HEAD
-- Rezervasyon Tarih Kontrolü İçin Yazılan Trigger
=======
﻿-- Rezervasyon Tarih Kontrol├╝ ─░├ğin Yaz─▒lan Trigger
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
DROP TRIGGER IF EXISTS trg_tarih_kontrol;
DELIMITER //

CREATE TRIGGER trg_tarih_kontrol
BEFORE INSERT ON Rezervasyonlar
FOR EACH ROW
BEGIN

<<<<<<< HEAD
    -- Eğer çıkış tarihi, giriş tarihinden daha eski bir günse veya aynı günse:
    IF NEW.rezerve_cikis_tarihi <= NEW.rezerve_giris_tarihi THEN
        
        -- İşlemi iptal et ve backend tarafına  şu hatayı fırlat:
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Hata: Çıkış tarihi, giriş tarihinden daha önce veya aynı gün olamaz!';
=======
    -- E─şer ├ğ─▒k─▒┼ş tarihi, giri┼ş tarihinden daha eski bir g├╝nse veya ayn─▒ g├╝nse:
    IF NEW.rezerve_cikis_tarihi <= NEW.rezerve_giris_tarihi THEN
        
        -- ─░┼şlemi iptal et ve backend taraf─▒na  ┼şu hatay─▒ f─▒rlat:
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Hata: ├ç─▒k─▒┼ş tarihi, giri┼ş tarihinden daha ├Ânce veya ayn─▒ g├╝n olamaz!';
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        
    END IF;

END //

<<<<<<< HEAD
DELIMITER ;
=======
DELIMITER ;
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
