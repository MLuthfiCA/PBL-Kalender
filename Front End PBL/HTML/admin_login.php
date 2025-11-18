<?php
include '../PHP/database.php';
session_start();

if (isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
    header('Location: admin_homepage.php');
    exit();
}

if (isset($_POST["login_admin"])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM admin WHERE username='$username' AND password='$password'";
    $result = $db->query($sql);

    if ($result && $result->num_rows > 0) {
        $data = $result->fetch_assoc();
        $_SESSION["admin_name"] = $data["username"];
        $_SESSION["is_admin"] = true;

        echo "<script>
                alert('Login admin berhasil!');
                setTimeout(() => {
                    window.location.href='admin_homepage.php';
                }, 200);
              </script>";
        exit();
    } else {
        echo "<script>
                alert('Username atau password admin salah!');
                window.history.back();
              </script>";
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login Admin</title>
  <link rel="stylesheet" href="../CSS/login.css" />
</head>
<body>
  <form action="admin_login.php" method="post">
    <img src="../mentahan_profil-removebg-preview.png" alt="logo" width="100">
    <h3 style="text-align: center; color:#000000">LOGIN ADMIN</h3>

    <label for="username" style="color:#000000">Username Admin</label>
    <input type="text" id="username" name="username" placeholder="Masukkan username admin" required>

    <label for="password" style="color:#000000">Password</label>
    <input type="password" id="password" name="password" placeholder="Masukkan password" required>

    <button type="submit" name="login_admin">Login Admin</button>
    <a href="login_page.php" style="display:block; text-align:left; margin-top:10px;">Kembali ke Login User</a>
  </form>
</body>
</html>
