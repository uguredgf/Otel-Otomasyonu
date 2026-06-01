const STORAGE_KEYS = {
    serviceCatalog: "hotel_service_catalog",
    operationLog: "hotel_operation_log",
    roomOverrides: "hotel_room_overrides",
    checkedOut: "hotel_checked_out_reservations",
    reservationExpenses: "hotel_reservation_expenses"
};

const DEFAULT_SERVICE_CATALOG = [
    { id: 1, ad: "Açık Büfe Kahvaltı"},
    { id: 2, ad: "SPA & Masaj", },
    { id: 3, ad: "Minibar Kullanımı" },
    { id: 4, ad: "Havaalanı VIP Transfer" },
    { id: 5, ad: "Oda Servisi (Akşam Yemeği)"} ,
    { id: 6, ad: "Kuru Temizleme" },
    { id: 7, ad: "Ütü Hizmeti" },
    { id: 8, ad: "Kapalı Havuz Girişi" },
    { id: 9, ad: "Otopark ve Vale" },
    { id: 10, ad: "Geç Çıkış (Late Check-out)" }
];

function requireAuth() {
    initLocalState();
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "yetkili.html";
        return false;
    }
    return true;
}

function initLocalState() {
    if (!readJson(STORAGE_KEYS.serviceCatalog)) {
        writeJson(STORAGE_KEYS.serviceCatalog, DEFAULT_SERVICE_CATALOG);
    }
    if (!readJson(STORAGE_KEYS.operationLog)) {
        writeJson(STORAGE_KEYS.operationLog, []);
    }
    if (!readJson(STORAGE_KEYS.roomOverrides)) {
        writeJson(STORAGE_KEYS.roomOverrides, {});
    }
    if (!readJson(STORAGE_KEYS.checkedOut)) {
        writeJson(STORAGE_KEYS.checkedOut, {});
    }
    if (!readJson(STORAGE_KEYS.reservationExpenses)) {
        writeJson(STORAGE_KEYS.reservationExpenses, {});
    }
}



function applyShell(roleElementId = "kullaniciRol", roleTextId = "kullaniciRolMetin") {
    const role = localStorage.getItem("rol") || "Personel";
    const roleElement = document.getElementById(roleElementId);
    const roleTextElement = document.getElementById(roleTextId);

    // Sağ üstteki ve sağ taraftaki paneldeki rol isimlerini yazdır
    if (roleElement) {
        roleElement.textContent = `${role} oturumu`;
    }
    if (roleTextElement) {
        roleTextElement.textContent = role;
    }

    const mevcutSayfa = window.location.pathname.split("/").pop();
    
    // Menü Linklerini Seç
    const menuAyarlar = document.getElementById("menuAyarlar");

    // --- 1. RESEPSİYONİST KONTROLÜ ---
    if (role === "Resepsiyonist") {
        // Ayarlar sayfasına girmeye çalışıyorsa engelle
        if (mevcutSayfa === "ayarlar.html") {
            alert("Ayarlar sayfasına erişim yetkiniz bulunmamaktadır!");
            window.location.href = "dashboard.html";
            return; 
        }
        
        // Ayarlar menüsünü tıklanamaz yap ve soluklaştır
        if (menuAyarlar) {
            menuAyarlar.style.pointerEvents = "none"; 
            menuAyarlar.style.opacity = "0.5"; // Tıklanmadığını belli etmek için soluk gösterir
        }
    }

    // --- 2. TEMİZLİK KONTROLÜ ---
    if (role === "Temizlik") {

        if (mevcutSayfa !== "odalar.html") {
            window.location.href = "odalar.html";
            return; 
        }

        const tumLinkler = document.querySelectorAll(".nav-link-item");
        tumLinkler.forEach(link => {
            const href = link.getAttribute("href");
            if (href !== "odalar.html" && href !== "#") {
                link.style.pointerEvents = "none";
                link.style.opacity = "0.5"; 
            }
        });
    }
}
function readJson(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getServiceCatalog() {
    return readJson(STORAGE_KEYS.serviceCatalog) || [...DEFAULT_SERVICE_CATALOG];
}

function setServiceCatalog(services) {
    writeJson(STORAGE_KEYS.serviceCatalog, services);
}

function getOperationLog() {
    return readJson(STORAGE_KEYS.operationLog) || [];
}

function addOperationLog(type, title, details = "", meta = {}) {
    const logs = getOperationLog();
    logs.unshift({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        title,
        details,
        meta,
        createdAt: new Date().toISOString()
    });
    writeJson(STORAGE_KEYS.operationLog, logs.slice(0, 300));
}

function getCheckedOutMap() {
    return readJson(STORAGE_KEYS.checkedOut) || {};
}

function isReservationCheckedOut(reservationId) {
    return Boolean(getCheckedOutMap()[String(reservationId)]);
}

function markReservationCheckedOut(reservation) {
    const checked = getCheckedOutMap();
    checked[String(reservation.reservationId)] = {
        roomNo: reservation.roomNo,
        customerName: reservation.customerName,
        checkedOutAt: new Date().toISOString()
    };
    writeJson(STORAGE_KEYS.checkedOut, checked);
}

function clearReservationCheckout(reservationId) {
    const checked = getCheckedOutMap();
    delete checked[String(reservationId)];
    writeJson(STORAGE_KEYS.checkedOut, checked);
}

function getRoomOverrides() {
    return readJson(STORAGE_KEYS.roomOverrides) || {};
}

function setRoomOverride(roomNo, status) {
    const overrides = getRoomOverrides();
    overrides[String(roomNo)] = {
        durum: status,
        updatedAt: new Date().toISOString()
    };
    writeJson(STORAGE_KEYS.roomOverrides, overrides);
}

function clearRoomOverride(roomNo) {
    const overrides = getRoomOverrides();
    delete overrides[String(roomNo)];
    writeJson(STORAGE_KEYS.roomOverrides, overrides);
}

function syncReservationStatusEffects(reservation, newStatus) {
    if (!reservation) return;

    if (newStatus === "İptal Edildi" || newStatus === "Iptal Edildi") {
        clearReservationCheckout(reservation.reservationId);
        setRoomOverride(reservation.roomNo, "Boş");
        return;
    }

    if (newStatus === "Onaylandı" || newStatus === "Onaylandi") {
        clearReservationCheckout(reservation.reservationId);
        clearRoomOverride(reservation.roomNo);
        return;
    }

    if (newStatus === "Tamamlandı" || newStatus === "Tamamlandi") {
        markReservationCheckedOut(reservation);
        setRoomOverride(reservation.roomNo, "Temizlikte");
    }
}

function getReservationExpensesMap() {
    return readJson(STORAGE_KEYS.reservationExpenses) || {};
}

function getReservationExpenses(reservationId) {
    const expenses = getReservationExpensesMap();
    return expenses[String(reservationId)] || [];
}

function addReservationExpense(reservationId, item) {
    const expenses = getReservationExpensesMap();
    const key = String(reservationId);
    if (!expenses[key]) {
        expenses[key] = [];
    }
    expenses[key].push(item);
    writeJson(STORAGE_KEYS.reservationExpenses, expenses);
}

function clearReservationExpenses(reservationId) {
    const expenses = getReservationExpensesMap();
    delete expenses[String(reservationId)];
    writeJson(STORAGE_KEYS.reservationExpenses, expenses);
}

function normalizeGuest(raw) {
    return {
        reservationId: raw.rezervasyon_id ?? raw.id ?? raw.rezId ?? "",
        customerName: [raw.musteri_adi ?? raw.ad ?? raw.isim ?? "", raw.musteri_soyadi ?? raw.soyad ?? raw.soyisim ?? ""]
            .join(" ")
            .trim() || raw.musteri || "Bilinmeyen Misafir",
        roomNo: String(raw.oda_no ?? raw.odaNo ?? raw.oda_numarasi ?? "-"),
        checkIn: raw.rezerve_giris_tarihi ?? raw.girisTarihi ?? raw.giris_tarihi ?? "-",
        checkOut: raw.rezerve_cikis_tarihi ?? raw.cikisTarihi ?? raw.cikis_tarihi ?? "-",
        identityNo: raw.tc_kimlik ?? raw.tcKimlik ?? "-",
        email: raw.email ?? raw.eposta ?? "-",
        phone: raw.telefon ?? "-",
        status: raw.durum ?? "Onaylandı"
    };
}

function normalizeReservation(raw) {
    return {
        reservationId: raw.rezervasyon_id ?? raw.id ?? "",
        customerName: [raw.musteri_adi ?? "", raw.musteri_soyadi ?? ""].join(" ").trim() || "Bilinmeyen Misafir",
        roomNo: String(raw.oda_no ?? "-"),
        roomType: raw.odaTur_adi ?? raw.oda_tipi ?? "-",
        checkIn: raw.rezerve_giris_tarihi ?? "-",
        checkOut: raw.rezerve_cikis_tarihi ?? "-",
        status: raw.rezerve_durumu ?? "Beklemede",
        paymentStatus: raw.odeme_durumu ?? "-"
    };
}

function normalizeRoom(raw) {
    return {
        roomId: raw.oda_id ?? raw.id ?? "",
        roomNo: String(raw.odaNumarasi ?? raw.oda_no ?? raw.odaNo ?? "-"),
        type: raw.tip ?? raw.oda_tipi ?? "Belirtilmedi",
        floor: raw.kat ?? "",
        capacity: raw.kapasite ?? "",
        price: Number(raw.fiyat ?? 0),
        status: raw.durum ?? "Boş"
    };
}

function mergeRoomStatus(room) {
    return room;
}

function filterCheckedOutGuests(list) {
    return list.filter((guest) => !isReservationCheckedOut(guest.reservationId));
}

function formatCurrency(value) {
    return `${new Intl.NumberFormat("tr-TR").format(Number(value) || 0)} TL`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("tr-TR");
}

function formatDateKey(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || "");
    return date.toISOString().slice(0, 10);
}

function nightsBetween(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
}

function parseQuery() {
    return new URLSearchParams(window.location.search);
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    window.location.href = "yetkili.html";
}

function sayfaYetkiKontrolu(event, hedefSayfa) {
    const rol = localStorage.getItem("rol");

    if (rol === "Admin") {
        return true; 
    }

    if (rol === "Resepsiyonist") {
        if (hedefSayfa === "ayarlar") {
            event.preventDefault(); 
            alert("Ayarlar sayfasına erişim yetkiniz bulunmamaktadır!");
            return false;
        }
        return true; 
    }

    if (rol === "Temizlik") {
        if (hedefSayfa !== "odalar") {
            event.preventDefault(); 
            alert("Bu sayfaya erişim yetkiniz yok! Sadece Oda Durumları ekranına erişebilirsiniz.");
            return false;
        }
        return true;
    }

    return true;
}