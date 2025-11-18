<?php
    include("../PHP/database.php");
    session_start();

    if (isset($_SESSION['is_login'])) {
        header('location: home_page.php');
    }
    
    if(isset($_POST["register"])) {
        $nama = $_POST['nama'];
        $password = $_POST['password'];
        $email = $_POST['email'];

        try {
            $sql = "INSERT INTO user (nama, password, email) 
        VALUES ('$nama', '$password', '$email')";

        if($db->query($sql)) {
        }else{
        }

        } catch (mysqli_sql_exception $e) {
            
        }
    }
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>formulir dengan css eksternal</title>
    <link rel="stylesheet" href="../CSS/register.css">
</head>

<body>

    <form action="register_page.php" method="post">
        <img src="../mentahan_profil-removebg-preview.png" alt="logo" width="100" length="100">
        <h3  style="text-align: center; color:#000000">BUAT AKUN</h3>
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
    <script src="../JS/register.js"></script>
</body>

</html>
