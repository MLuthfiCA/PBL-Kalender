document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addStudentForm");
  const tableBody = document.getElementById("studentsTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  // muat data dari localstorage
  async function loadUsers(filter = "") {
    // Fetch users from server API and render
    const res = await fetch("akun.php?action=get_users");
    let users = [];
    try {
      users = await res.json();
    } catch (e) {
      users = JSON.parse(localStorage.getItem("users")) || [];
    }

    // Persist a copy for client-side lookup (used by detail modal)
    localStorage.setItem("users", JSON.stringify(users));

    tableBody.innerHTML = "";

    const filteredUsers = users.filter(user =>
      (user.nama || "").toLowerCase().includes(filter.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(filter.toLowerCase())
    );

    filteredUsers.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nama}</td>
        <td>${user.password || ''}</td>
        <td>${user.email}</td>
        <td>
          <button class="edit-btn" onclick="openEditModal(${user.id})">Edit</button>
          <button class="hapus-btn" onclick="deleteUser(${user.id})">Hapus</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

// tambah akun baru via API
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const password = document.getElementById("studentPassword").value.trim();

  const res = await fetch("akun.php?action=create_user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, email, password })
  });

  const result = await res.json();
  alert(result.message);

  form.reset();
  loadUsers();
});


// edit pake popup modal
window.openEditModal = function (id) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.id == id) || {};

  // buat modal
  const modal = document.createElement('div');
  modal.classList.add('modal-overlay');
  modal.innerHTML = `
    <div class="modal-box" id="editUserModal">
      <button class="modal-close" aria-label="Tutup">&times;</button>
      <h2 class="modal-title">Edit Akun</h2>
      <form id="editUserForm" class="modal-form">
        <input type="hidden" id="editUserId" value="${user.id || ''}" />
        <label for="editUserName">Nama</label>
        <input type="text" id="editUserName" value="${user.nama || ''}" required autofocus />

        <label for="editUserEmail">Email</label>
        <input type="email" id="editUserEmail" value="${user.email || ''}" required />

        <label for="editUserPassword">Password <span class="muted">(kosong = tidak diubah)</span></label>
        <input type="password" id="editUserPassword" placeholder="Biarkan kosong jika tidak ganti" />

        <div class="modal-actions">
          <button type="submit" class="btn-primary">Simpan</button>
          <button type="button" class="btn-secondary" id="cancelEdit">Batal</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // helper close
  const cleanup = () => {
    document.removeEventListener('keydown', escHandler);
    modal.remove();
  };

  // close handlers
  modal.querySelector('.modal-close').addEventListener('click', cleanup);
  modal.querySelector('#cancelEdit').addEventListener('click', cleanup);

  // click outside to close
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) cleanup();
  });

  // escape key
  const escHandler = (ev) => { if (ev.key === 'Escape') cleanup(); };
  document.addEventListener('keydown', escHandler);

  // submit edit
  modal.querySelector('#editUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editUserId').value;
    const nama = document.getElementById('editUserName').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();
    const password = document.getElementById('editUserPassword').value;

    const res = await fetch('akun.php?action=update_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nama, email, password })
    });
    const result = await res.json();
    alert(result.message);
    cleanup();
    loadUsers();
  });
};


  // fungsi hapus user via API
window.deleteUser = async function (id) {
  if (!confirm("Yakin ingin menghapus akun ini?")) return;
  const res = await fetch("akun.php?action=delete_user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  const result = await res.json();
  alert(result.message);
  loadUsers();
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

  loadUsers();
});
