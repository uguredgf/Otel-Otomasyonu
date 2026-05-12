const odaListesiAlani = document.getElementById("odaListesi");
const aramaFormu = document.getElementById("aramaFormu");


const odaResimleri = {
    "Ekonomik Oda": "ekonomikoda.jpg",
    "Standart Tek": "tekkisilikoda.jpg",
    "Standart Çift": "çiftkisilikoda.jpeg",
    "Aile Odası": "4kisilikoda.jpg",
    "Balayı Süiti": "balayisuiti.jpg",
    "Kral Dairesi": "kraldairesi.jpg"
};

let tumOdalarSistemi = [];

function yuzOdaOlustur() {
    let yeniOdalar = [];
    for (let kat = 1; kat <= 10; kat++) {
        for (let odaNo = 1; odaNo <= 10; odaNo++) {
            let numara = (kat * 100) + odaNo;
            let odaTipi = ""; let fiyat = 0; let kapasite = 0;

            if (kat >= 1 && kat <= 7) {
                if (odaNo <= 2) { odaTipi = "Ekonomik Oda"; fiyat = 1000; kapasite = 2; }
                else if (odaNo <= 5) { odaTipi = "Standart Tek"; fiyat = 1200; kapasite = 1; }
                else if (odaNo <= 8) { odaTipi = "Standart Çift"; fiyat = 1800; kapasite = 2; }
                else { odaTipi = "Aile Odası"; fiyat = 3500; kapasite = 4; }
            } else if (kat === 8 || kat === 9) {
                odaTipi = "Balayı Süiti"; fiyat = 4000; kapasite = 2;
            } else if (kat === 10) {
                odaTipi = "Kral Dairesi"; fiyat = 8000; kapasite = 5;
            }

            yeniOdalar.push({
                odaNumarasi: numara.toString(), tip: odaTipi, fiyat: fiyat, kapasite: kapasite,
                durum: "Müsait", durumSinifi: "oda-bos"
            });
        }
    }
    return yeniOdalar;
}

function odalariGetir() {
    try {
        tumOdalarSistemi = JSON.parse(localStorage.getItem("otelOdaAyarlari")) || [];
        if (!Array.isArray(tumOdalarSistemi)) tumOdalarSistemi = [];
    } catch (e) {
        tumOdalarSistemi = [];
    }

    // ZORUNLU TEMİZLİK KONTROLÜ
    const eskiOdaVarMi = tumOdalarSistemi.some(oda => oda.tip === "Standart Üç Kişilik" || oda.tip === "Standart Dört Kişilik");
    const aileOdasiVarMi = tumOdalarSistemi.some(oda => oda.tip === "Aile Odası");

    if (tumOdalarSistemi.length < 100 || eskiOdaVarMi || !aileOdasiVarMi) {
        localStorage.removeItem("otelOdaAyarlari"); // HAFIZAYI ZORLA TEMİZLE
        tumOdalarSistemi = yuzOdaOlustur();
        localStorage.setItem("otelOdaAyarlari", JSON.stringify(tumOdalarSistemi));
    }

    gruplayipEkranaBas(tumOdalarSistemi);
}

function gruplayipEkranaBas(odalar) {
    if (!odaListesiAlani) return;
    odaListesiAlani.innerHTML = "";

    if (odalar.length === 0) {
        odaListesiAlani.innerHTML = "<p style='grid-column: 1/-1; text-align:center; font-size:1.2rem; padding: 2rem;'>Seçtiğiniz tarihlerde müsait odamız bulunmamaktadır.</p>";
        return;
    }

    let odaTipleri = {};

    odalar.forEach(oda => {
        if (!odaTipleri[oda.tip]) {
            odaTipleri[oda.tip] = {
                tip: oda.tip, fiyat: oda.fiyat, kapasite: oda.kapasite, musaitOdaNumaralari: []
            };
        }
        odaTipleri[oda.tip].musaitOdaNumaralari.push(oda.odaNumarasi);
    });

    Object.values(odaTipleri).forEach(grup => {
        if (grup.musaitOdaNumaralari.length === 0) return;

        const kart = document.createElement("div");
        kart.className = "oda-karti";

        const resim = document.createElement("img");
        resim.src = odaResimleri[grup.tip] || "ekonomikoda.jpg";
        resim.alt = grup.tip;
        resim.style.width = "100%";
        resim.style.height = "250px";
        resim.style.objectFit = "cover";

        const icerikKapsayici = document.createElement("div");
        icerikKapsayici.className = "oda-karti-icerik";
        icerikKapsayici.style.padding = "1.5rem";
        icerikKapsayici.style.textAlign = "center";

        const baslik = document.createElement("h3");
        baslik.textContent = grup.tip;
        baslik.style.margin = "0 0 10px 0";
        baslik.style.fontSize = "1.5rem";
        baslik.style.color = "#2c3e50";

        const kapasiteBilgisi = document.createElement("p");
        kapasiteBilgisi.innerHTML = `<strong>Kapasite:</strong> ${grup.kapasite} Kişilik`;
        kapasiteBilgisi.style.color = "#7f8c8d";
        kapasiteBilgisi.style.margin = "5px 0";

        const fiyatBilgisi = document.createElement("p");
        fiyatBilgisi.innerHTML = `<span style="font-size: 1.4rem; color: #27ae60; font-weight: bold;">${grup.fiyat} TL</span> / Gecelik`;
        fiyatBilgisi.style.margin = "15px 0";

        const rezervasyonButonu = document.createElement("button");
        rezervasyonButonu.textContent = "Hemen Rezervasyon Yap";
        rezervasyonButonu.style.width = "100%";
        rezervasyonButonu.style.padding = "12px";
        rezervasyonButonu.style.backgroundColor = "#3498db";
        rezervasyonButonu.style.color = "white";
        rezervasyonButonu.style.border = "none";
        rezervasyonButonu.style.borderRadius = "5px";
        rezervasyonButonu.style.cursor = "pointer";
        rezervasyonButonu.style.fontSize = "1.1rem";
        rezervasyonButonu.style.fontWeight = "bold";

        rezervasyonButonu.addEventListener("click", () => {
            window.location.href = `rezervasyon.html?odaTipi=${encodeURIComponent(grup.tip)}`;
        });

        kart.appendChild(resim);
        icerikKapsayici.appendChild(baslik);
        icerikKapsayici.appendChild(kapasiteBilgisi);
        icerikKapsayici.appendChild(fiyatBilgisi);
        icerikKapsayici.appendChild(rezervasyonButonu);
        kart.appendChild(icerikKapsayici);


        odaListesiAlani.appendChild(kart);
    });
}


if (aramaFormu) {
    aramaFormu.addEventListener("submit", (olay) => {
        olay.preventDefault();

        const giris = document.getElementById("girisTarihi").value;
        const cikis = document.getElementById("cikisTarihi").value;

        if (!giris || !cikis) { alert("Lütfen giriş ve çıkış tarihlerini seçiniz."); return; }
        if (new Date(giris) >= new Date(cikis)) { alert("HATA: Çıkış tarihi giriş tarihinden önce veya aynı gün olamaz."); return; }

        let kayitliRezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];

        const musaitOdalar = tumOdalarSistemi.filter(oda => {
            const cakismaVar = kayitliRezervasyonlar.some(rezervasyon => {
                if (rezervasyon.odaNo === oda.odaNumarasi && rezervasyon.durum !== "İptal Edildi" && rezervasyon.durum !== "Çıkış Yaptı") {
                    const eskiGiris = new Date(rezervasyon.girisTarihi);
                    const eskiCikis = new Date(rezervasyon.cikisTarihi);
                    const yeniGiris = new Date(giris);
                    const yeniCikis = new Date(cikis);
                    return (yeniGiris < eskiCikis) && (yeniCikis > eskiGiris);
                }
                return false;
            });
            return !cakismaVar;
        });

        gruplayipEkranaBas(musaitOdalar);
        const odaBolumu = document.getElementById("odalarimiz");
        if (odaBolumu) odaBolumu.scrollIntoView({ behavior: "smooth" });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const bugun = new Date().toISOString().split("T")[0];
    const girisInput = document.getElementById("girisTarihi");
    const cikisInput = document.getElementById("cikisTarihi");

    if (girisInput) girisInput.setAttribute("min", bugun);
    if (cikisInput) cikisInput.setAttribute("min", bugun);

    odalariGetir();
});

