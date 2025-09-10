import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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

// Simpan curhat
async function simpanCurhat() {
  const input = document.getElementById("curhatInput").value;
  if (input.trim() === "") {
    alert("Tulis dulu curhatanmu!");
    return;
  }

  const curhat = {
    teks: input,
    tanggal: new Date().toLocaleString()
  };

  await addDoc(collection(db, "curhatan"), curhat);
  document.getElementById("curhatInput").value = "";
  tampilkanCurhat();
}

// Tampilkan curhat
async function tampilkanCurhat() {
  const daftar = document.getElementById("daftarCurhat");
  daftar.innerHTML = "<li>Loading...</li>";

  const q = query(collection(db, "curhatan"), orderBy("tanggal", "desc"));
  const querySnapshot = await getDocs(q);
  daftar.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      ${data.teks}
      <small>${data.tanggal}</small>
      <button class="delete-btn" onclick="hapusCurhat('${docSnap.id}')">Hapus</button>
    `;
    daftar.appendChild(li);
  });

  if (daftar.innerHTML === "") {
    daftar.innerHTML = "<li><i>Belum ada curhatan</i></li>";
  }
}

// Hapus curhat
async function hapusCurhat(id) {
  await deleteDoc(doc(db, "curhatan", id));
  tampilkanCurhat();
}

// Load pertama kali
document.addEventListener("DOMContentLoaded", tampilkanCurhat);

// Supaya bisa dipanggil dari HTML onclick
window.simpanCurhat = simpanCurhat;
window.hapusCurhat = hapusCurhat;