<?php
    include("../PHP/database.php"); 
    session_start();

    if (isset($_SESSION['is_login'])) {
        header('location: home_page.php');
        exit();
    }
    
    $register_message = '';
    
    if(isset($_POST["register"])) {
        $nama = $_POST['nama'];
        $password = $_POST['password'];
        $email = $_POST['email'];

        if (empty($nama) || empty($password) || empty($email)) {
             $register_message = '<p style="color:red; text-align:center;">Semua field wajib diisi!</p>';
        } else {
            $sql = "INSERT INTO user (nama, password, email) VALUES (?, ?, ?)";
            
            $stmt = $db->prepare($sql);
            
            if ($stmt) {
                $stmt->bind_param("sss", $nama, $password, $email);
                
                if ($stmt->execute()) {
                    // notif berhasil buat akun
                    $_SESSION['register_success'] = "Pembuatan akun berhasil! Silakan login.";
                    // langsung pindah halaman
                    header('location: login_page.php');
                    exit(); 
                } else {
                    $register_message = '<p style="color:red; text-align:center;">Registrasi gagal. Error database: ' . $stmt->error . '</p>';
                }
                $stmt->close();
            } else {
                $register_message = '<p style="color:red; text-align:center;">Gagal menyiapkan query: Cek nama kolom Anda!</p>';
            }
        }
    }
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halaman Registrasi</title>
    <link rel="stylesheet" href="../CSS/register.css">
</head>

<body>

    <form action="register_page.php" method="post">
        <img src="../mentahan_profil-removebg-preview.png" alt="logo" width="100" length="100">
        <h3 style="text-align: center; color:#000000">BUAT AKUN</h3>
        
        <?php echo $register_message; ?>

        <label style="color:#000000" for="nama">Nama lengkap</label>
        <input type="text" id="nama" class="input-field" name="nama" placeholder="masukkan nama lengkap anda" required>

        <label style="color:#000000" for="password">password</label>
        <input type="password" id="password" class="input-field" name="password" placeholder="masukkan password"
            required>

        <label style="color:#000000" for="email">Email</label>
        <input type="email" id="email" class="input-field" name="email" placeholder="masukkan email" required>

        <a href="login_page.php">KEMBALI</a>


        <button type="submit" name="register">Register</button>
    </form>
</body>

</html>