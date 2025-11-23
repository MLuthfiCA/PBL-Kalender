<?php
session_start();
if (!isset($_SESSION["nama"])) {
    header("Location: login_page.php");
    exit();
}

if (isset($_POST["logout"])) {
    session_unset();
    session_destroy();
    header("location: login_page.php");
    exit();
} 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistem Penjadwalan Kuliah</title>
    <link rel="stylesheet" href="../CSS/home.css" /> 
</head>

<body>
    <nav class="navbar">
        <div class="container">
            <a href="home_page.php">
                <img src="../logo login.png" class="logo" height="90px" width="90px"/>
            </a>
            <ul class="nav-links">
                <li><a href="#home">Beranda</a></li>
                <li><a href="#calendar">Kalender</a></li>
                <li><a href="#tentang">Tentang Kami</a></li>
                <form action="home_page.php" method="POST">
                    <li><button type="submit" name="logout" class="logout-btn">Keluar</button></li>
                </form>
            </ul>
            
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Cari Dosen atau Mata Kuliah..." onkeyup="filterBoxes()" />
                <select id="filterSelect" onchange="filterBoxes()">
                    <option value="">Semua</option>
                    <option value="dosen">Dosen</option>
                    <option value="title">Mata Kuliah</option>
                </select>
                <button id="searchBtn">🔍</button>
            </div>
            </div>
    </nav>
    
    <section id="home" class="hero"></section>
    
    <section class="main-content">
        <h2>Selamat datang <?= htmlspecialchars($_SESSION["nama"]) ?></h2>
        
        <div class="container">
            <div class="features-box">
                <div class="features1">
                    <img src="../GAMBAR_BUKU.jpeg" alt="buku" />
                    <h2>Mata Kuliah
                        <button id="addSubjectBtn" class="add-btn">+</button>
                    </h2>
                    <p>Total: <span id="subjectCount">0</span> Mata Kuliah</p>
                </div>
                <div class="features2">
                    <img src="../GAMBAR_JAM.jpeg" alt="jam" />
                    <h2>Tugas Pending</h2>
                    <p><span id="pendingCount">0</span> Tugas Minggu Ini</p>
                </div>
                <div class="features3">
                    <img src="../GAMBAR_KALENDER.jpeg" alt="kalender" />
                    <h2>Aktivitas</h2>
                    <p><span id="activityCount">0</span> Jadwal Minggu Ini</p>
                </div>
            </div>
            
            <div class="features-box1">
                <div class="box1">
                    <div class="kotak-aktivitas skroll">
                        <div id="activityList">
                            </div>
                    </div>
                </div>
                <div class="box2">
                    <div class="kotak-jadwal skroll">
                        <div id="todaySchedule">
                            </div>
                    </div>
                </div>
            </div>
        </div> 

        <div class="calendar-box">
            <h1>Kalender Perkuliahan</h1>
            <div id="container">
                <div id="header">
                    <div id="monthDisplay"></div>
                    <div>
                        <button id="backButton">Back</button>
                        <button id="nextButton">Next</button>
                    </div>
                </div>

                <div id="weekdays">
                    <div>Min</div>
                    <div>Sen</div>
                    <div>Sel</div>
                    <div>Rab</div>
                    <div>Kam</div>
                    <div>Jum</div>
                    <div>Sab</div>
                </div>

                <div id="calendar">
                    </div>
            </div>
        </div>

        <div id="newEventModal">
            <h2>Tambah Jadwal</h2>
            <input id="eventTitleInput" placeholder="Nama Mata Kuliah" />

            <label for="eventDosenInput">Dosen:</label>
            <input id="eventDosenInput" placeholder="Nama Dosen" />
            
            <label for="eventTime">Waktu:</label>
            <select id="eventTime">
                <option value="07:00 - 07:50">07:00 - 07:50</option>
                <option value="07:50 - 08:40">07:50 - 08:40</option>
                <option value="08:40 - 09:30">08:40 - 09:30</option>
                <option value="09:30 - 10:20">09:30 - 10:20</option>
                <option value="10:20 - 11:10">10:20 - 11:10</option>
                <option value="11:10 - 12:00">11:10 - 12:00</option>
                <option value="12:00 - 12:50">12:00 - 12:50</option>
                <option value="12:50 - 13:40">12:50 - 13:40</option>
                <option value="13:40 - 14:30">13:40 - 14:30</option>
                <option value="14:30 - 15:20">14:30 - 15:20</option>
                <option value="15:20 - 16:10">15:20 - 16:10</option>
                <option value="16:10 - 17:00">16:10 - 17:00</option>
                <option value="17:10 - 18:00">17:10 - 18:00</option>
                <option value="18:00 - 18:50">18:00 - 18:50</option>
                <option value="18:50 - 19:40">18:50 - 19:40</option>
                <option value="19:40 - 20:30">19:40 - 20:30</option>
                <option value="20:30 - 21:20">20:30 - 21:20</option>
                <option value="21:20 - 22:10">21:20 - 22:10</option>
                <option value="22:10 - 23:00">22:10 - 23:00</option>
            </select>

            <label for="eventRoom">Ruangan:</label>
            <input id="eventRoom" placeholder="Masukkan ruangan" />
            
            <label for="eventNotes">Catatan Tambahan (Opsional):</label>
            <textarea id="eventNotes" placeholder="Tambahkan catatan khusus untuk jadwal ini..."></textarea>
            <label for="repeatWeekly">
                <input type="checkbox" id="repeatWeekly" /> Ulangi setiap minggu
            </label>
            
            <div class="button-row">
                <button id="saveButton">Simpan</button>
                <button id="cancelButton">Batal</button>
            </div>
        </div>

        <div id="deleteEventModal">
            <h2>Jadwal</h2>
            <p id="eventText"></p>
            <button id="deleteButton">Hapus</button>
            <button id="closeButton">Tutup</button>
        </div>

        <div id="modalBackDrop"></div>
    </section>
    
    <section id="tentang" class="about">
        <div class="container">
            <h2>Tentang Kami</h2>
            <p class="tebal-jelas">
                Website ini merupakan platform yang dirancang khusus untuk membantu
                mahasiswa dalam mengelola dan memantau jadwal perkuliahan pribadi.
                Melalui website ini, mahasiswa dapat melihat, menambahkan, serta
                mengatur jadwal kegiatan akademik secara terstruktur dan efisien.
            </p>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 All rights reserved.</p>
            <ul class="social-link">
                <li><a href="https://www.facebook.com/damarrwn.damarrwn">Facebook</a></li>
                <li><a href="https://x.com/WidhiDamar99089">Twitter</a></li>
                <li><a href="https://www.instagram.com/dam_dim_dum_dom/">Instagram</a></li>
                <li><a href="https://mail.google.com/mail/u/0/#inbox?compose=new">Gmail</a></li>
            </ul>
        </div>
    </footer>
    
    <script src="../JS/home.js"></script>
</body>
</html>
