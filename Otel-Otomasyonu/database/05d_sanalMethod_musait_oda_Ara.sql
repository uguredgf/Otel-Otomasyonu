-- seçilen tarihlerde musait olan odaları bulmak için oluşturulan procedure
DROP PROCEDURE IF EXISTS sp_MusaitOdaAra;
DELIMITER //

CREATE PROCEDURE sp_MusaitOdaAra(
    IN p_giris DATE,
    IN p_cikis DATE
)
BEGIN
    -- Seçilen tarihlerde çakışan rezervasyonu olmayan odaları getir
    SELECT 
        v.odaNumarasi,
        v.tip,
        v.fiyat,
        v.kapasite,
        v.durumSinifi
    FROM vw_oda_detaylari v
    WHERE v.durum != 'Arızalı' -- Arızalı odaları hiç gösterme
    AND v.oda_id NOT IN (
        -- Bu tarihlerde zaten dolu olan odaların ID'lerini buluyoruz
        SELECT r.oda_id 
        FROM Rezervasyonlar r
        WHERE r.rezerve_durumu NOT IN ('İptal Edildi') -- İptal edilenler odayı meşgul etmez
        AND (
            (p_giris < r.rezerve_cikis_tarihi) AND (p_cikis > r.rezerve_giris_tarihi)
        )
    );
END //

DELIMITER ;