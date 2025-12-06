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
    <!-- NAVBAR -->
    <nav class="navbar">
        <div class="container">
            <a href="index.php">
                <img src="../logo login.png" class="logo" height="90px" width="90px"/>
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

    <!-- MODAL LOGIN -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeLoginModal()">&times;</span>
            <h2>Pilih Akses</h2>
            <div class="login-options">
                <a href="login_page.php" class="option-card user-card">
                    <div class="icon">👤</div>
                    <h3>Login Mahasiswa</h3>
                    <p>Masuk sebagai mahasiswa untuk mengatur jadwal kuliah Anda</p>
                </a>
                <a href="admin_login.php" class="option-card admin-card">
                    <div class="icon">🔐</div>
                    <h3>Login Admin</h3>
                    <p>Masuk sebagai admin untuk mengelola sistem</p>
                </a>
            </div>
        </div>
    </div>

    <!-- HERO SECTION -->
    <section id="home" class="hero">
        <div class="hero-content">
            <h1>Selamat Datang di POLIPLAN</h1>
            <p>Kelola jadwal kuliah Anda dengan mudah dan efisien</p>
            <button class="btn-cta" onclick="openLoginModal()">Mulai Sekarang</button>
        </div>
    </section>

    <!-- FEATURES SECTION -->
    <section id="features" class="features-section">
        <div class="container">
            <h2>Fitur Utama</h2>
            <p class="section-subtitle">Nikmati kemudahan dalam mengelola jadwal akademik Anda</p>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📅</div>
                    <h3>Jadwal Kalender</h3>
                    <p>Isi</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">📝</div>
                    <h3>Catatan Pembelajaran</h3>
                    <p>Isi</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">🔄</div>
                    <h3>Jadwal Berulang</h3>
                    <p>Isi</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Real-time Update</h3>
                    <p>Isi</p>
                </div>
            </div>
        </div>
    </section>

    <!-- LOOPING BOXES -->
    <section id="team" class="team-section">
        <div class="container">
            <h2>Tim Pengembang</h2>
            <p class="section-subtitle">Dibangun oleh:</p>

            <div class="carousel-wrapper">
                <div class="carousel">
                    <div class="carousel-item">
                        <div class="card-profile">
                            <div class="card-image">
                                <img src="https://via.placeholder.com/250x250/0074a6/ffffff?text=Developer+1" alt="Developer 1" />
                            </div>
                            <h3>Nama</h3>
                            <p>Isi Sendiri</p>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <div class="card-profile">
                            <div class="card-image">
                                <img src="https://via.placeholder.com/250x250/4a90e2/ffffff?text=Developer+2" alt="Developer 2" />
                            </div>
                            <h3>Nama</h3>
                            <p>Isi Sendiri</p>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <div class="card-profile">
                            <div class="card-image">
                                <img src="https://via.placeholder.com/250x250/58bae4/ffffff?text=Developer+3" alt="Developer 3" />
                            </div>
                            <h3>Nama</h3>
                            <p>Isi Sendiri</p>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <div class="card-profile">
                            <div class="card-image">
                                <img src="https://via.placeholder.com/250x250/f4b266/ffffff?text=Developer+4" alt="Developer 4" />
                            </div>
                            <h3>Nama</h3>
                            <p>Isi Sendiri</p>
                        </div>
                    </div>

                    <!-- Clone items untuk Kelihatan looping -->
                    <div class="carousel-item">
                        <div class="card-profile">
                            <div class="card-image">
                                <img src="https://via.placeholder.com/250x250/0074a6/ffffff?text=Developer+1" alt="Developer 1" />
                            </div>
                            <h3>Nama</h3>
                            <p>Isi Sendiri</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ABOUT SECTION -->
    <section id="tentang" class="about-section">
        <div class="container">
            <h2>Tentang Website Kami</h2>
            <div class="about-content">
                <p>
                    Isi
                </p>
                
                <p>
                    Kami percaya bahwa teknologi dapat membuat perbedaan signifikan dalam kehidupan akademik. Itulah mengapa kami terus mengembangkan fitur-fitur baru dan meningkatkan pengalaman pengguna berdasarkan feedback dari komunitas kami.
                </p>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
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
