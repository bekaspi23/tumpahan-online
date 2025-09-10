import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit, startAfter } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDlr6HFC7DKsJqKCg0cBmY1IPm4y5GRvz8",
  authDomain: "tumpahan-online.firebaseapp.com",
  projectId: "tumpahan-online",
  storageBucket: "tumpahan-online.firebasestorage.app",
  messagingSenderId: "78912202532",
  appId: "1:78912202532:web:6593d4b6275abd118575b1",
  measurementId: "G-WG7X9WJ9LL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let lastVisible = null;

// Simpan curhat (responsif)
async function simpanCurhat() {
  const inputEl = document.getElementById("curhatInput");
  const input = inputEl.value.trim();
  if (!input) return alert("Tulis dulu curhatanmu!");

  // Buat curhat baru
  const curhat = {
    teks: input,
    tanggal: new Date().toLocaleString()
  };

  // Tambahkan langsung ke DOM supaya terasa instan
  appendCurhatToDOM(curhat, "prepend");

  inputEl.value = "";

  // Simpan ke Firebase di belakang layar
  try {
    await addDoc(collection(db, "curhatan"), curhat);
  } catch (err) {
    alert("Gagal menyimpan di cloud: " + err);
  }
}

// Tampilkan curhat (Load More)
async function tampilkanCurhat(reload = false) {
  const daftar = document.getElementById("daftarCurhat");

  if (reload) lastVisible = null;

  let q = query(
    collection(db, "curhatan"),
    orderBy("tanggal", "desc"),
    limit(10)
  );
  if (lastVisible) q = query(
    collection(db, "curhatan"),
    orderBy("tanggal", "desc"),
    startAfter(lastVisible),
    limit(10)
  );

  const querySnapshot = await getDocs(q);

  if (reload) daftar.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    appendCurhatToDOM(data, "append", docSnap.id);
    lastVisible = docSnap;
  });

  // Load More button
  if (!document.getElementById("loadMoreBtn")) {
    const btn = document.createElement("button");
    btn.id = "loadMoreBtn";
    btn.textContent = "Load More";
    btn.onclick = () => tampilkanCurhat();
    daftar.parentElement.appendChild(btn);
  }
}

// Tambahkan curhat ke DOM
function appendCurhatToDOM(curhat, position = "append", id = null) {
  const daftar = document.getElementById("daftarCurhat");
  const li = document.createElement("li");
  li.innerHTML = `
    ${curhat.teks}
    <small>${curhat.tanggal}</small>
    ${id ? `<button class="delete-btn" onclick="hapusCurhat('${id}', this)">Hapus</button>` : ""}
  `;
  if (position === "prepend") {
    daftar.insertBefore(li, daftar.firstChild);
  } else {
    daftar.appendChild(li);
  }
}

// Hapus curhat (responsif)
async function hapusCurhat(id, btnEl) {
  // Hapus langsung dari DOM supaya terasa instan
  const li = btnEl.closest("li");
  li.remove();

  // Hapus di Firebase di belakang layar
  try {
    await deleteDoc(doc(db, "curhatan", id));
  } catch (err) {
    alert("Gagal hapus di cloud: " + err);
  }
}

// Load pertama kali
document.addEventListener("DOMContentLoaded", () => tampilkanCurhat(true));

// Supaya bisa dipanggil dari HTML onclick
window.simpanCurhat = simpanCurhat;
window.hapusCurhat = hapusCurhat;
