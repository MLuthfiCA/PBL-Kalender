document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addStudentForm");
  const tableBody = document.getElementById("studentsTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  // load user data dan render tabel
  async function loadUsers(filter = "") {
    try {
      const res = await fetch("akun.php?action=get_users");
      const users = await res.json();

      localStorage.setItem('users', JSON.stringify(users));

      tableBody.innerHTML = "";

      const filtered = users.filter(u =>
        (u.nama || '').toLowerCase().includes(filter.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(filter.toLowerCase())
      );

      filtered.forEach(user => {
        const row = document.createElement('tr');
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
    } catch (err) {
      console.error('Gagal load users:', err);
      tableBody.innerHTML = '<tr><td colspan="5">Gagal memuat data.</td></tr>';
    }
  }

  // add user baru
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nama = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const password = document.getElementById('studentPassword').value.trim();

    try {
      const res = await fetch('akun.php?action=create_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password })
      });
      const result = await res.json();
      alert(result.message);
      form.reset();
      loadUsers();
    } catch (err) {
      console.error('Gagal membuat user:', err);
      alert('Gagal membuat user. Cek console.');
    }
  });

  // delete user
  window.deleteUser = async function (id) {
    if (!confirm('Yakin ingin menghapus akun ini?')) return;
    try {
      const res = await fetch('akun.php?action=delete_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      alert(result.message);
      loadUsers();
    } catch (err) {
      console.error('Gagal menghapus:', err);
      alert('Gagal menghapus akun.');
    }
  };

  // popup edit modal
  window.openEditModal = function (id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => Number(u.id) === Number(id));
    if (!user) return alert('Data user tidak ditemukan');

    // build modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <h3>Edit Akun</h3>
        <form id="editUserForm">
          <input type="hidden" name="id" value="${user.id}" />
          <label>Nama</label>
          <input type="text" name="nama" value="${(user.nama||'').replace(/"/g,'&quot;')}" required />
          <label>Email</label>
          <input type="email" name="email" value="${(user.email||'').replace(/"/g,'&quot;')}" required />
          <label>Password (kosongkan jika tidak ingin mengganti)</label>
          <input type="password" name="password" />
          <div class="modal-actions">
            <button type="submit">Simpan</button>
            <button type="button" id="cancelEdit">Batal</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const form = document.getElementById('editUserForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = {
        id: formData.get('id'),
        nama: formData.get('nama').trim(),
        email: formData.get('email').trim(),
        password: formData.get('password') || ''
      };

      try {
        const res = await fetch('akun.php?action=update_user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        alert(result.message);
        overlay.remove();
        loadUsers();
      } catch (err) {
        console.error('Gagal menyimpan:', err);
        alert('Gagal menyimpan perubahan.');
      }
    });

    document.getElementById('cancelEdit').addEventListener('click', () => overlay.remove());
  };

  // simple search
  searchBtn.addEventListener('click', () => loadUsers(searchInput.value.trim()));
  searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') loadUsers(searchInput.value.trim()); });

  loadUsers();
});

