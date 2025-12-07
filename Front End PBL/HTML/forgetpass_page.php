<?php
include '../PHP/database.php';
session_start();

// untuk nampilin pesan
$message = '';

if (isset($_SESSION['pass_change_message'])) {
    $msg_data = $_SESSION['pass_change_message'];
    $color = ($msg_data['type'] == 'success') ? 'green' : 'red';
    $message = '<p style="color:' . $color . '; text-align:center;">' . $msg_data['text'] . '</p>';
    unset($_SESSION['pass_change_message']);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['change_password'])) {
    $nama = $_POST['nama'];
    $old_password = $_POST['password_lama'];
    $new_password = $_POST['password_baru'];

    if (empty($nama) || empty($old_password) || empty($new_password)) {
        $_SESSION['pass_change_message'] = ['type' => 'error', 'text' => 'Harap isi semua kolom!'];
        header("Location: forgetpass_page.php");
        exit();
    }
    
    

    $query_check = "SELECT mahasiswa_id FROM user WHERE nama = ? AND password = ?";
    $stmt_check = $db->prepare($query_check);
    
    if ($stmt_check) {
        $stmt_check->bind_param("ss", $nama, $old_password); 
        $stmt_check->execute();
        $result = $stmt_check->get_result();

        if ($result->num_rows > 0) {
            
            // update password baru
            $query_update = "UPDATE user SET password = ? WHERE nama = ?";
            $stmt_update = $db->prepare($query_update);

            if ($stmt_update) {
                $stmt_update->bind_param("ss", $new_password, $nama); 
                
                if ($stmt_update->execute()) {
                    // notif password berhasil diubah
                    $_SESSION['pass_change_message'] = ['type' => 'success', 'text' => "Password untuk akun '$nama' telah diubah!"];
                    header("Location: login_page.php"); // pindah ke login
                    exit();
                } else {
                    // kalau ada error
                    $_SESSION['pass_change_message'] = ['type' => 'error', 'text' => "Terjadi kesalahan saat mengubah password. Coba lagi."];
                    header("Location: forgetpass_page.php");
                    exit();
                }
                $stmt_update->close();
            } else {
                $_SESSION['pass_change_message'] = ['type' => 'error', 'text' => "Gagal menyiapkan query update."];
                header("Location: forgetpass_page.php");
                exit();
            }
        } else {
            // notif password lama atau nama salah
            $_SESSION['pass_change_message'] = ['type' => 'error', 'text' => "Nama atau password lama tidak ditemukan!"];
            header("Location: forgetpass_page.php");
            exit();
        }
        $stmt_check->close();
    } else {
        $_SESSION['pass_change_message'] = ['type' => 'error', 'text' => "Gagal menyiapkan query pengecekan."];
        header("Location: forgetpass_page.php");
        exit();
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

        <?php echo $message; ?>

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
</body>
</html>