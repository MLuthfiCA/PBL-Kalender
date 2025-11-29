// === AMBIL ELEMEN ===
const form = document.querySelector(".note-form");
const textarea = document.querySelector("textarea[name='catatan']");
const tableBody = document.querySelector(".riwayat-table tbody");

// === LOAD CATATAN SAAT WEB DIBUKA ===
document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
});

// === SIMPAN CATATAN KE LOCALSTORAGE ===
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isiCatatan = textarea.value.trim();
    if (isiCatatan === "") return;

    const catatanBaru = {
        tanggal: new Date().toISOString().slice(0, 10),
        isi: isiCatatan
    };

    // ambil catatan lama
    let catatan = JSON.parse(localStorage.getItem("catatanList")) || [];
    catatan.push(catatanBaru);

    // simpan ulang
    localStorage.setItem("catatanList", JSON.stringify(catatan));

    // reset textarea
    textarea.value = "";

    // tampilkan langsung
    addNoteToTable(catatan.length, catatanBaru.tanggal, catatanBaru.isi);
});

// === FUNGSI MENAMPILKAN CATATAN KE TABEL ===
function addNoteToTable(no, tanggal, isi) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${no}</td>
        <td>${tanggal}</td>
        <td>${isi}</td>
    `;

    tableBody.appendChild(row);
}

// === LOAD CATATAN LAMA ===
function loadNotes() {
    let catatan = JSON.parse(localStorage.getItem("catatanList")) || [];

    tableBody.innerHTML = "";

    catatan.forEach((item, index) => {
        addNoteToTable(index + 1, item.tanggal, item.isi);
    });
}
