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
                <h5>Sonuç Bulunamadı</h5>
                <p>"${filtreKelimesi}" ile eşleşen bir işlem kaydı yok.</p>
            </div>`;
        return;
    }

    target.innerHTML = filtrelenmisLoglar.map((log) => `
        <article class="history-item border-bottom pb-3 mb-3">
            <div class="history-meta d-flex justify-content-between mb-2">
                <span class="badge bg-secondary">${escapeHtml(log.type)}</span>
                <span class="text-muted small">${escapeHtml(formatDateTime(log.createdAt))}</span>
            </div>
            <h4 class="fs-6 fw-bold mb-1">${escapeHtml(log.title)}</h4>
            <p class="mb-0 text-secondary small">${escapeHtml(log.details || "-")}</p>
        </article>
    `).join("");
}