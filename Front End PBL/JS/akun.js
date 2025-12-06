document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addStudentForm");
  const tableBody = document.getElementById("studentsTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  // ===================== MUAT DATA DARI LOCALSTORAGE =====================
  async function loadUsers(filter = "") {
    const res = await fetch("api_jadwal.php?action=get_users");
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
// ========== TAMBAHAN: CREATE User via API ==========
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const password = document.getElementById("studentPassword").value.trim();

  const res = await fetch("api_jadwal.php?action=create_user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, email, password })
  });

  const result = await res.json();
  alert(result.message);

  form.reset();
  loadUsers();
});


  // ===================== FUNGSI EDIT AKUN (TERMASUK PASSWORD) via API =====================
window.editUser = async function (id) {
  const newName = prompt("Masukkan nama baru:");
  const newEmail = prompt("Masukkan email baru:");
  const newPassword = prompt("Masukkan password baru (kosong jika tidak diganti):");

  const res = await fetch("api_jadwal.php?action=update_user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      nama: newName,
      email: newEmail,
      password: newPassword
    })
  });

  const result = await res.json();
  alert(result.message);
  loadUsers();
};


  // ===================== FUNGSI AKTIF/NONAKTIF =====================
window.toggleStatus = async function (id) {
  const res = await fetch("api_jadwal.php?action=toggle_status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  const result = await res.json();
  alert(result.message);
  loadUsers();
};


  // ===================== FUNGSI HAPUS AKUN via API=====================
window.deleteUser = async function (id) {
  if (!confirm("Yakin ingin menghapus akun ini?")) return;

  const res = await fetch("api_jadwal.php?action=delete_user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  const result = await res.json();
  alert(result.message);
  loadUsers();
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
