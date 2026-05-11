document.addEventListener("DOMContentLoaded", () => {
    rezervasyonlariGetir();
});

function rezervasyonlariGetir() {
    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    rezervasyonlariEkranaBas(tumKayitlar);
}

function rezervasyonlariEkranaBas(kayitlar) {
    // Tablonun gövdesini seçiyoruz
    const tabloGovdesi = document.querySelector("tbody");
    if (!tabloGovdesi) return;

    tabloGovdesi.innerHTML = "";

    kayitlar.forEach(kayit => {
        const satir = document.createElement("tr");

        const idHucresi = document.createElement("td");
        idHucresi.textContent = kayit.id;

        const musteriHucresi = document.createElement("td");
        musteriHucresi.textContent = kayit.musteri;

        const odaHucresi = document.createElement("td");
        odaHucresi.textContent = kayit.odaNo;

        const girisHucresi = document.createElement("td");
        girisHucresi.textContent = kayit.girisTarihi;

        const cikisHucresi = document.createElement("td");
        cikisHucresi.textContent = kayit.cikisTarihi;

        const durumHucresi = document.createElement("td");
        const durumEtiketi = document.createElement("span");
        // Önceden kaydedilmiş CSS sınıfını kullanıyoruz
        durumEtiketi.className = "durum-etiketi " + (kayit.durumSinifi || "bekleniyor");
        durumEtiketi.textContent = kayit.durum;
        durumHucresi.appendChild(durumEtiketi);

        const islemHucresi = document.createElement("td");

        // --- İŞTE SİHRİN OLDUĞU YER (BUTON GİZLEME KONTROLÜ) ---
        if (kayit.durum === "Beklemede") {
            // Beklemedeki rezervasyon için hem Onayla hem İptal Et butonu gösterilir
            const onaylaButonu = document.createElement("button");
            onaylaButonu.className = "islem-butonu";
            onaylaButonu.style.backgroundColor = "#27ae60";
            onaylaButonu.style.marginRight = "5px";
            onaylaButonu.textContent = "Onayla";
            onaylaButonu.addEventListener("click", () => durumuGuncelle(kayit.id, "Onaylandı", "onaylandi"));

            const iptalButonu = document.createElement("button");
            iptalButonu.className = "islem-butonu";
            iptalButonu.style.backgroundColor = "#e74c3c";
            iptalButonu.textContent = "İptal Et";
            iptalButonu.addEventListener("click", () => durumuGuncelle(kayit.id, "İptal Edildi", "iptal"));

            islemHucresi.appendChild(onaylaButonu);
            islemHucresi.appendChild(iptalButonu);

        } else if (kayit.durum === "Onaylandı") {
            // Zaten onaylanmış birisi için sadece "İptal Et" butonu bırakılır (gelmekten vazgeçerse diye)
            const iptalButonu = document.createElement("button");
            iptalButonu.className = "islem-butonu";
            iptalButonu.style.backgroundColor = "#e74c3c";
            iptalButonu.textContent = "İptal Et";
            iptalButonu.addEventListener("click", () => durumuGuncelle(kayit.id, "İptal Edildi", "iptal"));

            islemHucresi.appendChild(iptalButonu);

        } else {
            // Çıkış Yaptı veya İptal Edildi ise hiçbir buton gösterme, sadece tire (-) koy
            islemHucresi.textContent = "-";
            islemHucresi.style.color = "#7f8c8d";
            islemHucresi.style.fontWeight = "bold";
        }

        satir.appendChild(idHucresi);
        satir.appendChild(musteriHucresi);
        satir.appendChild(odaHucresi);
        satir.appendChild(girisHucresi);
        satir.appendChild(cikisHucresi);
        satir.appendChild(durumHucresi);
        satir.appendChild(islemHucresi);

        tabloGovdesi.appendChild(satir);
    });
}

function durumuGuncelle(id, yeniDurum, yeniSinif) {
    // İşlem yapmadan önce emin misin diye soralım
    const onay = confirm(`Bu rezervasyonun durumunu '${yeniDurum}' olarak değiştirmek istediğinize emin misiniz?`);

    if (onay) {
        let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];

        let guncelListe = tumKayitlar.map(kayit => {
            if (kayit.id === id) {
                return { ...kayit, durum: yeniDurum, durumSinifi: yeniSinif };
            }
            return kayit;
        });

        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(guncelListe));
        rezervasyonlariGetir(); // Sayfayı yenilemeden tabloyu anında güncelle
    }
}
