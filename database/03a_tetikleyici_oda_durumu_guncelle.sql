-- Rezervasyon Durumu Değiştiğinde Oda Durumunu OtomatikGüncelleyen Tetikleyici
DROP TRIGGER IF EXISTS trg_oda_durumu_guncelle;

DELIMITER //

CREATE TRIGGER trg_oda_durumu_guncelle
AFTER UPDATE ON Rezervasyonlar
FOR EACH ROW
BEGIN
    -- 1. Aşama: Rezervasyon ONAYLANDI ise odayı DOLU yap
    IF NEW.rezerve_durumu = 'Onaylandı' THEN
        UPDATE Odalar 
        SET oda_durumu = 'Dolu' 
        WHERE oda_id = NEW.oda_id;
        
    -- 2. Aşama: Rezervasyon TAMAMLANDI (müşteri çıktı) ise odayı TEMİZLİKTE yap
    ELSEIF NEW.rezerve_durumu = 'Tamamlandı' THEN
        UPDATE Odalar 
        SET oda_durumu = 'Temizlikte' 
        WHERE oda_id = NEW.oda_id;
        
    -- 3. Aşama: Rezervasyon İPTAL EDİLDİ ise odayı tekrar BOŞ yap
    ELSEIF NEW.rezerve_durumu = 'İptal Edildi' THEN
        UPDATE Odalar 
        SET oda_durumu = 'Boş' 
        WHERE oda_id = NEW.oda_id;
        
    END IF;
END //

DELIMITER ;