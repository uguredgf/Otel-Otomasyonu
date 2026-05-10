<<<<<<< HEAD
-- Rezervasyon Durumu Değiştiğinde Oda Durumunu OtomatikGüncelleyen Tetikleyici
=======
﻿-- Rezervasyon Durumu Değiştiğinde Oda Durumunu Otomatik Güncelleyen Tetikleyici
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
DROP TRIGGER IF EXISTS trg_oda_durumu_guncelle;

DELIMITER //

CREATE TRIGGER trg_oda_durumu_guncelle
AFTER UPDATE ON Rezervasyonlar
FOR EACH ROW
BEGIN
<<<<<<< HEAD
    -- 1. Aşama: Rezervasyon ONAYLANDI ise odayı DOLU yap
    IF NEW.rezerve_durumu = 'Onaylandı' THEN
=======
    -- 1. A┼şama: Rezervasyon ONAYLANDI ise oday─▒ DOLU yap
    IF NEW.rezerve_durumu = 'Onayland─▒' THEN
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        UPDATE Odalar 
        SET oda_durumu = 'Dolu' 
        WHERE oda_id = NEW.oda_id;
        
<<<<<<< HEAD
    -- 2. Aşama: Rezervasyon TAMAMLANDI (müşteri çıktı) ise odayı TEMİZLİKTE yap
    ELSEIF NEW.rezerve_durumu = 'Tamamlandı' THEN
=======
    -- 2. A┼şama: Rezervasyon TAMAMLANDI (m├╝┼şteri ├ğ─▒kt─▒) ise oday─▒ TEM─░ZL─░KTE yap
    ELSEIF NEW.rezerve_durumu = 'Tamamland─▒' THEN
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        UPDATE Odalar 
        SET oda_durumu = 'Temizlikte' 
        WHERE oda_id = NEW.oda_id;
        
<<<<<<< HEAD
    -- 3. Aşama: Rezervasyon İPTAL EDİLDİ ise odayı tekrar BOŞ yap
    ELSEIF NEW.rezerve_durumu = 'İptal Edildi' THEN
        UPDATE Odalar 
        SET oda_durumu = 'Boş' 
=======
    -- 3. A┼şama: Rezervasyon ─░PTAL ED─░LD─░ ise oday─▒ tekrar BO┼Ş yap
    ELSEIF NEW.rezerve_durumu = '─░ptal Edildi' THEN
        UPDATE Odalar 
        SET oda_durumu = 'Bo┼ş' 
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        WHERE oda_id = NEW.oda_id;
        
    END IF;
END //

<<<<<<< HEAD
DELIMITER ;
=======
DELIMITER ;
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
