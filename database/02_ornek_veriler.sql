<<<<<<< HEAD
USE otel_otomasyonu;

-- 1. Oda Türleri (6 Çeşit)
INSERT INTO Oda_Turleri (odaTur_id, odaTur_adi, odaTur_kapasite, odaTur_taban_fiyat, odaTur_aciklama) VALUES
(1, 'Ekonomik Oda', 1, 800.00, 'Arka cephe, temel ihtiyaçlar için uygun ekonomik oda.'),
(2, 'Standart Tek Kişilik', 1, 1200.00, 'Şehir manzaralı standart tek kişilik oda.'),
(3, 'Standart Çift Kişilik', 2, 1800.00, 'Doğa manzaralı çift kişilik rahat oda.'),
(4, 'Aile Süiti', 4, 3500.00, 'Çocuklu aileler için birbirine geçmeli 2 odalı süit.'),
(5, 'Balayı Süiti', 2, 5000.00, 'Deniz manzaralı, özel dekorasyonlu balayı odası.'),
(6, 'Kral Dairesi', 2, 9500.00, 'Özel jakuzili, teraslı, deniz manzaralı ultra lüks daire.');

-- 2. Müşteriler (15 Kişi)
INSERT INTO Musteriler (musteri_id, musteri_adi, musteri_soyadi, musteri_tc_no, musteri_telefon, musteri_email) VALUES
(001, 'Ahmet', 'Yılmaz', '11111111111', '05321112233', 'ahmet.yilmaz@email.com'),
(002, 'Ayşe', 'Demir', '22222222222', '05552223344', 'ayse.demir@email.com'),
(003, 'Mehmet', 'Kaya', '33333333333', '05053334455', 'mehmet.kaya@email.com'),
(004, 'Fatma', 'Çelik', '44444444444', '05334445566', 'fatma.celik@email.com'),
(005, 'Ali', 'Şahin', '55555555555', '05445556677', 'ali.sahin@email.com'),
(006, 'Zeynep', 'Öztürk', '66666666666', '05556667788', 'zeynep.ozturk@email.com'),
(007, 'Mustafa', 'Aydın', '77777777777', '05327778899', 'mustafa.aydin@email.com'),
(008, 'Elif', 'Polat', '88888888888', '05058889900', 'elif.polat@email.com'),
(009, 'Osman', 'Can', '99999999999', '05339990011', 'osman.can@email.com'),
(010, 'Merve', 'Yıldız', '10101010101', '05441002233', 'merve.yildiz@email.com'),
(011, 'Emre', 'Kurt', '12121212121', '05552003344', 'emre.kurt@email.com'),
(012, 'Ceren', 'Arslan', '13131313131', '05323004455', 'ceren.arslan@email.com'),
(013, 'Can', 'Doğan', '14141414141', '05054005566', 'can.dogan@email.com'),
(014, 'Deniz', 'Tekin', '15151515151', '05335006677', 'deniz.tekin@email.com'),
(015, 'Burak', 'Şen', '16161616161', '05446007788', 'burak.sen@email.com');

-- 3. Personeller (10 Kişi - Ekip ve diğer çalışanlar) 
INSERT INTO Personeller (personel_id , personel_adi, personel_soyadi, personel_rol, personel_kullanici_adi, personel_sifre) VALUES
(001, 'Uğur', 'Erdoğan', 'Admin ', 'backend_admin_ugur', 'ugur2026'),
(002, 'Ecenur', 'Eke', 'Admin', 'frontend_admin_ece', 'ece2026'),
(003, 'Hilal', 'Çoğul', 'Admin', 'database_admin_hilal', 'hilal2026'),
(004, 'Hasan', 'Demir', 'Mutfak', 'mutfak_hasan', 'hasan2026'),
(005, 'Ayten', 'Temiz', 'Temizlik', 'temizlik_ayten', 'ayten2026'),
(006, 'Kemal', 'Müdür', 'Admin', 'admin_kemal', 'kemal2026'),
(007, 'Seda', 'Gül', 'Resepsiyonist', 'res_seda', 'seda2026'),
(008, 'Murat', 'Aşçı', 'Mutfak', 'mutfak_murat', 'murat2026'),
(009, 'Zehra', 'Pırıl', 'Temizlik', 'temizlik_zehra', 'zehra2026'),
(010, 'Tarik', 'Şoför', 'Resepsiyonist', 'res_tarik', 'tarik2026');

-- 4. Hizmetler (10 Çeşit Ekstra)
INSERT INTO Hizmetler (hizmet_id, hizmet_adi, hizmet_birim_fiyat) VALUES
(001, 'Açık Büfe Kahvaltı', 300.00),
(002, 'SPA & Masaj', 1200.00),
(003, 'Minibar Kullanımı', 250.00),
(004, 'Havaalanı VIP Transfer', 800.00),
(005, 'Oda Servisi (Akşam Yemeği)', 600.00),
(006, 'Kuru Temizleme', 150.00),
(007, 'Ütü Hizmeti', 100.00),
(008, 'Kapalı Havuz Girişi', 200.00),
(009, 'Otopark ve Vale', 100.00),
(010, 'Geç Çıkış (Late Check-out)', 500.00);

-- 5. Odalar (10 Kat 10 oda her kata ilk yedi kat karışık 8. kat lüks ve son iki kat kral dairesi)
INSERT INTO Odalar (oda_id, oda_no, oda_kat, odaTur_id, oda_durumu) VALUES
-- 1. KAT
(1, '101', 1, 1, 'Boş'), (2, '102', 1, 4, 'Boş'), (3, '103', 1, 2, 'Boş'), (4, '104', 1, 4, 'Boş'), (5, '105', 1, 3, 'Boş'),
(6, '106', 1, 1, 'Boş'), (7, '107', 1, 4, 'Boş'), (8, '108', 1, 2, 'Boş'), (9, '109', 1, 3, 'Boş'), (10, '110', 1, 4, 'Boş'),
-- 2. KAT
(11, '201', 2, 4, 'Boş'), (12, '202', 2, 2, 'Boş'), (13, '203', 2, 3, 'Boş'), (14, '204', 2, 1, 'Boş'), (15, '205', 2, 4, 'Boş'),
(16, '206', 2, 2, 'Boş'), (17, '207', 2, 3, 'Boş'), (18, '208', 2, 4, 'Boş'), (19, '209', 2, 1, 'Boş'), (20, '210', 2, 2, 'Boş'),
-- 3. KAT
(21, '301', 3, 4, 'Boş'), (22, '302', 3, 2, 'Boş'), (23, '303', 3, 1, 'Boş'), (24, '304', 3, 4, 'Boş'), (25, '305', 3, 3, 'Boş'),
(26, '306', 3, 2, 'Boş'), (27, '307', 3, 1, 'Boş'), (28, '308', 3, 4, 'Boş'), (29, '309', 3, 3, 'Boş'), (30, '310', 3, 2, 'Boş'),
-- 4. KAT
(31, '401', 4, 3, 'Boş'), (32, '402', 4, 2, 'Boş'), (33, '403', 4, 1, 'Boş'), (34, '404', 4, 4, 'Boş'), (35, '405', 4, 3, 'Boş'),
(36, '406', 4, 2, 'Boş'), (37, '407', 4, 1, 'Boş'), (38, '408', 4, 3, 'Boş'), (39, '409', 4, 3, 'Boş'), (40, '410', 4, 1, 'Boş'),
-- 5. KAT
(41, '501', 5, 1, 'Boş'), (42, '502', 5, 2, 'Boş'), (43, '503', 5, 4, 'Boş'), (44, '504', 5, 4, 'Boş'), (45, '505', 5, 1, 'Boş'),
(46, '506', 5, 2, 'Boş'), (47, '507', 5, 3, 'Boş'), (48, '508', 5, 4, 'Boş'), (49, '509', 5, 1, 'Boş'), (50, '510', 5, 2, 'Boş'),
-- 6. KAT
(51, '601', 6, 1, 'Boş'), (52, '602', 6, 2, 'Boş'), (53, '603', 6, 4, 'Boş'), (54, '604', 6, 4, 'Boş'), (55, '605', 6, 1, 'Boş'),
(56, '606', 6, 2, 'Boş'), (57, '607', 6, 3, 'Boş'), (58, '608', 6, 4, 'Boş'), (59, '609', 6, 1, 'Boş'), (60, '610', 6, 2, 'Boş'),
-- 7. KAT
(61, '701', 7, 1, 'Boş'), (62, '702', 7, 2, 'Boş'), (63, '703', 7, 4, 'Boş'), (64, '704', 7, 4, 'Boş'), (65, '705', 7, 1, 'Boş'),
(66, '706', 7, 2, 'Boş'), (67, '707', 7, 3, 'Boş'), (68, '708', 7, 4, 'Boş'), (69, '709', 7, 1, 'Boş'), (70, '710', 7, 2, 'Boş'),
-- 8. KAT (Lüks Odalar - Balayı Süitleri)
(71, '801', 8, 5, 'Boş'), (72, '802', 8, 5, 'Boş'), (73, '803', 8, 5, 'Boş'), (74, '804', 8, 5, 'Boş'), (75, '805', 8, 5, 'Boş'),
(76, '806', 8, 5, 'Boş'), (77, '807', 8, 5, 'Boş'), (78, '808', 8, 5, 'Boş'), (79, '809', 8, 5, 'Boş'), (80, '810', 8, 5, 'Boş'),
-- 9. KAT (Lüks odalar - Balayı Süitleri )
(81, '901', 9, 5, 'Boş'), (82, '902', 9, 5, 'Boş'), (83, '903', 9, 5, 'Boş'), (84, '904', 9, 5, 'Boş'), (85, '905', 9, 5, 'Boş'),
(86, '906', 9, 5, 'Boş'), (87, '907', 9, 5, 'Boş'), (88, '908', 9, 5, 'Boş'), (89, '909', 9, 5, 'Boş'), (90, '910', 9, 5, 'Boş'),
-- 10. KAT (Kral Daireleri)
(91, '1001', 10, 6, 'Boş'), (92, '1002', 10, 6, 'Boş'), (93, '1003', 10, 6, 'Boş'), (94, '1004', 10, 6, 'Boş'), (95, '1005', 10, 6, 'Boş'),
(96, '1006', 10, 6, 'Boş'), (97, '1007', 10, 6, 'Boş'), (98, '1008', 10, 6, 'Boş'), (99, '1009', 10, 6, 'Boş'), (100, '1010', 10, 6, 'Boş');

-- 6. Rezervasyonlar 
INSERT INTO Rezervasyonlar (rezervasyon_id, musteri_id, oda_id, rezerve_giris_tarihi, rezerve_cikis_tarihi, rezerve_durumu) VALUES
(1, 1, 15, '2026-05-01', '2026-05-05', 'Tamamlandı'), 
(2, 2, 2,  '2026-05-02', '2026-05-07', 'Tamamlandı'), 
(3, 3, 45, '2026-04-28', '2026-05-04', 'Tamamlandı'), 
(4, 4, 72, '2026-05-01', '2026-05-06', 'Tamamlandı'), 
(5, 5, 91, '2026-04-30', '2026-05-07', 'Tamamlandı'), 
(6, 6, 11, '2026-05-04', '2026-05-12', 'Onaylandı'), 
(7, 7, 31, '2026-05-05', '2026-05-15', 'Onaylandı'), 
(8, 8, 22, '2026-05-08', '2026-05-13', 'Onaylandı'), 
(9, 9, 81, '2026-05-06', '2026-05-14', 'Onaylandı'), 
(10, 10, 5, '2026-05-07', '2026-05-11', 'Onaylandı'), 
=======
﻿USE otel_otomasyonu;

-- 1. Oda T├╝rleri (6 ├çe┼şit)
INSERT INTO Oda_Turleri (odaTur_id, odaTur_adi, odaTur_kapasite, odaTur_taban_fiyat, odaTur_aciklama) VALUES
(1, 'Ekonomik Oda', 1, 800.00, 'Arka cephe, temel ihtiya├ğlar i├ğin uygun ekonomik oda.'),
(2, 'Standart Tek Ki┼şilik', 1, 1200.00, '┼Şehir manzaral─▒ standart tek ki┼şilik oda.'),
(3, 'Standart ├çift Ki┼şilik', 2, 1800.00, 'Do─şa manzaral─▒ ├ğift ki┼şilik rahat oda.'),
(4, 'Aile S├╝iti', 4, 3500.00, '├çocuklu aileler i├ğin birbirine ge├ğmeli 2 odal─▒ s├╝it.'),
(5, 'Balay─▒ S├╝iti', 2, 5000.00, 'Deniz manzaral─▒, ├Âzel dekorasyonlu balay─▒ odas─▒.'),
(6, 'Kral Dairesi', 2, 9500.00, '├ûzel jakuzili, terasl─▒, deniz manzaral─▒ ultra l├╝ks daire.');

-- 2. M├╝┼şteriler (15 Ki┼şi)
INSERT INTO Musteriler (musteri_id, musteri_adi, musteri_soyadi, musteri_tc_no, musteri_telefon, musteri_email) VALUES
(001, 'Ahmet', 'Y─▒lmaz', '11111111111', '05321112233', 'ahmet.yilmaz@email.com'),
(002, 'Ay┼şe', 'Demir', '22222222222', '05552223344', 'ayse.demir@email.com'),
(003, 'Mehmet', 'Kaya', '33333333333', '05053334455', 'mehmet.kaya@email.com'),
(004, 'Fatma', '├çelik', '44444444444', '05334445566', 'fatma.celik@email.com'),
(005, 'Ali', '┼Şahin', '55555555555', '05445556677', 'ali.sahin@email.com'),
(006, 'Zeynep', '├ûzt├╝rk', '66666666666', '05556667788', 'zeynep.ozturk@email.com'),
(007, 'Mustafa', 'Ayd─▒n', '77777777777', '05327778899', 'mustafa.aydin@email.com'),
(008, 'Elif', 'Polat', '88888888888', '05058889900', 'elif.polat@email.com'),
(009, 'Osman', 'Can', '99999999999', '05339990011', 'osman.can@email.com'),
(010, 'Merve', 'Y─▒ld─▒z', '10101010101', '05441002233', 'merve.yildiz@email.com'),
(011, 'Emre', 'Kurt', '12121212121', '05552003344', 'emre.kurt@email.com'),
(012, 'Ceren', 'Arslan', '13131313131', '05323004455', 'ceren.arslan@email.com'),
(013, 'Can', 'Do─şan', '14141414141', '05054005566', 'can.dogan@email.com'),
(014, 'Deniz', 'Tekin', '15151515151', '05335006677', 'deniz.tekin@email.com'),
(015, 'Burak', '┼Şen', '16161616161', '05446007788', 'burak.sen@email.com');

-- 3. Personeller (10 Ki┼şi - Ekip ve di─şer ├ğal─▒┼şanlar) 
INSERT INTO Personeller (personel_id , personel_adi, personel_soyadi, personel_rol, personel_kullanici_adi, personel_sifre) VALUES
(001, 'U─şur', 'Erdo─şan', 'Admin ', 'backend_admin_ugur', 'ugur2026'),
(002, 'Ecenur', 'Eke', 'Admin', 'frontend_admin_ece', 'ece2026'),
(003, 'Hilal', '├ço─şul', 'Admin', 'database_admin_hilal', 'hilal2026'),
(004, 'Hasan', 'Demir', 'Mutfak', 'mutfak_hasan', 'hasan2026'),
(005, 'Ayten', 'Temiz', 'Temizlik', 'temizlik_ayten', 'ayten2026'),
(006, 'Kemal', 'M├╝d├╝r', 'Admin', 'admin_kemal', 'kemal2026'),
(007, 'Seda', 'G├╝l', 'Resepsiyonist', 'res_seda', 'seda2026'),
(008, 'Murat', 'A┼ş├ğ─▒', 'Mutfak', 'mutfak_murat', 'murat2026'),
(009, 'Zehra', 'P─▒r─▒l', 'Temizlik', 'temizlik_zehra', 'zehra2026'),
(010, 'Tarik', '┼Şof├Âr', 'Resepsiyonist', 'res_tarik', 'tarik2026');

-- 4. Hizmetler (10 ├çe┼şit Ekstra)
INSERT INTO Hizmetler (hizmet_id, hizmet_adi, hizmet_birim_fiyat) VALUES
(001, 'A├ğ─▒k B├╝fe Kahvalt─▒', 300.00),
(002, 'SPA & Masaj', 1200.00),
(003, 'Minibar Kullan─▒m─▒', 250.00),
(004, 'Havaalan─▒ VIP Transfer', 800.00),
(005, 'Oda Servisi (Ak┼şam Yeme─şi)', 600.00),
(006, 'Kuru Temizleme', 150.00),
(007, '├£t├╝ Hizmeti', 100.00),
(008, 'Kapal─▒ Havuz Giri┼şi', 200.00),
(009, 'Otopark ve Vale', 100.00),
(010, 'Ge├ğ ├ç─▒k─▒┼ş (Late Check-out)', 500.00);

-- 5. Odalar (10 Kat 10 oda her kata ilk yedi kat kar─▒┼ş─▒k 8. kat l├╝ks ve son iki kat kral dairesi)
INSERT INTO Odalar (oda_id, oda_no, oda_kat, odaTur_id, oda_durumu) VALUES
-- 1. KAT
(1, '101', 1, 1, 'Bo┼ş'), (2, '102', 1, 4, 'Bo┼ş'), (3, '103', 1, 2, 'Bo┼ş'), (4, '104', 1, 4, 'Bo┼ş'), (5, '105', 1, 3, 'Bo┼ş'),
(6, '106', 1, 1, 'Bo┼ş'), (7, '107', 1, 4, 'Bo┼ş'), (8, '108', 1, 2, 'Bo┼ş'), (9, '109', 1, 3, 'Bo┼ş'), (10, '110', 1, 4, 'Bo┼ş'),
-- 2. KAT
(11, '201', 2, 4, 'Bo┼ş'), (12, '202', 2, 2, 'Bo┼ş'), (13, '203', 2, 3, 'Bo┼ş'), (14, '204', 2, 1, 'Bo┼ş'), (15, '205', 2, 4, 'Bo┼ş'),
(16, '206', 2, 2, 'Bo┼ş'), (17, '207', 2, 3, 'Bo┼ş'), (18, '208', 2, 4, 'Bo┼ş'), (19, '209', 2, 1, 'Bo┼ş'), (20, '210', 2, 2, 'Bo┼ş'),
-- 3. KAT
(21, '301', 3, 4, 'Bo┼ş'), (22, '302', 3, 2, 'Bo┼ş'), (23, '303', 3, 1, 'Bo┼ş'), (24, '304', 3, 4, 'Bo┼ş'), (25, '305', 3, 3, 'Bo┼ş'),
(26, '306', 3, 2, 'Bo┼ş'), (27, '307', 3, 1, 'Bo┼ş'), (28, '308', 3, 4, 'Bo┼ş'), (29, '309', 3, 3, 'Bo┼ş'), (30, '310', 3, 2, 'Bo┼ş'),
-- 4. KAT
(31, '401', 4, 3, 'Bo┼ş'), (32, '402', 4, 2, 'Bo┼ş'), (33, '403', 4, 1, 'Bo┼ş'), (34, '404', 4, 4, 'Bo┼ş'), (35, '405', 4, 3, 'Bo┼ş'),
(36, '406', 4, 2, 'Bo┼ş'), (37, '407', 4, 1, 'Bo┼ş'), (38, '408', 4, 3, 'Bo┼ş'), (39, '409', 4, 3, 'Bo┼ş'), (40, '410', 4, 1, 'Bo┼ş'),
-- 5. KAT
(41, '501', 5, 1, 'Bo┼ş'), (42, '502', 5, 2, 'Bo┼ş'), (43, '503', 5, 4, 'Bo┼ş'), (44, '504', 5, 4, 'Bo┼ş'), (45, '505', 5, 1, 'Bo┼ş'),
(46, '506', 5, 2, 'Bo┼ş'), (47, '507', 5, 3, 'Bo┼ş'), (48, '508', 5, 4, 'Bo┼ş'), (49, '509', 5, 1, 'Bo┼ş'), (50, '510', 5, 2, 'Bo┼ş'),
-- 6. KAT
(51, '601', 6, 1, 'Bo┼ş'), (52, '602', 6, 2, 'Bo┼ş'), (53, '603', 6, 4, 'Bo┼ş'), (54, '604', 6, 4, 'Bo┼ş'), (55, '605', 6, 1, 'Bo┼ş'),
(56, '606', 6, 2, 'Bo┼ş'), (57, '607', 6, 3, 'Bo┼ş'), (58, '608', 6, 4, 'Bo┼ş'), (59, '609', 6, 1, 'Bo┼ş'), (60, '610', 6, 2, 'Bo┼ş'),
-- 7. KAT
(61, '701', 7, 1, 'Bo┼ş'), (62, '702', 7, 2, 'Bo┼ş'), (63, '703', 7, 4, 'Bo┼ş'), (64, '704', 7, 4, 'Bo┼ş'), (65, '705', 7, 1, 'Bo┼ş'),
(66, '706', 7, 2, 'Bo┼ş'), (67, '707', 7, 3, 'Bo┼ş'), (68, '708', 7, 4, 'Bo┼ş'), (69, '709', 7, 1, 'Bo┼ş'), (70, '710', 7, 2, 'Bo┼ş'),
-- 8. KAT (L├╝ks Odalar - Balay─▒ S├╝itleri)
(71, '801', 8, 5, 'Bo┼ş'), (72, '802', 8, 5, 'Bo┼ş'), (73, '803', 8, 5, 'Bo┼ş'), (74, '804', 8, 5, 'Bo┼ş'), (75, '805', 8, 5, 'Bo┼ş'),
(76, '806', 8, 5, 'Bo┼ş'), (77, '807', 8, 5, 'Bo┼ş'), (78, '808', 8, 5, 'Bo┼ş'), (79, '809', 8, 5, 'Bo┼ş'), (80, '810', 8, 5, 'Bo┼ş'),
-- 9. KAT (L├╝ks odalar - Balay─▒ S├╝itleri )
(81, '901', 9, 5, 'Bo┼ş'), (82, '902', 9, 5, 'Bo┼ş'), (83, '903', 9, 5, 'Bo┼ş'), (84, '904', 9, 5, 'Bo┼ş'), (85, '905', 9, 5, 'Bo┼ş'),
(86, '906', 9, 5, 'Bo┼ş'), (87, '907', 9, 5, 'Bo┼ş'), (88, '908', 9, 5, 'Bo┼ş'), (89, '909', 9, 5, 'Bo┼ş'), (90, '910', 9, 5, 'Bo┼ş'),
-- 10. KAT (Kral Daireleri)
(91, '1001', 10, 6, 'Bo┼ş'), (92, '1002', 10, 6, 'Bo┼ş'), (93, '1003', 10, 6, 'Bo┼ş'), (94, '1004', 10, 6, 'Bo┼ş'), (95, '1005', 10, 6, 'Bo┼ş'),
(96, '1006', 10, 6, 'Bo┼ş'), (97, '1007', 10, 6, 'Bo┼ş'), (98, '1008', 10, 6, 'Bo┼ş'), (99, '1009', 10, 6, 'Bo┼ş'), (100, '1010', 10, 6, 'Bo┼ş');

-- 6. Rezervasyonlar 
INSERT INTO Rezervasyonlar (rezervasyon_id, musteri_id, oda_id, rezerve_giris_tarihi, rezerve_cikis_tarihi, rezerve_durumu) VALUES
(1, 1, 15, '2026-05-01', '2026-05-05', 'Tamamland─▒'), 
(2, 2, 2,  '2026-05-02', '2026-05-07', 'Tamamland─▒'), 
(3, 3, 45, '2026-04-28', '2026-05-04', 'Tamamland─▒'), 
(4, 4, 72, '2026-05-01', '2026-05-06', 'Tamamland─▒'), 
(5, 5, 91, '2026-04-30', '2026-05-07', 'Tamamland─▒'), 
(6, 6, 11, '2026-05-04', '2026-05-12', 'Onayland─▒'), 
(7, 7, 31, '2026-05-05', '2026-05-15', 'Onayland─▒'), 
(8, 8, 22, '2026-05-08', '2026-05-13', 'Onayland─▒'), 
(9, 9, 81, '2026-05-06', '2026-05-14', 'Onayland─▒'), 
(10, 10, 5, '2026-05-07', '2026-05-11', 'Onayland─▒'), 
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
(11, 11, 75, '2026-05-15', '2026-05-20', 'Beklemede'),
(12, 12, 95, '2026-05-20', '2026-05-25', 'Beklemede'),
(13, 13, 10, '2026-06-01', '2026-06-10', 'Beklemede'),
(14, 14, 55, '2026-06-15', '2026-06-20', 'Beklemede'),
<<<<<<< HEAD
(15, 15, 60, '2026-05-10', '2026-05-15', 'İptal Edildi');
=======
(15, 15, 60, '2026-05-10', '2026-05-15', '─░ptal Edildi');
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)

-- 7. Rezervasyon Hizmetleri 
INSERT INTO Rezervasyon_Hizmetleri (rezervasyon_id, hizmet_id, hizmet_adet, hizmet_islem_tarihi) VALUES
(1, 1, 4, '2026-05-02 09:00:00'), (1, 3, 2, '2026-05-03 14:00:00'),
(2, 4, 1, '2026-05-02 10:00:00'), (2, 8, 2, '2026-05-04 11:00:00'),
(3, 5, 3, '2026-04-30 20:00:00'),
(4, 2, 1, '2026-05-02 16:00:00'), (4, 10, 1, '2026-05-06 12:00:00'),
(6, 1, 2, '2026-05-05 08:30:00'), (6, 3, 5, '2026-05-06 22:00:00'),
(7, 5, 2, '2026-05-07 19:00:00'), (9, 4, 1, '2026-05-06 09:00:00');

-- 8. Faturalar 
INSERT INTO Faturalar (fatura_id, rezervasyon_id, fatura_toplam_tutar, fatura_odeme_tarihi, fatura_odeme_yontemi) VALUES
<<<<<<< HEAD
(1, 1, 14550.00, '2026-05-05 10:00:00', 'Kredi Kartı'),
(2, 2, 9200.00,  '2026-05-07 11:30:00', 'Nakit'),
(3, 3, 12400.00, '2026-05-04 09:15:00', 'Kredi Kartı'),
(4, 4, 32000.00, '2026-05-06 10:45:00', 'Kredi Kartı'),
(5, 5, 68000.00, '2026-05-07 08:30:00', 'Nakit'),
(6, 6, 18500.00, '2026-05-04 14:00:00', 'Kredi Kartı'), 
(7, 9, 40800.00, '2026-05-06 12:00:00', 'Nakit'); 

-- 9. İşlem Kayıtları (Loglar)
INSERT INTO Islem_Kayitlari (kayit_id, personel_id, kayit_islem_tipi, kayit_islem_tarihi, kayit_aciklama) VALUES
(1, 7, 'Rezervasyon Onayı', '2026-04-25 10:00:00', '1 numaralı Ahmet Yılmaz rezervasyonu onaylandı.'),
(2, 10, 'Giriş İşlemi', '2026-05-02 14:00:00', '2 numaralı Ayşe Demir otele giriş yaptı.'),
(3, 1, 'Sistem Ayarı', '2026-04-20 09:30:00', 'Uğur tarafından oda taban fiyatları güncellendi.'),
(4, 7, 'Rezervasyon İptali', '2026-05-07 11:15:00', '15 numaralı rezervasyon müşteri talebiyle iptal edildi.'),
(5, 2, 'Fatura Kesimi', '2026-05-05 10:30:00', '1 numaralı rezervasyonun çıkış faturası kesildi.'),
(6, 10, 'Giriş İşlemi', '2026-05-04 12:45:00', '6 numaralı (Zeynep Öztürk) rezervasyon için giriş yapıldı.'),
(7, 7, 'Çıkış İşlemi', '2026-05-07 09:10:00', '2 numaralı rezervasyon sahibi Ayşe Demir otelden ayrıldı.'),
(8, 3, 'Veritabanı Bakımı', '2026-05-08 02:00:00', 'Hilal tarafından sistem yedeklemesi ve oda optimizasyonu yapıldı.'),
(9, 6, 'Oda Durum Güncellemesi', '2026-05-06 08:00:00', '408 numaralı oda arıza nedeniyle kullanıma kapatıldı.'),
(10, 5, 'Temizlik Bildirimi', '2026-05-08 10:10:00', '205 numaralı oda temizlik personeli Ayten tarafından temizliğe alındı.');
=======
(1, 1, 14550.00, '2026-05-05 10:00:00', 'Kredi Kart─▒'),
(2, 2, 9200.00,  '2026-05-07 11:30:00', 'Nakit'),
(3, 3, 12400.00, '2026-05-04 09:15:00', 'Kredi Kart─▒'),
(4, 4, 32000.00, '2026-05-06 10:45:00', 'Kredi Kart─▒'),
(5, 5, 68000.00, '2026-05-07 08:30:00', 'Nakit'),
(6, 6, 18500.00, '2026-05-04 14:00:00', 'Kredi Kart─▒'), 
(7, 9, 40800.00, '2026-05-06 12:00:00', 'Nakit'); 

-- 9. ─░┼şlem Kay─▒tlar─▒ (Loglar)
INSERT INTO Islem_Kayitlari (kayit_id, personel_id, kayit_islem_tipi, kayit_islem_tarihi, kayit_aciklama) VALUES
(1, 7, 'Rezervasyon Onay─▒', '2026-04-25 10:00:00', '1 numaral─▒ Ahmet Y─▒lmaz rezervasyonu onayland─▒.'),
(2, 10, 'Giri┼ş ─░┼şlemi', '2026-05-02 14:00:00', '2 numaral─▒ Ay┼şe Demir otele giri┼ş yapt─▒.'),
(3, 1, 'Sistem Ayar─▒', '2026-04-20 09:30:00', 'U─şur taraf─▒ndan oda taban fiyatlar─▒ g├╝ncellendi.'),
(4, 7, 'Rezervasyon ─░ptali', '2026-05-07 11:15:00', '15 numaral─▒ rezervasyon m├╝┼şteri talebiyle iptal edildi.'),
(5, 2, 'Fatura Kesimi', '2026-05-05 10:30:00', '1 numaral─▒ rezervasyonun ├ğ─▒k─▒┼ş faturas─▒ kesildi.'),
(6, 10, 'Giri┼ş ─░┼şlemi', '2026-05-04 12:45:00', '6 numaral─▒ (Zeynep ├ûzt├╝rk) rezervasyon i├ğin giri┼ş yap─▒ld─▒.'),
(7, 7, '├ç─▒k─▒┼ş ─░┼şlemi', '2026-05-07 09:10:00', '2 numaral─▒ rezervasyon sahibi Ay┼şe Demir otelden ayr─▒ld─▒.'),
(8, 3, 'Veritaban─▒ Bak─▒m─▒', '2026-05-08 02:00:00', 'Hilal taraf─▒ndan sistem yedeklemesi ve oda optimizasyonu yap─▒ld─▒.'),
(9, 6, 'Oda Durum G├╝ncellemesi', '2026-05-06 08:00:00', '408 numaral─▒ oda ar─▒za nedeniyle kullan─▒ma kapat─▒ld─▒.'),
(10, 5, 'Temizlik Bildirimi', '2026-05-08 10:10:00', '205 numaral─▒ oda temizlik personeli Ayten taraf─▒ndan temizli─şe al─▒nd─▒.');
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
