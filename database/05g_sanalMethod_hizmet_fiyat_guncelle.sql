-- Admin kısmında fiyatları güncellenen hizmetleri veritabanına yansıtmak için prosedür.
DROP PROCEDURE IF EXISTS sp_HizmetFiyatGuncelle;

DELIMITER //

CREATE PROCEDURE sp_HizmetFiyatGuncelle(
    IN p_hizmet_adi VARCHAR(100),
    IN p_yeni_fiyat DECIMAL(10, 2) 
)
BEGIN
    -- Hizmet ismine göre fiyatı güncelle
    UPDATE Hizmetler 
    SET hizmet_birim_fiyat = p_yeni_fiyat
    WHERE hizmet_adi = p_hizmet_adi;

    -- Kim, hangi hizmetin fiyatını değiştirdi loglayalım
    INSERT INTO Islem_Kayitlari (personel_id, kayit_islem_tipi, kayit_aciklama)
    VALUES (1, 'Hizmet Fiyat Guncelleme', CONCAT(p_hizmet_adi, ' fiyati ', p_yeni_fiyat, ' TL olarak degistirildi.'));
END //

DELIMITER ;