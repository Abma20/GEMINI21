// Navigasi Scroll Effect
window.addEventListener('scroll', function() {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Admin Hidden Access: Ketik #admin di URL
window.addEventListener('hashchange', checkAdmin);
window.addEventListener('load', checkAdmin);

function checkAdmin() {
    if(window.location.hash === '#admin') {
        document.getElementById('admin').style.display = 'block';
        window.scrollTo(0, document.body.scrollHeight);
    }
}

// Data Logic
let count = localStorage.getItem('wash_count') || 0;

function userLogin() {
    const phone = document.getElementById('userPhone').value;
    if(phone.length < 10) return alert("Masukkan nomor WhatsApp yang benar");
    
    document.getElementById('userAuthArea').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'block';
    renderStamps();
}

function renderStamps() {
    const grid = document.getElementById('stampGrid');
    grid.innerHTML = '';
    for(let i=1; i<=10; i++) {
        const s = document.createElement('div');
        s.className = i <= count ? 'stamp active' : 'stamp';
        s.innerHTML = i <= count ? '<i class="fas fa-check"></i>' : i;
        grid.appendChild(s);
    }
    
    const status = document.getElementById('statusText');
    if(count >= 10) {
        status.innerHTML = "<strong style='color:#d4af37'>SELAMAT! ANDA BERHAK 1X CUCI GRATIS!</strong>";
    } else {
        status.innerText = `Anda butuh ${10 - count} stamp lagi untuk bonus cuci gratis.`;
    }
}

function adminLogin() {
    const p = document.getElementById('adminPass').value;
    if(p === 'banjar2026') { // Ganti password admin di sini
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
    } else {
        alert("Password salah");
    }
}

function addStamp() {
    count = parseInt(count) + 1;
    localStorage.setItem('wash_count', count);
    alert("Stamp berhasil ditambahkan!");
    renderStamps();
}

function resetStamp() {
    if(confirm("Yakin ingin reset semua data pelanggan?")) {
        count = 0;
        localStorage.setItem('wash_count', 0);
        location.reload();
    }
}

function logout() {
    location.reload();
}