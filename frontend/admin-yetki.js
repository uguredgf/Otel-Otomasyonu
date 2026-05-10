document.addEventListener("DOMContentLoaded", () => {
    const rol = localStorage.getItem("kullaniciRolu");

    // 1. Giriş yapılmamışsa geri gönder
    if (!rol) {
        window.location.href = "admin-login.html";
        return;
    }

    // 2. Resepsiyon ise Ayarlar menüsünü gizle
    if (rol === "resepsiyon") {
        const menüLinkleri = document.querySelectorAll(".yan-menu nav ul li a");
        menüLinkleri.forEach(link => {
            if (link.textContent.includes("Ayarlar")) {
                link.parentElement.style.display = "none";
            }
        });

        // Eğer resepsiyon zorla ayarlar sayfasına girmeye çalışırsa engelle
        if (window.location.pathname.includes("admin-ayarlar.html")) {
            alert("Bu sayfaya erişim yetkiniz yok!");
            window.location.href = "admin.html";
        }
    }

    // Çıkış butonu ekleme (isteğe bağlı)
    const kullaniciBilgisi = document.querySelector(".kullanici-bilgisi");
    if (kullaniciBilgisi) {
        kullaniciBilgisi.innerHTML = `${rol.toUpperCase()} | <a href="#" id="cikisYap" style="color:red; text-decoration:none;">Çıkış</a>`;
        document.getElementById("cikisYap").addEventListener("click", () => {
            localStorage.removeItem("kullaniciRolu");
            window.location.href = "admin-login.html";
        });
    }
});