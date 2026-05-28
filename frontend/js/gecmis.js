let tumLoglar = []; // Logları hafızada tutacağız ki arama yaparken sistemi yormayalım

document.addEventListener("DOMContentLoaded", () => {
    if (!requireAuth()) return;
    applyShell();
    gecmisiYukle();

    // ARAMA MOTORUNU DİNLEYEN SİHİRLİ KOD
    const aramaKutusu = document.getElementById("aramaKutusu");
    if (aramaKutusu) {
        aramaKutusu.addEventListener("input", (e) => {
            const arananKelime = e.target.value.toLowerCase();
            renderHistory(arananKelime); // Her harfte listeyi yeniden çiz
        });
    }
});

// Sayfa ilk açıldığında verileri çeker
function gecmisiYukle() {
    tumLoglar = getOperationLog() || [];
    renderHistory(""); // Boş filtre ile tümünü göster
}

// Filtreye göre listeyi çizen fonksiyon
function renderHistory(filtreKelimesi = "") {
    const target = document.getElementById("gecmisListesi");
    if (!target) return;

    // Arama Kelimesine Göre Filtreleme (Başlıkta, detayda veya türde arar)
    const filtrelenmisLoglar = tumLoglar.filter(log => {
        const metin = `${log.title} ${log.details} ${log.type}`.toLowerCase();
        return metin.includes(filtreKelimesi);
    });

    if (!filtrelenmisLoglar.length) {
        target.innerHTML = `
            <div class='empty-state text-center py-5 text-muted'>
                <i class="fa-solid fa-magnifying-glass mb-3" style="font-size: 2rem; color: #cbd5e1;"></i>
                <h5>Sonuç Bulunamadı</h5>
                <p>"${escapeHtml(filtreKelimesi)}" ile eşleşen bir işlem kaydı yok.</p>
            </div>`;
        return;
    }

    target.innerHTML = filtrelenmisLoglar.map((log) => {
        
        // İşlem tipine göre rozet rengini dinamik olarak belirleme
        let rozetSinifi = "status-badge";
        const tipStr = (log.type || "").toLowerCase();
        
        if (tipStr.includes("çıkış") || tipStr.includes("iptal")) {
            rozetSinifi += " danger"; // Kırmızı (Tehlike/Bitiş)
        } else if (tipStr.includes("ekstra") || tipStr.includes("ödeme")) {
            rozetSinifi += " warning"; // Turuncu (Bekleyen/Ekstra)
        } else if (tipStr.includes("rezervasyon") || tipStr.includes("giriş")) {
            rozetSinifi += " "; // Standart Yeşil (Başarılı)
        } else {
            rozetSinifi = "badge bg-secondary px-3 py-2"; // Tanımsız ise Gri
        }

        // HTML Çıktısı (Şık kart tasarımı)
        return `
            <div class="history-item mb-3 p-3 border rounded shadow-sm bg-white">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h4 class="m-0 text-primary fw-bold fs-6">${escapeHtml(log.title)}</h4>
                    <span class="${rozetSinifi}">${escapeHtml(log.type)}</span>
                </div>
                <p class="mb-2 text-dark" style="font-size: 0.95rem;">${escapeHtml(log.details || "-")}</p>
                <div class="history-meta text-muted mt-2" style="font-size: 0.85rem;">
                    <span><i class="fa-regular fa-clock me-1"></i>${escapeHtml(formatDateTime(log.createdAt))}</span>
                </div>
            </div>
        `;
    }).join("");
}