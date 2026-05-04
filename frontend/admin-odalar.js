const adminOdaListesi = document.getElementById("adminOdaListesi");

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
    });
}

document.addEventListener("DOMContentLoaded", adminOdalariGetir);