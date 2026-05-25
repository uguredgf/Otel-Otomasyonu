let tumOdalarData = [];

document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;
    applyShell();
    await odalariGetir();
    filtreleriAyarla();
});

async function odalariGetir() {
    const odalar = await apiIstekAt("/odalar/detayli");
    const odaGrid = document.getElementById("odaGrid");
    
    if (!odaGrid) return;

    odaGrid.innerHTML = "";

    if (odalar && odalar.length > 0) {
        tumOdalarData = odalar.map(normalizeRoom).map(mergeRoomStatus);
        odalariEkranaBas(tumOdalarData);
    } else {
        odaGrid.innerHTML = "<div class='empty-state'>Sistemde kayıtlı oda bulunamadı.</div>";
    }
}

function odalariEkranaBas(odaListesi) {
    const odaGrid = document.getElementById("odaGrid");
    if (!odaGrid) return;
    
    odaGrid.innerHTML = "";
    
    if (odaListesi.length === 0) {
        odaGrid.innerHTML = "<div class='empty-state'>Bu filtreye uygun oda bulunamadı.</div>";
        return;
    }

    odaListesi.forEach((oda) => {
        const sinif = odaDurumSinifi(oda.status);
        const temizlikAksiyonu = sinif === "cleaning"
            ? `<button class="secondary-btn room-card-action" onclick="odayiMusaitYap('${escapeHtml(oda.roomNo)}')">Temizlik bitti</button>`
            : "";

        odaGrid.innerHTML += `
            <article class="room-card ${sinif}">
                <h3>${escapeHtml(oda.roomNo)}</h3>
                <p>${escapeHtml(oda.type)}</p>
                <span class="room-status-pill">${escapeHtml(oda.status)}</span>
                ${temizlikAksiyonu}
            </article>
        `;
    });
}

function odaDurumSinifi(durum) {
    switch (durum) {
        case "Dolu": return "occupied";
        case "Temizlikte": return "cleaning";
        case "Arızalı":
        case "Arizali": return "issue";
        default: return "empty";
    }
}

async function odayiMusaitYap(roomNo) {
    const durumPaketi = {
        oda_no: String(roomNo),
        yeni_durum: "Boş" 
    };
    
    const sonuc = await apiIstekAt("/odalar/durum", "PUT", durumPaketi);
    
    if (sonuc) {
        if (typeof setRoomOverride === "function") {
            setRoomOverride(roomNo, "Boş");
        }
        
        addOperationLog("oda", `${roomNo} numarali oda musaite alındı`, "Temizlik tamamlandı ve oda tekrar kullanıma acildı.");
        await odalariGetir();
    }
}

function filtreleriAyarla() {
    const filtreButonlari = document.querySelectorAll(".room-toolbar .status-badge");
    
    filtreButonlari.forEach(buton => {
        buton.addEventListener("click", (e) => {
            const secilenFiltre = e.target.getAttribute("data-filter");
            
            filtreButonlari.forEach(b => b.style.opacity = "0.5");
            e.target.style.opacity = "1";

            let filtrelenmisOdalar = tumOdalarData;
            
            if (secilenFiltre !== "all") {
                filtrelenmisOdalar = tumOdalarData.filter(oda => {
                    const sinif = odaDurumSinifi(oda.status);
                    return sinif === secilenFiltre;
                });
            }
            
            odalariEkranaBas(filtrelenmisOdalar);
        });
    });
    
    const tumuButonu = document.querySelector('[data-filter="all"]');
    if (tumuButonu) tumuButonu.click();
}