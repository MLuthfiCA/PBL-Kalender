<?php
    include '../PHP/database.php';
    session_start();

    $login_message = '';

    if (isset($_SESSION['is_login'])) {
        header('location: home_page.php');
    }

    if(isset($_POST["login"])) {
        $nama = $_POST['nama'];
        $password = $_POST['password'];

        $sql = "SELECT * FROM user WHERE nama='$nama' AND
        password='$password'";

        $result = $db->query($sql);

        if($result->num_rows > 0) {
            $data = $result->fetch_assoc();
            $_SESSION["nama"] = $data["nama"];
            $_SESSION["is_login"] = true;

            header("location: home_page.php");
        }else{

        }
    }
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>formulir dengan css eksternal</title>
    <link rel="stylesheet" href="../CSS/login.css">
</head>

<body>

    <form action="login_page.php" method="post">
        <img src="../mentahan_profil-removebg-preview.png" alt="logo" width="100">
        <h3 style="text-align: center; color:#000000">MASUK</h3>
        <label style="color:#000000" for="nama">Nama Akun</label>
        <input type="text" id="nama" class="input-field" name="nama" placeholder="masukkan nama akun anda" required>

        <label style="color:#000000" for="password">Kata Sandi</label>
        <input type="password" id="password" class="input-field" name="password" placeholder="masukkan kata sandi"
            required>

        <a href="forgetpass_page.php">LUPA PASSWORD?</a>
        <a href="register_page.php" style="float: right;">REGISTER</a>

        <button type="submit" name="login">Login</button>
    </form>

</body>

</html>
