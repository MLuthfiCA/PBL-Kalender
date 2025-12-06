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
                    <div class="icon" aria-hidden="true">
                        <!-- Person SVG (neutral tone) -->
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9V22h19.6v-2.9c0-3.2-6.5-4.9-9.8-4.9z"/>
                        </svg>
                    </div>
                    <h3>Login Mahasiswa</h3>
                    <p>Masuk sebagai mahasiswa untuk mengatur jadwal kuliah Anda</p>
                </a>
                <a href="admin_login.php" class="option-card admin-card">
                    <div class="icon" aria-hidden="true">
                        <!-- Shield/lock SVG (neutral tone) -->
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M12 2l7 3v5c0 5.5-3.8 10.7-7 12-3.2-1.3-7-6.5-7-12V5l7-3zM11 12h2v5h-2v-5z"/>
                        </svg>
                    </div>
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
                    <div class="feature-icon" aria-hidden="true">
                        <!-- Calendar SVG -->
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V9h14v9zM7 11h5v5H7v-5z"/>
                        </svg>
                    </div>
                    <h3>Jadwal Kalender</h3>
                    <p>Isi</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon" aria-hidden="true">
                        <!-- Note/Pencil SVG -->
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </div>
                    <h3>Catatan Pembelajaran</h3>
                    <p>Isi</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon" aria-hidden="true">
                        <!-- Repeat/Loop SVG -->
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M7 7h10V4l5 5-5 5v-3H7a5 5 0 0 0 0 10h1v2H7a7 7 0 0 1 0-14zM17 17H7v3l-5-5 5-5v3h10a5 5 0 0 1 0 10h-1v-2h1a3 3 0 0 0 0-6z"/>
                        </svg>
                    </div>
                    <h3>Jadwal Berulang</h3>
                    <p>Isi</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon" aria-hidden="true">
                        <!-- Lightning/Realtime SVG -->
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
                        </svg>
                    </div>
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
