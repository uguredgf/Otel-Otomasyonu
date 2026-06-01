let aktifMisafirler = [];
let odaListesi = [];

document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;
    applyShell();
    hizmetleriYukle();

    const params = parseQuery();
    
    // 1. DÜZELTME: Tüm verilerin aynı anda ve tamamen yüklenmesini bekliyoruz
    await Promise.all([
        aktifMisafirleriYukle(params.get("reservationId")), 
        odalariYukle(), 
        bekleyenOdemeleriYukle()
    ]);

    // Bütün veriler eksiksiz geldi, artık faturayı güvenle çizebiliriz
    faturaGoster();

    const misafirSecimi = document.getElementById("aktifMisafirSecimi");
    if (misafirSecimi) {
        misafirSecimi.addEventListener("change", faturaGoster);
    }

    const hizmetBtn = document.getElementById("hizmetEkleBtn");
    if (hizmetBtn) {
        hizmetBtn.addEventListener("click", hizmetEkle);
    }

    const faturaBtn = document.getElementById("faturayiKapatBtn");
    if (faturaBtn) {
        faturaBtn.addEventListener("click", cikisYapVeFaturaKes);
    }
});

function hizmetleriYukle() {
    const select = document.getElementById("hizmetSecimi");
    if (!select) return;

    const services = getServiceCatalog();
    select.innerHTML = services.map((service) => `
        <option value="${service.id}">${escapeHtml(service.ad)} - ${formatCurrency(service.fiyat)}</option>
    `).join("");
}

async function aktifMisafirleriYukle(selectedReservationId) {
    const data = await apiIstekAt("/aktif-misafirler");
    aktifMisafirler = filterCheckedOutGuests((data || []).map(normalizeGuest));

    const select = document.getElementById("aktifMisafirSecimi");
    if (!select) return;

    select.innerHTML = '<option value="">Misafir Seçin</option>';
    aktifMisafirler.forEach((guest) => {
        select.innerHTML += `<option value="${escapeHtml(guest.reservationId)}">${escapeHtml(guest.customerName)} (Oda ${escapeHtml(guest.roomNo)})</option>`;
    });

    if (selectedReservationId) {
        select.value = selectedReservationId;
    }
}

async function odalariYukle() {
    const data = await apiIstekAt("/odalar/detayli");
    odaListesi = (data || []).map(normalizeRoom).map(mergeRoomStatus);
}

async function bekleyenOdemeleriYukle() {
    const target = document.getElementById("bekleyenOdemeListesi");
    if (!target) return;

    const data = await apiIstekAt("/finans/odeme-bekleyenler");
    if (!data || !data.length) {
        target.innerHTML = "<div class='mini-note'>Bekleyen odeme kaydi gorunmuyor.</div>";
        return;
    }

    target.innerHTML = data.slice(0, 5).map((item) => `
        <div class="mini-list-item">
            <span>${escapeHtml(item.musteri_adi || item.ad || "Misafir")}</span>
            <strong>${formatCurrency(item.tutar || item.toplam_tutar || 0)}</strong>
        </div>
    `).join("");
}

function getSelectedGuest() {
    const selectedId = document.getElementById("aktifMisafirSecimi")?.value;
    return aktifMisafirler.find((guest) => String(guest.reservationId) === String(selectedId)) || null;
}

async function hizmetEkle() {
    const guest = getSelectedGuest();
    const serviceId = Number(document.getElementById("hizmetSecimi")?.value || 0);
    const quantity = Number(document.getElementById("hizmetAdedi")?.value || 1);

    if (!guest) {
        alert("Lutfen once bir misafir secin.");
        return;
    }

    if (!serviceId || quantity < 1) {
        alert("Lutfen gecerli bir hizmet ve adet secin.");
        return;
    }

    const result = await apiIstekAt("/rezervasyonlar/hizmet-ekle", "POST", {
        rezervasyon_id: Number(guest.reservationId),
        hizmet_id: serviceId,
        adet: quantity
    });

    if (!result) return;

    const service = getServiceCatalog().find((item) => item.id === serviceId);
    const price = Number(service?.fiyat || 0) * quantity;
    addReservationExpense(guest.reservationId, {
        serviceId,
        quantity,
        ad: service?.ad || "Ek hizmet",
        fiyat: Number(service?.fiyat || 0),
        toplam: price,
        tarih: new Date().toISOString()
    });

    addOperationLog(
        "hizmet",
        `${guest.customerName} icin ek hizmet eklendi`,
        `${service?.ad || "Ek hizmet"} x${quantity} (${formatCurrency(price)})`
    );

    alert(`Basarili! ${result.mesaj}`);
    faturaGoster();
}

async function faturaGoster() {
    const guest = getSelectedGuest();
    const tbody = document.getElementById("faturaGovdesi");
    const title = document.getElementById("faturaBaslik");
    const total = document.getElementById("genelToplam");

    if (!tbody || !title || !total) return;

    if (!guest) {
        title.textContent = "Fatura detayi";
        tbody.innerHTML = "<tr><td colspan='4'><div class='empty-state'>Faturayi gormek icin aktif bir misafir secin.</div></td></tr>";
        total.textContent = "Genel Toplam: 0 TL";
        return;
    }

    const room = odaListesi.find((item) => String(item.roomNo) === String(guest.roomNo));
    const nights = nightsBetween(guest.checkIn, guest.checkOut);
    const roomPrice = Number(room?.price || 0);
    const roomTotal = roomPrice * nights;

    const rows = [{
        tarih: `${guest.checkIn} / ${guest.checkOut}`,
        kalem: `Konaklama (${nights} gece x ${formatCurrency(roomPrice)})`,
        tutar: roomTotal,
        hizmetId: null 
    }];

    
    const extras = await apiIstekAt(`/rezervasyonlar/${guest.reservationId}/hizmetler`) || [];
    
    extras.forEach((item) => {
        const miktar = Number(item.hizmet_adet || 1);
        const kalemToplam = Number(item.hizmet_birim_fiyat || 0) * miktar;
        
        rows.push({
            tarih: "-", 
            kalem: `${item.hizmet_adi} x${miktar}`,
            tutar: kalemToplam,
            hizmetId: item.hizmet_id
        });
    });

    const grandTotal = rows.reduce((sum, row) => sum + Number(row.tutar || 0), 0);
    title.textContent = `${guest.customerName} - Oda ${guest.roomNo} Fatura Detayi`;
    
    tbody.innerHTML = rows.map((row) => `
        <tr>
            <td>${escapeHtml(row.tarih)}</td>
            <td>${escapeHtml(row.kalem)}</td>
            <td>${formatCurrency(row.tutar)}</td>
            <td class="text-end">
                ${row.hizmetId ? `<button class="btn btn-sm btn-outline-danger py-0" onclick="ekstraHizmetiSil(${guest.reservationId}, ${row.hizmetId})"><i class="bi bi-trash"></i> Sil</button>` : ''}
            </td>
        </tr>
    `).join("");
    
    total.textContent = `Genel Toplam: ${formatCurrency(grandTotal)}`;
}

async function cikisYapVeFaturaKes() {
    const guest = getSelectedGuest();
    if (!guest) {
        alert("Lutfen cikis yapacak misafiri secin.");
        return;
    }

    const paymentMethod = document.getElementById("odemeYontemi")?.value || "Nakit";
    
    const endpoint = `/finans/fatura-kes/${guest.reservationId}?odeme_yontemi=${encodeURIComponent(paymentMethod)}`;
    const result = await apiIstekAt(endpoint, "POST");
    if (!result) return;

  const durumVerisi = {
        rezervasyon_id: Number(guest.reservationId),
        yeni_durum: "Tamamlandı"
    };
    await apiIstekAt("/rezervasyonlar/durum", "PUT", durumVerisi);

    markReservationCheckedOut(guest);
    setRoomOverride(guest.roomNo, "Temizlikte");

    const extras = getReservationExpenses(guest.reservationId);
    const room = odaListesi.find((item) => String(item.roomNo) === String(guest.roomNo));
    const grandTotal = (Number(room?.price || 0) * nightsBetween(guest.checkIn, guest.checkOut))
        + extras.reduce((sum, item) => sum + Number(item.toplam || 0), 0);

    addOperationLog(
        "fatura",
        `${guest.customerName} cikis yapti`,
        `Oda ${guest.roomNo} icin ${formatCurrency(grandTotal)} tahsil edildi. Oda temizlikte olarak isaretlendi.`,
        { reservationId: guest.reservationId, roomNo: guest.roomNo }
    );

    clearReservationExpenses(guest.reservationId);

    alert(`Basarili! ${result.mesaj}`);
    await aktifMisafirleriYukle();
    faturaGoster();
}

async function ekstraHizmetiSil(rezervasyonId, hizmetId) {
    if (!confirm("Bu ekstra hizmeti faturadan silmek istediğinize emin misiniz?")) {
        return;
    }

    const silmeVerisi = {
        rezervasyon_id: Number(rezervasyonId),
        hizmet_id: Number(hizmetId)
    };
    
    const result = await apiIstekAt("/rezervasyonlar/hizmet-sil", "DELETE", silmeVerisi);
    
    if (result) {
        alert("Hizmet faturadan başarıyla kaldırıldı.");
        await faturaGoster();
    }
}