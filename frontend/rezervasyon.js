document.addEventListener("DOMContentLoaded", () => {
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

    form.addEventListener("submit", (olay) => {
        olay.preventDefault();

        const isim = document.getElementById("isim").value;
        const soyisim = document.getElementById("soyisim").value;
        const telefon = document.getElementById("telefon").value;
        const kisiSayisi = parseInt(document.getElementById("kisiSayisi").value);
        const girisTarihi = document.getElementById("girisTarihi").value;
        const cikisTarihi = document.getElementById("cikisTarihi").value;

        if (new Date(girisTarihi) >= new Date(cikisTarihi)) {
            alert("Hata: Çıkış tarihi, giriş tarihinden daha sonra olmalıdır.");
            return;
        }

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
            telefon: telefon,
            kisiSayisi: kisiSayisi,
            girisTarihi: girisTarihi,
            cikisTarihi: cikisTarihi,
            durum: "Beklemede",
            durumSinifi: "bekleniyor"
        };

        mevcutRezervasyonlar.push(gonderilecekVeri);
        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(mevcutRezervasyonlar));

        alert("Tebrikler! İşleminiz başarıyla kaydedildi. Anasayfaya yönlendiriliyorsunuz.");
        window.location.href = "index.html";
    });
});