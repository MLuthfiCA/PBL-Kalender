<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Manajemen Akun | POLIPLAN</title>
    <link rel="stylesheet" href="../CSS/akun.css" />
  </head>

  <body>
    <!-- ================= NAVBAR ================= -->
    <nav class="navbar">
      <div class="container">
        <a href="admin_homepage.php">
          <img src="../logo login.png" class="logo">
        </a>
        <div class="search-box">
          <input type="text" id="searchInput" placeholder="Cari akun..." />
          <button id="searchBtn">🔍</button>
        </div>
        <ul class="nav-links">
          <li><a href="admin_homepage.php">Kembali</a></li>
        </ul>
      </div>
    </nav>

    <!-- ================= HALAMAN ADMIN ================= -->
    <section id="admin-panel" class="admin-panel">
      <div class="container">
        <h2>📋 Manajemen Akun Mahasiswa</h2>
        <p class="sub">Kelola data pengguna dan kontrol akses sistem.</p>

        <!-- Form Tambah Akun -->
        <div class="admin-form">
          <h3>Tambah Akun Mahasiswa</h3>
          <form id="addStudentForm">
            <input type="text" id="studentName" placeholder="Nama Mahasiswa" required />
            <input type="email" id="studentEmail" placeholder="Email Mahasiswa" required />
            <input type="password" id="studentPassword" placeholder="Password" required />
            <button type="submit">Tambah Akun</button>
          </form>
        </div>

        <!-- Daftar Akun -->
        <div class="admin-table">
          <h3>Daftar Akun Terdaftar</h3>
          <table id="studentTable">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="studentsTableBody">
              <!-- Data mahasiswa akan muncul di sini -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <script src="../JS/akun.js"></script>
  </body>
</html>
