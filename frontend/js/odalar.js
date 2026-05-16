document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;
    applyShell();
    await odalariGetir();
});

async function odalariGetir() {
    const odalar = await apiIstekAt("/odalar/detayli");
    const odaGrid = document.getElementById("odaGrid");
    if (!odaGrid) return;

    odaGrid.innerHTML = "";

    if (odalar && odalar.length > 0) {
        odalar.map(normalizeRoom).map(mergeRoomStatus).forEach((oda) => {
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
    } else {
        odaGrid.innerHTML = "<div class='empty-state'>Sistemde kayitli oda bulunamadi.</div>";
    }
}

function odaDurumSinifi(durum) {
    switch (durum) {
        case "Dolu":
            return "occupied";
        case "Temizlikte":
            return "cleaning";
        case "Arızalı":
        case "Arizali":
            return "issue";
        default:
            return "empty";
    }
}

// Odayı Veritabanında "Boş" Durumuna Çeken Fonksiyon
async function odayiMusaitYap(roomNo) {
    // 1. Python Backend'ine gerçek güncelleme paketini gönderiyoruz
    const durumPaketi = {
        oda_no: String(roomNo),
        yeni_durum: "Boş" 
    };
    
    // 2. API isteğini atıyoruz
    const sonuc = await apiIstekAt("/odalar/durum", "PUT", durumPaketi);
    
    // 3. Eğer veritabanı başarıyla güncellendiyse arayüzü yenile
    if (sonuc) {
        // Eski mimarinin hata vermemesi için yerel hafızayı da güncelliyoruz
        if (typeof setRoomOverride === "function") {
            setRoomOverride(roomNo, "Boş");
        }
        
        addOperationLog("oda", `${roomNo} numarali oda musaite alindi`, "Temizlik tamamlandi ve oda tekrar kullanima acildi.");
        
        await odalariGetir();
    }
}
