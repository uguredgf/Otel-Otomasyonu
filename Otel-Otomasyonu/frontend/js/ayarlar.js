document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;
    
    // GÜVENLİK KONTROLÜ: Resepsiyonist ayarlar sayfasına giremez
    const rol = localStorage.getItem("rol");
    if (rol === "Resepsiyonist") {
        alert("Bu sayfaya erişim yetkiniz bulunmamaktadır!");
        window.location.href = "dashboard.html";
        return; // Sayfanın geri kalanını yüklemesini durdur
    }

    applyShell();
    await odaTipleriniYukle();
    hizmetleriYukle();
});

// ... (dosyanın geri kalanı aynı kalacak) ...

async function odaTipleriniYukle() {
    const tbody = document.getElementById("odaAyarlariGovdesi");
    if (!tbody) return;

    const data = await apiIstekAt("/odalar/detayli");
    const rooms = (data || []).map(normalizeRoom);
    const roomTypes = {};

    rooms.forEach((room) => {
        if (!roomTypes[room.type]) {
            roomTypes[room.type] = {
                type: room.type,
                price: room.price,
                capacity: room.capacity
            };
        }
    });

    tbody.innerHTML = Object.values(roomTypes).map((item) => `
        <tr>
            <td>
                ${escapeHtml(item.type)}
                <input type="hidden" class="room-type-name" value="${escapeHtml(item.type)}">
            </td>
            <td><input type="number" class="form-control room-type-price" value="${Number(item.price || 0)}" min="0"></td>
            <td><input type="number" class="form-control room-type-capacity" value="${Number(item.capacity || 1)}" min="1"></td>
        </tr>
    `).join("");
}

function hizmetleriYukle() {
    const tbody = document.getElementById("hizmetAyarlariGovdesi");
    if (!tbody) return;

    tbody.innerHTML = getServiceCatalog().map((service) => `
        <tr>
            <td>
                ${escapeHtml(service.ad)}
                <input type="hidden" class="service-id" value="${service.id}">
                <input type="hidden" class="service-name" value="${escapeHtml(service.ad)}">
            </td>
            <td><input type="number" class="form-control service-price" value="${Number(service.fiyat || 0)}" min="0"></td>
        </tr>
    `).join("");
}

const odaFormu = document.getElementById("odaAyarlariFormu");
if (odaFormu) {
    odaFormu.addEventListener("submit", async (event) => {
        event.preventDefault();
        const rows = [...document.querySelectorAll("#odaAyarlariGovdesi tr")];

        for (const row of rows) {
            const payload = {
                oda_turu_adi: row.querySelector(".room-type-name").value,
                yeni_fiyat: Number(row.querySelector(".room-type-price").value || 0),
                yeni_kapasite: Number(row.querySelector(".room-type-capacity").value || 1)
            };

            const result = await apiIstekAt("/ayarlar/oda-fiyat", "PUT", payload);
            if (result) {
                addOperationLog(
                    "ayar",
                    `${payload.oda_turu_adi} oda tipi guncellendi`,
                    `${formatCurrency(payload.yeni_fiyat)} / kapasite ${payload.yeni_kapasite}`
                );
            }
        }

        alert("Oda tipi ayarlari guncellendi.");
    });
}

const hizmetFormu = document.getElementById("hizmetAyarlariFormu");
if (hizmetFormu) {
    hizmetFormu.addEventListener("submit", async (event) => {
        event.preventDefault();
        const rows = [...document.querySelectorAll("#hizmetAyarlariGovdesi tr")];
        const nextCatalog = [];

        for (const row of rows) {
            const service = {
                id: Number(row.querySelector(".service-id").value),
                ad: row.querySelector(".service-name").value,
                fiyat: Number(row.querySelector(".service-price").value || 0)
            };
            nextCatalog.push(service);

            const result = await apiIstekAt("/ayarlar/hizmet-fiyat", "PUT", {
                hizmet_adi: service.ad,
                yeni_fiyat: service.fiyat
            });

            if (result) {
                addOperationLog(
                    "ayar",
                    `${service.ad} hizmet fiyati guncellendi`,
                    `${formatCurrency(service.fiyat)} olarak kaydedildi`
                );
            }
        }

        setServiceCatalog(nextCatalog);
        alert("Hizmet katalogu guncellendi.");
    });
}
