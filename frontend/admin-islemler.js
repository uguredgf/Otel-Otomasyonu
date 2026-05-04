const misafirSecimi = document.getElementById("misafirSecimi");
const hizmetSecimi = document.getElementById("hizmetSecimi");
const hizmetAdeti = document.getElementById("hizmetAdeti");
const hizmetEkleButonu = document.getElementById("hizmetEkleButonu");
const faturaGovdesi = document.getElementById("faturaGovdesi");
const genelToplamMetni = document.getElementById("genelToplam");

const hizmetFiyatListesi = {
    "Sauna": 800,
    "Havuz": 500,
    "Masaj": 1500,
    "Oda Servisi": 400,
    "Mini Bar": 300
};

function sayfaYukle() {
    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    const aktifMisafirler = tumKayitlar.filter(kayit => kayit.durum === "Onaylandı");

    misafirSecimi.innerHTML = '<option value="">Misafir Seçiniz...</option>';
    aktifMisafirler.forEach(misafir => {
        const secenek = document.createElement("option");
        secenek.value = misafir.id;
        secenek.textContent = misafir.odaNo + " Numaralı Oda - " + misafir.musteri;
        misafirSecimi.appendChild(secenek);
    });

    misafirSecimi.addEventListener("change", faturaGuncelle);
    hizmetEkleButonu.addEventListener("click", hizmetEkle);

    // EKLENEN YENİ KISIM: URL'den ID yakalama
    const urlParametreleri = new URLSearchParams(window.location.search);
    const gelenMisafirId = urlParametreleri.get('misafirId');

    if (gelenMisafirId) {
        // Eğer linkte bir ID varsa, listeden otomatik olarak o kişiyi seç
        misafirSecimi.value = gelenMisafirId;
        // Seçim yapıldığı için faturasını hemen sağ tarafa yansıt
        faturaGuncelle();
    }
}

function faturaGuncelle() {
    const seciliId = misafirSecimi.value;
    if (!seciliId) {
        faturaGovdesi.innerHTML = "";
        genelToplamMetni.textContent = "0 TL";
        return;
    }

    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    const misafir = tumKayitlar.find(kayit => kayit.id === seciliId);

    let toplamTutar = 3000;
    faturaGovdesi.innerHTML = "";

    const odaSatiri = document.createElement("tr");
    odaSatiri.innerHTML = "<td>Konaklama Bedeli (Sabit)</td><td>1</td><td>3000 TL</td><td>3000 TL</td>";
    faturaGovdesi.appendChild(odaSatiri);

    if (misafir.alinanHizmetler && misafir.alinanHizmetler.length > 0) {
        misafir.alinanHizmetler.forEach(hizmet => {
            const islemTutari = hizmet.adet * hizmet.fiyat;
            toplamTutar += islemTutari;

            const satir = document.createElement("tr");
            satir.innerHTML = "<td>" + hizmet.isim + "</td><td>" + hizmet.adet + "</td><td>" + hizmet.fiyat + " TL</td><td>" + islemTutari + " TL</td>";
            faturaGovdesi.appendChild(satir);
        });
    }

    genelToplamMetni.textContent = toplamTutar + " TL";
}

function hizmetEkle() {
    const seciliId = misafirSecimi.value;
    const seciliHizmet = hizmetSecimi.value;
    const adet = parseInt(hizmetAdeti.value);

    if (!seciliId || !seciliHizmet || isNaN(adet) || adet < 1) {
        alert("Lütfen misafir, hizmet ve geçerli bir adet seçiniz.");
        return;
    }

    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    const misafirIndeksi = tumKayitlar.findIndex(kayit => kayit.id === seciliId);

    if (!tumKayitlar[misafirIndeksi].alinanHizmetler) {
        tumKayitlar[misafirIndeksi].alinanHizmetler = [];
    }

    const yeniHizmet = {
        isim: seciliHizmet,
        fiyat: hizmetFiyatListesi[seciliHizmet],
        adet: adet
    };

    tumKayitlar[misafirIndeksi].alinanHizmetler.push(yeniHizmet);
    localStorage.setItem("rezervasyonKayitlari", JSON.stringify(tumKayitlar));

    alert(seciliHizmet + " başarıyla eklendi.");
    faturaGuncelle();
}

document.addEventListener("DOMContentLoaded", sayfaYukle);