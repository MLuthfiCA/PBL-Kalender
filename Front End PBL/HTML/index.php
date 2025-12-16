<?php
session_start();
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistem Penjadwalan Kuliah - Dashboard</title>
    <link rel="stylesheet" href="../CSS/index.css" />
</head>

<body>
    <!-- navbar -->
    <nav class="navbar">
        <div class="container">
            <a href="index.php">
                <div class="logo" role="img" aria-label="POLIPLAN logo"></div>
            </a>
            
            <ul class="nav-links">
                <li><a href="#home">Beranda</a></li>
                <li><a href="#features">Fitur</a></li>
                <li><a href="#tentang">Tentang Kami</a></li>
            </ul>
            
            <div class="login-buttons">
                <button class="btn-login" onclick="openLoginModal()">Login</button>
            </div>
        </div>
    </nav>

    <!-- modal login -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeLoginModal()">&times;</span>
            <h2>Pilih Akses</h2>
            <div class="login-options">
                <a href="login_page.php" class="option-card user-card">
                    <div class="icon icon-person" aria-hidden="true"></div>
                    <h3>Login Mahasiswa</h3>
                    <p>Masuk sebagai mahasiswa untuk mengatur jadwal kuliah Anda</p>
                </a>
                <a href="admin_login.php" class="option-card admin-card">
                    <div class="icon icon-shield" aria-hidden="true"></div>
                    <h3>Login Admin</h3>
                    <p>Masuk sebagai admin untuk mengelola sistem</p>
                </a>
            </div>
        </div>
    </div>

    <!-- hero section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <h1>Selamat Datang di POLIPLAN</h1>
            <p>Kelola jadwal kuliah Anda dengan mudah dan efisien</p>
            <button class="btn-cta" onclick="openLoginModal()">Mulai Sekarang</button>
        </div>
    </section>

    <!-- feature section -->
    <section id="features" class="features-section">
        <div class="container">
            <h2>Fitur Utama</h2>
            <p class="section-subtitle">Nikmati kemudahan dalam mengelola jadwal akademik Anda</p>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon icon-calendar" aria-hidden="true"></div>
                    <h3>Jadwal Kalender</h3>
                    <p>Kelola jadwal kuliah dan aktivitas dengan tampilan kalender interaktif.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon icon-note" aria-hidden="true"></div>
                    <h3>Catatan Pembelajaran</h3>
                    <p>Simpan catatan penting dan tugas agar tidak terlewat.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon icon-repeat" aria-hidden="true"></div>
                    <h3>Jadwal Berulang</h3>
                    <p>Buat jadwal otomatis untuk kelas rutin tanpa input ulang.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon icon-lightning" aria-hidden="true"></div>
                    <h3>Real-time Update</h3>
                    <p>Setiap perubahan jadwal langsung diperbarui secara otomatis.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- looping developer section -->
<section id="team" class="team-section">
  <div class="container">
    <h2>Tim Pengembang</h2>
    <p class="section-subtitle">Dibangun oleh:</p>

    <div class="carousel-wrapper">
      <div class="carousel">
        <!-- Set 1 -->
        <div class="carousel-item">
          <div class="card-profile">
            <div class="card-image">
              <img src="../dimas.jpeg" alt="Dimas Cakra Surya Ananta" />
            </div>
            <h3>Dimas Cakra Surya Ananta</h3>
            <p>Front End, Back End</p>
          </div>
        </div>

        <div class="carousel-item">
          <div class="card-profile">
            <div class="card-image">
              <img src="../damar.png" alt="Damar Widi Nugroho" />
            </div>
            <h3>Damar Widi Nugroho</h3>
            <p>Front End, Back End</p>
          </div>
        </div>

        <div class="carousel-item">
          <div class="card-profile">
            <div class="card-image">
              <img src="../rafi.jpeg" alt="Raffi" />
            </div>
            <h3>Ahmad Rafi' Sa'id</h3>
            <p>Front End</p>
          </div>
        </div>

        <div class="carousel-item">
          <div class="card-profile">
            <div class="card-image">
              <img src="../lutpi.jpeg" alt="M.Lutfi" />
            </div>
            <h3>M. Lutffi causart Azavi</h3>
            <p>Front End</p>
          </div>
        </div>

        <!-- Set 2 (duplikat untuk looping halus) -->
        <div class="carousel-item">
          <div class="card-profile">
            <div class="card-image">
              <img src="../dimas.jpeg" alt="Dimas Cakra Surya Ananta" />
            </div>
            <h3>Dimas Cakra Surya Ananta</h3>
            <p>Front End, Back End</p>
          </div>
        </div>

        <div class="carousel-item">
          <div class="card-profile">
            <div class="card-image">
              <img src="../damar.png" alt="Damar Widi Nugroho" />
            </div>
            <h3>Damar Widi Nugroho</h3>
            <p>Front End, Back End</p>
          </div>
        </div>

        <div class="carousel-item">
          <div class="card-profile">
            <div class="card-image">
              <img src="../rafi.jpeg" alt="Raffi" />
            </div>
            <h3>Ahmad Rafi' Sa'id</h3>
            <p>Front End</p>
          </div>
        </div>

        <div class="carousel-item">
          <div class="card-profile">
            <div class="card-image">
              <img src="../lutpi.jpeg" alt="M.Lutfi" />
            </div>
            <h3>M. Luthfi Causart Azavi</h3>
            <p>Front End</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


    <!-- about section -->
    <section id="tentang" class="about-section">
        <div class="container">
            <h2>Tentang Website Kami</h2>
            <div class="about-content">
                <p>
                    POLIPLAN adalah website jadwal pribadi untuk mahasiswa Teknik Informatika Politeknik Negeri Batam.
                    Tujuannya sederhana, membantu mahasiswa mengatur waktu kuliah, tugas, dan kegiatan sehari-hari dengan lebih mudah.
                </p>
                
                <p>
                    Dengan tampilan yang ringan dan praktis, POLIPLAN dirancang supaya jadwal tidak cuma tersimpan, tapi juga benar-benar berguna dalam keseharian kampus.
                </p>
            </div>
        </div>
    </section>

    <!-- footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Sistem Penjadwalan Kuliah. All rights reserved.</p>
            <ul class="social-link">
                <li><a href="https://www.instagram.com/polibatamofficial/">Instagram</a></li>
                <li><a href="https://www.youtube.com/c/PolibatamTV/">Youtube</a></li>
                <li><a href="https://www.polibatam.ac.id/">Website</a></li>
            </ul>
        </div>
    </footer>

    <script src="../JS/index.js"></script>
</body>
</html>
