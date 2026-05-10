const adminOdaListesi = document.getElementById("adminOdaListesi");
<<<<<<< HEAD

function adminOdalariGetir() {
    const otelOdalari = [
        { odaNumarasi: "101", kapasite: 2, durum: "Müsait", durumSinifi: "oda-bos" },
        { odaNumarasi: "102", kapasite: 3, durum: "Dolu", durumSinifi: "oda-dolu" },
        { odaNumarasi: "103", kapasite: 2, durum: "Müsait", durumSinifi: "oda-bos" },
        { odaNumarasi: "201", kapasite: 4, durum: "Dolu", durumSinifi: "oda-dolu" },
        { odaNumarasi: "202", kapasite: 3, durum: "Müsait", durumSinifi: "oda-bos" },
        { odaNumarasi: "301", kapasite: 5, durum: "Müsait", durumSinifi: "oda-bos" }
    ];

    adminOdalariEkranaBas(otelOdalari);
}

function adminOdalariEkranaBas(odalar) {
    adminOdaListesi.innerHTML = "";

    odalar.forEach(oda => {
        const kutu = document.createElement("div");
        kutu.className = "oda-kutu " + oda.durumSinifi;

        const numara = document.createElement("h3");
        numara.textContent = oda.odaNumarasi;

        const kapasiteMetni = document.createElement("p");
        kapasiteMetni.textContent = "Kapasite: " + oda.kapasite + " Kişi";
        kapasiteMetni.style.fontSize = "0.8rem";
        kapasiteMetni.style.marginBottom = "5px";

        const durumMetni = document.createElement("p");
        durumMetni.textContent = oda.durum;

        kutu.appendChild(numara);
        kutu.appendChild(kapasiteMetni);
        kutu.appendChild(durumMetni);

        adminOdaListesi.appendChild(kutu);
=======
const durumFiltresi = document.getElementById("durumFiltresi");

let aktifOdalarListesi = [];

const odaResimleri = {
    "Ekonomik Oda": "ekonomikoda.jpg",
    "Standart Tek": "tekkisilikoda.jpg",
    "Standart Çift": "çiftkisilikoda.jpeg",
    "Aile Odası": "4kisilikoda.jpeg",
    "Balayı Süiti": "balayısuiti.jpg",
    "Kral Dairesi": "kraldairesi.jpg"
};

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

function adminOdalariGetir() {
    let kayitliOdalar = [];
    let tumRezervasyonlar = [];

    try {
        kayitliOdalar = JSON.parse(localStorage.getItem("otelOdaAyarlari")) || [];
        tumRezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    } catch (error) {
        kayitliOdalar = [];
    }

    // ZORUNLU TEMİZLİK KONTROLÜ: Eski 3 kişilik veya 4 kişilik oda isimleri hafızada kaldıysa SİL!
    const eskiOdaVarMi = kayitliOdalar.some(oda => oda.tip === "Standart Üç Kişilik" || oda.tip === "Standart Dört Kişilik");
    const aileOdasiVarMi = kayitliOdalar.some(oda => oda.tip === "Aile Odası");

    if (kayitliOdalar.length < 100 || eskiOdaVarMi || !aileOdasiVarMi) {
        localStorage.removeItem("otelOdaAyarlari"); // HAFIZAYI ZORLA TEMİZLE
        kayitliOdalar = yuzOdaOlustur(); // YENİDEN İNŞA ET
        localStorage.setItem("otelOdaAyarlari", JSON.stringify(kayitliOdalar));
        console.log("Eski oda kayıtları silindi, Aile Odası düzeni kuruldu.");
    }

    const doluOdaNumaralari = tumRezervasyonlar
        .filter(r => r.durum === "Onaylandı")
        .map(r => r.odaNo);

    aktifOdalarListesi = kayitliOdalar.map(oda => {
        if (oda.durum !== "Temizlikte" && doluOdaNumaralari.includes(oda.odaNumarasi)) {
            return { ...oda, durum: "Dolu", durumSinifi: "oda-dolu" };
        }
        return oda;
    });

    adminOdalariEkranaBas(aktifOdalarListesi);
}

function adminOdalariEkranaBas(odalar) {
    if (!adminOdaListesi) return;
    adminOdaListesi.innerHTML = "";

    adminOdaListesi.style.display = "block";
    adminOdaListesi.style.width = "100%";

    for (let kat = 1; kat <= 10; kat++) {
        const buKatinOdalari = odalar.filter(oda => Math.floor(parseInt(oda.odaNumarasi) / 100) === kat);

        if (buKatinOdalari.length > 0) {
            const katBaslik = document.createElement("h2");
            katBaslik.textContent = kat + ". Kat";
            katBaslik.style.color = "#2c3e50";
            katBaslik.style.borderBottom = "3px solid #3498db";
            katBaslik.style.paddingBottom = "5px";
            katBaslik.style.marginTop = kat === 1 ? "0" : "2.5rem";
            katBaslik.style.marginBottom = "1.5rem";
            katBaslik.style.textAlign = "left";

            const katIzgarasi = document.createElement("div");
            katIzgarasi.style.display = "grid";
            katIzgarasi.style.gridTemplateColumns = "repeat(auto-fill, minmax(130px, 1fr))";
            katIzgarasi.style.gap = "1.2rem";
            katIzgarasi.style.width = "100%";

            buKatinOdalari.forEach(oda => {
                const kutu = document.createElement("div");
                kutu.className = "oda-kutu " + oda.durumSinifi;
                kutu.setAttribute("data-durum", oda.durumSinifi);
                kutu.style.padding = "1.5rem 0.5rem";

                if (oda.durum === "Temizlikte") {
                    kutu.style.cursor = "pointer";
                    kutu.title = "Temizlik bittiyse müsait yapmak için tıkla";
                    kutu.addEventListener("click", () => odayiMusaitYap(oda.odaNumarasi));
                }

                const numara = document.createElement("h3");
                numara.textContent = oda.odaNumarasi;
                numara.style.fontSize = "1.4rem";
                numara.style.margin = "0 0 5px 0";
                numara.style.color = "#2c3e50";

                const tipMetni = document.createElement("p");
                tipMetni.textContent = oda.tip;
                tipMetni.style.fontSize = "0.75rem";
                tipMetni.style.color = "#7f8c8d";
                tipMetni.style.margin = "0 0 10px 0";

                const durumMetni = document.createElement("p");
                durumMetni.textContent = oda.durum;
                durumMetni.style.fontSize = "0.95rem";
                durumMetni.style.fontWeight = "bold";
                durumMetni.style.margin = "0";

                kutu.appendChild(numara);
                kutu.appendChild(tipMetni);
                kutu.appendChild(durumMetni);

                katIzgarasi.appendChild(kutu);
            });

            adminOdaListesi.appendChild(katBaslik);
            adminOdaListesi.appendChild(katIzgarasi);
        }
    }
}

function odayiMusaitYap(odaNo) {
    const onay = confirm(odaNo + " numaralı odanın temizliği bitti mi? Müsait duruma getirilecek.");
    if (onay) {
        let kayitliOdalar = JSON.parse(localStorage.getItem("otelOdaAyarlari"));
        let guncelOdalar = kayitliOdalar.map(oda => {
            if (oda.odaNumarasi === odaNo) {
                return { ...oda, durum: "Müsait", durumSinifi: "oda-bos" };
            }
            return oda;
        });
        localStorage.setItem("otelOdaAyarlari", JSON.stringify(guncelOdalar));
        adminOdalariGetir();
        if (durumFiltresi) durumFiltresi.value = "hepsi";
    }
}

if (durumFiltresi) {
    durumFiltresi.addEventListener("change", (e) => {
        const secilenDurum = e.target.value;
        if (secilenDurum === "hepsi") {
            adminOdalariEkranaBas(aktifOdalarListesi);
        } else {
            const filtrelenmis = aktifOdalarListesi.filter(oda => oda.durumSinifi === secilenDurum);
            adminOdalariEkranaBas(filtrelenmis);
        }
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
    });
}

document.addEventListener("DOMContentLoaded", adminOdalariGetir);