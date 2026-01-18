import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// KONFIGURASI FIREBASE ANDA
const firebaseConfig = {
  apiKey: "AIzaSyBhraloQrZI7kGAN-t0cvhI_pVQPPjgV34",
  authDomain: "banjarshine.firebaseapp.com",
  projectId: "banjarshine",
  storageBucket: "banjarshine.firebasestorage.app",
  messagingSenderId: "802908274864",
  appId: "1:802908274864:web:04cbbe901004400e063b75",
  measurementId: "G-G2C6X4CHPL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- SELEKTOR ELEMEN ---
const authContainer = document.getElementById('authContainer');
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const userDashboard = document.getElementById('userDashboard');
const adminPanel = document.getElementById('adminPanel');

// --- LOGIKA NAVIGASI HALAMAN ---
document.addEventListener('DOMContentLoaded', () => {
    // Cek jika URL mengandung #admin
    if(window.location.hash === "#admin") {
        const pass = prompt("Masukkan Password Rahasia Admin:");
        if(pass === "banjar2026") {
            authContainer.style.display = 'none';
            adminPanel.style.display = 'block';
        } else {
            alert("Akses Ditolak!");
            window.location.hash = "";
        }
    }

    // Tombol Pindah Login/Daftar
    document.getElementById('btnShowReg').onclick = () => {
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    };
    document.getElementById('btnShowLogin').onclick = () => {
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
    };

    // Tombol Auth
    document.getElementById('btnReg').onclick = registerUser;
    document.getElementById('btnLogin').onclick = loginUser;
    document.getElementById('btnLogoutUser').onclick = logout;
    document.getElementById('btnLogoutAdmin').onclick = logout;

    // Tombol Admin
    document.getElementById('btnSearch').onclick = searchCustomer;
    document.getElementById('btnAddStamp').onclick = () => updateStamp(1);
    document.getElementById('btnResetStamp').onclick = () => updateStamp(-99); // Reset ke 0
});

// --- FUNGSI CORE ---

async function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;

    if(!name || !phone || !pass) return alert("Lengkapi data!");

    try {
        await setDoc(doc(db, "users", phone), {
            name, phone, pass, stamp: 0
        });
        alert("Pendaftaran Berhasil!");
        location.reload();
    } catch (e) { alert("Gagal: " + e.message); }
}

async function loginUser() {
    const phone = document.getElementById('loginPhone').value;
    const pass = document.getElementById('loginPass').value;

    const userSnap = await getDoc(doc(db, "users", phone));
    if(userSnap.exists() && userSnap.data().pass === pass) {
        showDashboard(userSnap.data());
    } else {
        alert("Nomor atau Password Salah!");
    }
}

function showDashboard(data) {
    authContainer.style.display = 'none';
    userDashboard.style.display = 'block';
    document.getElementById('userName').innerText = "Halo, " + data.name;
    document.getElementById('displayPhone').innerText = data.phone;
    
    const grid = document.getElementById('stampGrid');
    grid.innerHTML = '';
    for(let i=1; i<=10; i++) {
        const s = document.createElement('div');
        s.className = i <= data.stamp ? 'stamp active' : 'stamp';
        s.innerHTML = i <= data.stamp ? '✔' : i;
        grid.appendChild(s);
    }
}

let currentCustomerPhone = "";
async function searchCustomer() {
    const phone = document.getElementById('searchPhone').value;
    const userSnap = await getDoc(doc(db, "users", phone));
    if(userSnap.exists()) {
        currentCustomerPhone = phone;
        document.getElementById('customerResult').style.display = 'block';
        document.getElementById('resName').innerText = userSnap.data().name;
        document.getElementById('resCount').innerText = userSnap.data().stamp;
    } else { alert("User tidak ditemukan!"); }
}

async function updateStamp(val) {
    if(!currentCustomerPhone) return;
    const userRef = doc(db, "users", currentCustomerPhone);
    const userSnap = await getDoc(userRef);
    let newCount = userSnap.data().stamp + val;
    if(newCount < 0) newCount = 0;
    if(newCount > 10) newCount = 10;

    await updateDoc(userRef, { stamp: newCount });
    alert("Stamp Berhasil Diupdate!");
    searchCustomer(); // Refresh data
}

function logout() {
    location.reload();
}