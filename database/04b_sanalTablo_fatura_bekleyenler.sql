<<<<<<< HEAD
-- Henüz faturası kesilmemiş müşterilerin bilgilerini gösteren sanal tablo  
=======
﻿-- Hen├╝z faturas─▒ kesilmemi┼ş m├╝┼şterilerin bilgilerini g├Âsteren sanal tablo  
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)

DROP VIEW IF EXISTS vw_fatura_bekleyenler;
CREATE VIEW vw_fatura_bekleyenler AS
SELECT 
    r.rezervasyon_id,
    m.musteri_adi,
    m.musteri_soyadi,
    o.oda_no,
    r.rezerve_cikis_tarihi
FROM Rezervasyonlar r
JOIN Musteriler m ON r.musteri_id = m.musteri_id
JOIN Odalar o ON r.oda_id = o.oda_id
LEFT JOIN Faturalar f ON r.rezervasyon_id = f.rezervasyon_id
<<<<<<< HEAD
WHERE r.rezerve_durumu = 'Tamamlandı' AND f.fatura_id IS NULL;
=======
WHERE r.rezerve_durumu = 'Tamamland─▒' AND f.fatura_id IS NULL;
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
