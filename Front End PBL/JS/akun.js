document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addStudentForm");
  const tableBody = document.getElementById("studentsTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  // ===================== MUAT DATA DARI LOCALSTORAGE =====================
  function loadUsers(filter = "") {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    tableBody.innerHTML = "";

    const filteredUsers = users.filter(user =>
      user.nama.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
    );

    filteredUsers.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.nama}</td>
        <td>${user.email}</td>
        <td>${user.active ? "Aktif" : "Nonaktif"}</td>
<td>
  <button class="edit-btn" onclick="editUser(${index})">Edit</button>
  <button class="toggle-btn" onclick="toggleStatus(${index})">
    ${user.active ? "Nonaktifkan" : "Aktifkan"}
  </button>
  <button class="delete-btn" onclick="deleteUser(${index})">Hapus</button>
  <button class="detail-btn" onclick="showDetails(${index})">Detail</button>
</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // ===================== TAMBAH AKUN BARU =====================
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const password = document.getElementById("studentPassword").value.trim();

    if (!nama || !email || !password) {
      alert("Semua kolom wajib diisi!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existing = users.find(u => u.email === email);
    if (existing) {
      alert("Email sudah terdaftar!");
      return;
    }

    users.push({ nama, email, password, active: true });
    localStorage.setItem("users", JSON.stringify(users));

    form.reset();
    loadUsers();
    alert("Akun berhasil ditambahkan!");
  });

  // ===================== FUNGSI EDIT AKUN (TERMASUK PASSWORD) =====================
  window.editUser = function (index) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users[index];

    const newName = prompt("Masukkan nama baru:", user.nama);
    const newEmail = prompt("Masukkan email baru:", user.email);
    const newPassword = prompt("Masukkan password baru (kosongkan jika tidak ingin diubah):", "");

    if (newName) user.nama = newName;
    if (newEmail) user.email = newEmail;
    if (newPassword.trim() !== "") user.password = newPassword.trim();

    localStorage.setItem("users", JSON.stringify(users));
    loadUsers();
    alert("Data akun berhasil diperbarui!");
  };

  // ===================== FUNGSI AKTIF/NONAKTIF =====================
  window.toggleStatus = function (index) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users[index].active = !users[index].active;
    localStorage.setItem("users", JSON.stringify(users));
    loadUsers();
  };

  // ===================== FUNGSI HAPUS AKUN =====================
  window.deleteUser = function (index) {
    if (confirm("Yakin ingin menghapus akun ini?")) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      loadUsers();
    }
  };

// ===================== FUNGSI DETAIL (LIHAT JADWAL) =====================
window.showDetails = function (index) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users[index];
  
  // Ambil semua jadwal yang dibuat mahasiswa ini (disimpan di localStorage)
  const allEvents = JSON.parse(localStorage.getItem("events")) || [];
  const userEvents = allEvents.filter(e => e.email === user.email);

  // Buat tampilan modal
  const modal = document.createElement("div");
  modal.classList.add("modal-overlay");
  modal.innerHTML = `
    <div class="modal-box">
      <h2>📅 Jadwal ${user.nama}</h2>
      <div class="calendar-mini">
        ${userEvents.length === 0 ? "<p>Tidak ada jadwal yang ditambahkan.</p>" : ""}
      </div>
      <div class="event-list">
        ${userEvents.map(ev => `
          <div class="event-item">
            <strong>${ev.title}</strong><br>
            📆 ${ev.date || "-"}<br>
            ⏰ ${ev.time || "-"}<br>
            🏫 ${ev.room || "-"}<br>
            👨‍🏫 ${ev.dosen || "-"}
          </div>
        `).join("")}
      </div>
      <button class="close-modal">Tutup</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });
};


  // ===================== FUNGSI PENCARIAN =====================
  searchBtn.addEventListener("click", () => {
    const filter = searchInput.value.trim();
    loadUsers(filter);
  });

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      loadUsers(searchInput.value.trim());
    }
  });

  // ===================== INISIALISASI AWAL =====================
  loadUsers();
});
