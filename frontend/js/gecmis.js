document.addEventListener("DOMContentLoaded", () => {
    if (!requireAuth()) return;
    applyShell();
    renderHistory();
});

function renderHistory() {
    const target = document.getElementById("gecmisListesi");
    if (!target) return;

    const logs = getOperationLog();
    if (!logs.length) {
        target.innerHTML = "<div class='empty-state'>Henuz kaydedilmis bir islem gecmisi bulunmuyor.</div>";
        return;
    }

    target.innerHTML = logs.map((log) => `
        <article class="history-item">
            <div class="history-meta">
                <span class="status-badge">${escapeHtml(log.type)}</span>
                <span>${escapeHtml(formatDateTime(log.createdAt))}</span>
            </div>
            <h4>${escapeHtml(log.title)}</h4>
            <p>${escapeHtml(log.details || "-")}</p>
        </article>
    `).join("");
}
