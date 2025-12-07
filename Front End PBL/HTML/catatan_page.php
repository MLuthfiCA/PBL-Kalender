<?php
session_start();
include '../PHP/database.php'; 

if (!isset($_SESSION["mahasiswa_id"])) {
    header("Location: login.php");
    exit();
}

$mahasiswa_id = $_SESSION["mahasiswa_id"];

// hapus catatan
if (isset($_POST['hapus_id'])) {
    $id_hapus = mysqli_real_escape_string($db, $_POST['hapus_id']);
    
    // mastiin catatan punya user yang login
    $sql_hapus = "DELETE FROM catatan_pribadi 
                  WHERE id = '$id_hapus' AND mahasiswa_id = '$mahasiswa_id'";
    
    mysqli_query($db, $sql_hapus);

    header("Location: Catatan_page.php");
    exit();
}

// logika simpan atau edit catatan
if (isset($_POST['simpan_catatan']) || isset($_POST['edit_catatan'])) {
    $isi = mysqli_real_escape_string($db, $_POST['catatan']);
    $tanggal = date("Y-m-d"); 
    
    if (isset($_POST['catatan_id']) && !empty($_POST['catatan_id'])) {
        // logika edit
        $catatan_id = mysqli_real_escape_string($db, $_POST['catatan_id']);
        
        $sql_update = "UPDATE catatan_pribadi 
                       SET isi = '$isi', tanggal = '$tanggal' 
                       WHERE id = '$catatan_id' AND mahasiswa_id = '$mahasiswa_id'";
                       
        mysqli_query($db, $sql_update);
        
    } elseif (isset($_POST['simpan_catatan']) && !empty($isi)) {
        // logika simpan yang baru
        $sql_insert = "INSERT INTO catatan_pribadi (mahasiswa_id, tanggal, isi) 
                       VALUES ('$mahasiswa_id', '$tanggal', '$isi')";
        
        mysqli_query($db, $sql_insert);
    }
    
    header("Location: Catatan_page.php");
    exit();
}


$sql = "SELECT id, tanggal, isi 
        FROM catatan_pribadi 
        WHERE mahasiswa_id = '$mahasiswa_id'
        ORDER BY id DESC";
$result = mysqli_query($db, $sql);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catatan Pribadi</title>
    <link rel="stylesheet" href="../CSS/catatan.css">
</head>

<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="home_page.php" class="nav-logo">
                <img src="../logo login.png" class="logo" height="60px" width="60px" />
            </a>

            <ul class="nav-links">
                <li><a href="home_page.php">Kembali</a></li>
            </ul>
        </div>
    </nav>

    <div class="content">
        <h2>Catatan Hari Ini</h2>

        <form action="Catatan_page.php" method="post" class="note-form">
            <textarea name="catatan" placeholder="Tulis catatan Anda di sini..." required></textarea>
            <button type="submit" name="simpan_catatan">Simpan Catatan Baru</button>
        </form>

        <div class="riwayat-container">
            <h3>Riwayat Catatan Anda</h3>

            <table class="riwayat-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Tanggal</th>
                        <th>Catatan</th>
                        <th class="aksi-kolom">Aksi</th> 
                    </tr>
                </thead>
                <tbody>
                    <?php
                    if ($result && mysqli_num_rows($result) > 0) {
                        $no = 1;
                        while ($row = mysqli_fetch_assoc($result)) {
                            $isi_catatan_js = htmlspecialchars(json_encode($row['isi']), ENT_QUOTES, 'UTF-8');
                            
                            echo "
                                <tr data-id='{$row['id']}'>
                                    <td data-label='No'>{$no}</td>
                                    <td data-label='Tanggal'>{$row['tanggal']}</td>
                                    <td data-label='Catatan'>" . nl2br(htmlspecialchars($row['isi'])) . "</td>
                                    <td data-label='Aksi' class='aksi-kolom'>
                                        <button type='button' class='edit-btn' 
                                            onclick='openEditModal({$row['id']}, \"{$row['tanggal']}\", {$isi_catatan_js})'>
                                            Edit
                                        </button>
                                        
                                        <form method='POST' action='Catatan_page.php' style='display:inline;' onsubmit='return confirm(\"Yakin ingin menghapus catatan ini?\");'>
                                            <input type='hidden' name='hapus_id' value='{$row['id']}'>
                                            <button type='submit' class='hapus-btn'>Hapus</button>
                                        </form>
                                    </td>
                                </tr>
                            ";
                            $no++;
                        }
                    } else {
                        echo '
                        <tr>
                            <td colspan="4" style="text-align:center;">Belum ada catatan.</td>
                        </tr>
                        ';
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>
    
    <div id="editModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closeEditModal()">&times;</span>
            <h3>Edit Catatan</h3>
            <form action="Catatan_page.php" method="post" id="editForm">
                <input type="hidden" name="catatan_id" id="editCatatanId">
                
                <label for="editTanggal">Tanggal:</label>
                <input type="text" id="editTanggal" readonly>
                
                <label for="editCatatan">Isi Catatan:</label>
                <textarea name="catatan" id="editCatatan" required></textarea>
                
                <button type="submit" name="edit_catatan" class="btn-update">Perbarui Catatan</button>
            </form>
        </div>
    </div>
    <script src="../JS/catatan.js"></script>
</body>
</html>