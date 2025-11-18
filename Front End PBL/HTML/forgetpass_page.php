<?php
include '../PHP/database.php';
session_start();

$alertMessage = "";

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['change_password'])) {
    $nama = $_POST['nama'];
    $old_password = $_POST['password_lama'];
    $new_password = $_POST['password_baru'];

    if (!empty($nama) && !empty($old_password) && !empty($new_password)) {
        $query_check = "SELECT * FROM user WHERE nama = '$nama' AND password = '$old_password'";
        $result = mysqli_query($db, $query_check);

        if (mysqli_num_rows($result) > 0) {
            $query_update = "UPDATE user SET password = '$new_password' WHERE nama = '$nama'";
            if (mysqli_query($db, $query_update)) {
                $alertMessage = "Password untuk akun $nama telah diubah!";
                $redirect = "login_page.php";
            } else {
                $alertMessage = "Terjadi kesalahan saat mengubah password.";
                $redirect = "forgetpass_page.php";
            }
        } else {
            $alertMessage = "Nama atau password lama tidak ditemukan!";
            $redirect = "forgetpass_page.php";
        }
    } else {
        $alertMessage = "Harap isi semua kolom!";
        $redirect = "forgetpass_page.php";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ganti Password</title>
    <link rel="stylesheet" href="../CSS/forget.css">
</head>
<body>
    <form action="forgetpass_page.php" method="post">
        <img src="../mentahan_profil-removebg-preview.png" alt="logo" width="100">
        <h3 style="text-align: center; color:#000000">GANTI PASSWORD</h3>

        <label for="nama" style="color:#000000">Nama Akun</label>
        <input type="text" id="nama" class="input-field" name="nama"
            placeholder="Masukkan nama akun anda" required>

        <label for="password_lama" style="color:#000000">Password Lama</label>
        <input type="password" id="password_lama" class="input-field" name="password_lama"
            placeholder="Masukkan password lama" required>

        <label for="password_baru" style="color:#000000">Password Baru</label>
        <input type="password" id="password_baru" class="input-field" name="password_baru"
            placeholder="Masukkan password baru" required>

            <a href="login_page.php">KEMBALI</a>
            <button type="submit" name="change_password">Ganti Password</button>
    </form>

    <?php if (!empty($alertMessage)) : ?>
    <script>
        window.onload = function() {
            alert("<?= $alertMessage ?>");
            window.location.href = "<?= $redirect ?>";
        };
    </script>
    <?php endif; ?>
</body>
</html>
