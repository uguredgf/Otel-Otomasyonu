const fiyatAyarlariFormu = document.getElementById("fiyatAyarlariFormu");
const saunaGirdisi = document.getElementById("saunaFiyati");
const havuzGirdisi = document.getElementById("havuzFiyati");
const masajGirdisi = document.getElementById("masajFiyati");
const odaServisiGirdisi = document.getElementById("odaServisiFiyati");
const miniBarGirdisi = document.getElementById("miniBarFiyati");
const sistemiSifirlaButonu = document.getElementById("sistemiSifirlaButonu");
const odaAyarlariFormu = document.getElementById("odaAyarlariFormu");
const odaAyarlariGovdesi = document.getElementById("odaAyarlariGovdesi");

function ayarlariYukle() {
    let kayitliFiyatlar = JSON.parse(localStorage.getItem("hizmetFiyatlari"));
    if (!kayitliFiyatlar) {
        kayitliFiyatlar = { "Sauna": 800, "Havuz": 500, "Masaj": 1500, "Oda Servisi": 400, "Mini Bar": 300 };
        localStorage.setItem("hizmetFiyatlari", JSON.stringify(kayitliFiyatlar));
    }
    saunaGirdisi.value = kayitliFiyatlar["Sauna"];
    havuzGirdisi.value = kayitliFiyatlar["Havuz"];
    masajGirdisi.value = kayitliFiyatlar["Masaj"];
    odaServisiGirdisi.value = kayitliFiyatlar["Oda Servisi"];
    miniBarGirdisi.value = kayitliFiyatlar["Mini Bar"];

    let kayitliOdalar = JSON.parse(localStorage.getItem("otelOdaAyarlari"));
    if (!kayitliOdalar || kayitliOdalar.length === 0) {
        kayitliOdalar = [
            { odaNumarasi: "101", tip: "Standart Oda", fiyat: 1500, kapasite: 2, durum: "Müsait", durumSinifi: "oda-bos" },
            { odaNumarasi: "102", tip: "Lüks Süit", fiyat: 3000, kapasite: 3, durum: "Müsait", durumSinifi: "oda-bos" },
            { odaNumarasi: "103", tip: "Standart Oda", fiyat: 1500, kapasite: 2, durum: "Müsait", durumSinifi: "oda-bos" },
            { odaNumarasi: "201", tip: "Aile Odası", fiyat: 2500, kapasite: 4, durum: "Müsait", durumSinifi: "oda-bos" },
            { odaNumarasi: "202", tip: "Lüks Süit", fiyat: 3000, kapasite: 3, durum: "Müsait", durumSinifi: "oda-bos" },
            { odaNumarasi: "301", tip: "Kral Dairesi", fiyat: 5000, kapasite: 5, durum: "Müsait", durumSinifi: "oda-bos" }
        ];
        localStorage.setItem("otelOdaAyarlari", JSON.stringify(kayitliOdalar));
    }

    let odaTipleri = {};
    kayitliOdalar.forEach(oda => {
        if (!odaTipleri[oda.tip]) {
            odaTipleri[oda.tip] = {
                fiyat: oda.fiyat,
                kapasite: oda.kapasite
            };
        }
    });

    odaAyarlariGovdesi.innerHTML = "";
    for (const [tip, ayarlar] of Object.entries(odaTipleri)) {
        const satir = document.createElement("tr");

        satir.innerHTML = `
            <td>${tip} <input type="hidden" class="ayar-oda-tip" value="${tip}"></td>
            <td><input type="number" class="ayar-oda-fiyat" value="${ayarlar.fiyat}" min="1"></td>
            <td><input type="number" class="ayar-oda-kapasite" value="${ayarlar.kapasite}" min="1" max="10"></td>
        `;
        odaAyarlariGovdesi.appendChild(satir);
    }
}

odaAyarlariFormu.addEventListener("submit", (olay) => {
    olay.preventDefault();

    let yeniTipAyarlari = {};
    const satirlar = odaAyarlariGovdesi.querySelectorAll("tr");

    satirlar.forEach(satir => {
        const tip = satir.querySelector(".ayar-oda-tip").value;
        const fiyat = parseInt(satir.querySelector(".ayar-oda-fiyat").value);
        const kapasite = parseInt(satir.querySelector(".ayar-oda-kapasite").value);
        yeniTipAyarlari[tip] = { fiyat: fiyat, kapasite: kapasite };
    });

    let kayitliOdalar = JSON.parse(localStorage.getItem("otelOdaAyarlari")) || [];

    let guncellenmisOdalar = kayitliOdalar.map(oda => {
        if (yeniTipAyarlari[oda.tip]) {
            return {
                ...oda,
                fiyat: yeniTipAyarlari[oda.tip].fiyat,
                kapasite: yeniTipAyarlari[oda.tip].kapasite
            };
        }
        return oda;
    });

    localStorage.setItem("otelOdaAyarlari", JSON.stringify(guncellenmisOdalar));
    alert("Oda türü fiyatları ve kapasiteleri başarıyla güncellendi! Müşteri sayfasına yansıtıldı.");
});

fiyatAyarlariFormu.addEventListener("submit", (olay) => {
    olay.preventDefault();

    const guncelFiyatlar = {
        "Sauna": parseInt(saunaGirdisi.value),
        "Havuz": parseInt(havuzGirdisi.value),
        "Masaj": parseInt(masajGirdisi.value),
        "Oda Servisi": parseInt(odaServisiGirdisi.value),
        "Mini Bar": parseInt(miniBarGirdisi.value)
    };

    localStorage.setItem("hizmetFiyatlari", JSON.stringify(guncelFiyatlar));
    alert("Hizmet fiyatları başarıyla güncellendi.");
});

sistemiSifirlaButonu.addEventListener("click", () => {
    const sonOnay = confirm("Tüm rezervasyon verileri silinecek! Bu işlemi onaylıyor musunuz?");

    if (sonOnay) {
        localStorage.removeItem("rezervasyonKayitlari");
        alert("Sistem başarıyla sıfırlandı. Tüm kayıtlar temizlendi.");
        window.location.href = "admin.html";
    }
});

document.addEventListener("DOMContentLoaded", ayarlariYukle);