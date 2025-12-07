<?php
    include '../PHP/database.php';
    session_start();

    $login_message = '';

    
    // motif error login
    if (isset($_SESSION['login_error'])) {
        $login_message = '<p style="color:red; text-align:center;">' . $_SESSION['login_error'] . '</p>';
        unset($_SESSION['login_error']); 
    }

    // kalau dah login ngak perlu ke halaman login
    if (isset($_SESSION['is_login']) && $_SESSION['is_login'] === true) {
        header('location: akun.php');
        exit();
    }

    // tombol login
    if(isset($_POST["login"])) {

        $nama = $db->real_escape_string($_POST['nama']);
        $password = $db->real_escape_string($_POST['password']);

        $sql = "SELECT admin_id, nama FROM admins WHERE nama='$nama' AND password='$password'";
        $result = $db->query($sql);

        if($result->num_rows > 0) {
            $data = $result->fetch_assoc();
            
            // sesi login
            $_SESSION["admin_id"] = $data["admin_id"];
            $_SESSION["nama"] = $data["nama"];
            $_SESSION["is_login"] = true;

            header("location: akun.php");
            exit(); 
        } else {
            $_SESSION['login_error'] = "Nama pengguna atau kata sandi salah.";
            header("Location: admin_login.php");
            exit();
        }
    }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halaman Login</title>
    <link rel="stylesheet" href="../CSS/admin.css">
</head>

<body>

    <form action="admin_login.php" method="post">
        <img src="../mentahan_profil-removebg-preview.png" alt="logo" width="100">
        <h3 style="text-align: center; color:#000000">MASUK</h3>
        
        <?php echo $login_message; ?>

        <label style="color:#000000" for="nama">Nama Akun</label>
        <input type="text" id="nama" class="input-field" name="nama" placeholder="masukkan nama akun anda" required>

        <label style="color:#000000" for="password">Kata Sandi</label>
        <input type="password" id="password" class="input-field" name="password" placeholder="masukkan kata sandi" required>

        <button type="submit" name="login">Login</button>
    </form>

    <div class="back-dashboard">
        <a href="index.php" class="btn-back">← Kembali ke Dashboard</a>
    </div>

</body>
</html>
