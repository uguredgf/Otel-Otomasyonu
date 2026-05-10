document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
    const urlParametreleri = new URLSearchParams(window.location.search);
    const secilenOdaNo = urlParametreleri.get('odaNo');
    const odaKapasitesi = parseInt(urlParametreleri.get('kapasite'));

    if (secilenOdaNo) {
        document.getElementById("seciliOdaBasligi").textContent = `${secilenOdaNo} Numaralı Oda (Max ${odaKapasitesi} Kişi)`;
    } else {
        alert("Geçersiz işlem! Lütfen anasayfadan bir oda seçiniz.");
        window.location.href = "index.html";
    }

    const form = document.getElementById("detayliRezervasyonFormu");

=======
    // 1. GEÇMİŞ TARİH ENGELİ
    const bugun = new Date().toISOString().split("T")[0];
    document.getElementById("girisTarihi").setAttribute("min", bugun);
    document.getElementById("cikisTarihi").setAttribute("min", bugun);

    // 2. ODA TİPLERİNİ MENÜYE EKLEME
    const odaTipiSecim = document.getElementById("odaTipiSecim");
    let kayitliOdalar = JSON.parse(localStorage.getItem("otelOdaAyarlari")) || [];

    // Sistemdeki oda tiplerini tekrarsız olarak buluyoruz
    let odaTipleri = [...new Set(kayitliOdalar.map(oda => oda.tip))];

    odaTipleri.forEach(tip => {
        const secenek = document.createElement("option");
        secenek.value = tip;
        secenek.textContent = tip;
        odaTipiSecim.appendChild(secenek);
    });

    const form = document.getElementById("detayliRezervasyonFormu");

    // 3. FORM GÖNDERİLME İŞLEMİ
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
    form.addEventListener("submit", (olay) => {
        olay.preventDefault();

        const isim = document.getElementById("isim").value;
        const soyisim = document.getElementById("soyisim").value;
<<<<<<< HEAD
=======
        const tcKimlik = document.getElementById("tcKimlik").value;
        const eposta = document.getElementById("eposta").value;
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        const telefon = document.getElementById("telefon").value;
        const kisiSayisi = parseInt(document.getElementById("kisiSayisi").value);
        const girisTarihi = document.getElementById("girisTarihi").value;
        const cikisTarihi = document.getElementById("cikisTarihi").value;
<<<<<<< HEAD

=======
        const secilenTip = odaTipiSecim.value;

        // TC Kimlik ve Tarih Kontrolleri
        if (tcKimlik.length !== 11 || isNaN(tcKimlik)) {
            alert("Hata: TC Kimlik numarası 11 haneli rakamlardan oluşmalıdır.");
            return;
        }
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        if (new Date(girisTarihi) >= new Date(cikisTarihi)) {
            alert("Hata: Çıkış tarihi, giriş tarihinden daha sonra olmalıdır.");
            return;
        }

<<<<<<< HEAD
        if (kisiSayisi > odaKapasitesi) {
            alert(`HATA: Bu oda en fazla ${odaKapasitesi} kişiliktir. Lütfen kişi sayısını azaltın veya daha büyük bir oda seçin.`);
            return;
        }

        let mevcutRezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];

        let cakismaVarMi = mevcutRezervasyonlar.some(rezervasyon => {
            if (rezervasyon.odaNo === secilenOdaNo && rezervasyon.durum !== "İptal Edildi" && rezervasyon.durum !== "Çıkış Yaptı") {
                const eskiGiris = new Date(rezervasyon.girisTarihi);
                const eskiCikis = new Date(rezervasyon.cikisTarihi);
                const yeniGiris = new Date(girisTarihi);
                const yeniCikis = new Date(cikisTarihi);

                return (yeniGiris < eskiCikis) && (yeniCikis > eskiGiris);
            }
            return false;
        });

        if (cakismaVarMi) {
            alert("Üzgünüz, seçtiğiniz " + secilenOdaNo + " numaralı oda bu tarihler arasında doludur. Lütfen farklı tarihler seçiniz.");
            return;
        }

        const gonderilecekVeri = {
            id: "R-" + Math.floor(Math.random() * 10000),
            odaNo: secilenOdaNo,
            musteri: isim + " " + soyisim,
=======
        // --- AKILLI ODA ATAMA ALGORİTMASI ---
        let mevcutRezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];

        // 1. Müşterinin seçtiği tipe ait tüm odaları bul
        const buTiptekiOdalar = kayitliOdalar.filter(oda => oda.tip === secilenTip);

        // Kapasite Kontrolü (Seçilen tipin kapasitesi yeterli mi?)
        if (buTiptekiOdalar.length > 0 && kisiSayisi > buTiptekiOdalar[0].kapasite) {
            alert(`HATA: Seçtiğiniz '${secilenTip}' en fazla ${buTiptekiOdalar[0].kapasite} kişiliktir. Lütfen kişi sayısını azaltın veya daha büyük bir oda türü seçin.`);
            return;
        }

        // 2. Bu odalar arasında seçilen tarihlerde MÜSAİT olan ilk odayı bul
        let atanacakOdaNo = null;

        for (let i = 0; i < buTiptekiOdalar.length; i++) {
            let oAnkiOdaNo = buTiptekiOdalar[i].odaNumarasi;

            // Bu odanın çakışan rezervasyonu var mı kontrol et
            let cakismaVarMi = mevcutRezervasyonlar.some(rezervasyon => {
                if (rezervasyon.odaNo === oAnkiOdaNo && rezervasyon.durum !== "İptal Edildi" && rezervasyon.durum !== "Çıkış Yaptı") {
                    const eskiGiris = new Date(rezervasyon.girisTarihi);
                    const eskiCikis = new Date(rezervasyon.cikisTarihi);
                    const yeniGiris = new Date(girisTarihi);
                    const yeniCikis = new Date(cikisTarihi);
                    return (yeniGiris < eskiCikis) && (yeniCikis > eskiGiris);
                }
                return false;
            });

            if (!cakismaVarMi) {
                atanacakOdaNo = oAnkiOdaNo; // Boş odayı bulduk!
                break; // Döngüyü durdur, ilk boş odayı kaptık
            }
        }

        if (!atanacakOdaNo) {
            alert("Üzgünüz, seçtiğiniz tarihlerde '" + secilenTip + "' türünde boş odamız kalmamıştır. Lütfen farklı tarihler veya farklı bir oda türü seçiniz.");
            return;
        }

        // --- KAYIT İŞLEMİ ---
        const gonderilecekVeri = {
            id: "R-" + Math.floor(Math.random() * 10000),
            odaNo: atanacakOdaNo, // Sistem boş bulduğu odayı atadı
            odaTipi: secilenTip,
            musteri: isim + " " + soyisim,
            tcKimlik: tcKimlik,
            eposta: eposta,
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
            telefon: telefon,
            kisiSayisi: kisiSayisi,
            girisTarihi: girisTarihi,
            cikisTarihi: cikisTarihi,
            durum: "Beklemede",
            durumSinifi: "bekleniyor"
        };

        mevcutRezervasyonlar.push(gonderilecekVeri);
        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(mevcutRezervasyonlar));

<<<<<<< HEAD
        alert("Tebrikler! İşleminiz başarıyla kaydedildi. Anasayfaya yönlendiriliyorsunuz.");
=======
        alert("Tebrikler! " + secilenTip + " rezervasyonunuz başarıyla alındı.");
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        window.location.href = "index.html";
    });
});