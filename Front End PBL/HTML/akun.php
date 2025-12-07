<?php
session_start();
if (!isset($_SESSION["nama"])) {
    header("Location: admin_login.php");
    exit();
}

if (isset($_POST["logout"])) {
    session_unset();
    session_destroy();
    header("location: admin_login.php");
    exit();
} 

// JSON
include __DIR__ . "/../PHP/database.php";

$raw = file_get_contents('php://input');
$json = json_decode($raw, true) ?? [];

$action = $_GET['action'] ?? $_POST['action'] ?? $json['action'] ?? null;

if ($action) {
  header('Content-Type: application/json');

  // cuma admin yang bisa kelola user
  if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Akses ditolak. Silakan login sebagai admin.']);
    exit();
  }

  switch ($action) {
    case 'get_users':
      $sql = "SELECT mahasiswa_id AS id, nama, password, email FROM user ORDER BY mahasiswa_id DESC";
      $res = $db->query($sql);
      $users = [];
      if ($res) {
        while ($row = $res->fetch_assoc()) {
          $row['active'] = 1;
          $users[] = $row;
        }
      } else {
        echo json_encode(['status' => 'error', 'message' => 'Query gagal: ' . $db->error]);
        exit();
      }
      echo json_encode($users);
      exit();

    case 'create_user':
      $nama = $json['nama'] ?? $_POST['nama'] ?? '';
      $email = $json['email'] ?? $_POST['email'] ?? '';
      $password = $json['password'] ?? $_POST['password'] ?? '';

      if (!$nama || !$email || !$password) {
        echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap']);
        exit();
      }

      // cek user sudah ada
      $check = $db->prepare("SELECT mahasiswa_id FROM user WHERE email = ?");
      $check->bind_param("s", $email);
      $check->execute();
      $check->store_result();
      if ($check->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email sudah terdaftar']);
        $check->close();
        exit();
      }
      $check->close();
      // masukan user baru ke tabel user
      $stmt = $db->prepare("INSERT INTO user (nama, password, email) VALUES (?, ?, ?)");
      $stmt->bind_param("sss", $nama, $password, $email);
      if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Akun berhasil ditambahkan', 'id' => $db->insert_id]);
      } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menambah akun: ' . $stmt->error]);
      }
      $stmt->close();
      exit();

    case 'update_user':
      $id = $json['id'] ?? $_POST['id'] ?? 0;
      $nama = $json['nama'] ?? $_POST['nama'] ?? '';
      $email = $json['email'] ?? $_POST['email'] ?? '';
      $password = $json['password'] ?? $_POST['password'] ?? '';

      if (!$id || !$nama || !$email) {
        echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap']);
        exit();
      }

      // Update `user` table (mahasiswa_id)
      if ($password === null || $password === '') {
        $stmt = $db->prepare("UPDATE user SET nama = ?, email = ? WHERE mahasiswa_id = ?");
        $stmt->bind_param("ssi", $nama, $email, $id);
      } else {
        $stmt = $db->prepare("UPDATE user SET nama = ?, password = ?, email = ? WHERE mahasiswa_id = ?");
        $stmt->bind_param("sssi", $nama, $password, $email, $id);
      }

      if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Akun berhasil diperbarui']);
      } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui akun']);
      }
      $stmt->close();
      exit();

    case 'delete_user':
      $id = $json['id'] ?? $_POST['id'] ?? 0;
      if (!$id) { echo json_encode(['status'=>'error','message'=>'ID tidak valid']); exit(); }

      $stmt = $db->prepare("DELETE FROM user WHERE mahasiswa_id = ?");
      $stmt->bind_param("i", $id);
      if ($stmt->execute()) echo json_encode(['status'=>'success','message'=>'Akun berhasil dihapus']); else echo json_encode(['status'=>'error','message'=>'Gagal menghapus akun']);
      $stmt->close();
      exit();

    default:
      echo json_encode(['status'=>'error','message'=>'Aksi tidak dikenali']);
      exit();
  }
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Manajemen Akun | POLIPLAN</title>
    <link rel="stylesheet" href="../CSS/akun.css" />
  </head>

  <body>
    <!-- navbar -->
    <nav class="navbar">
      <div class="container">
          <img src="../logo login.png" class="logo">
        </a>
        <div class="search-box">
          <input type="text" id="searchInput" placeholder="Cari akun..." />
          <button id="searchBtn">🔍</button>
        </div>
            <form action="akun.php" method="POST">
              <button type="submit" name="logout" class="logout-btn">Keluar</button>
            </form>
      </div>
    </nav>

    <!-- halaman admin -->
    <section id="admin-panel" class="admin-panel">
      <div class="container">
        <h2>📋 Manajemen Akun Mahasiswa</h2>
        <p class="sub">Kelola data pengguna dan kontrol akses sistem.</p>

        <!-- tambah akun -->
        <div class="admin-form">
          <h3>Tambah Akun Mahasiswa</h3>
          <form id="addStudentForm">
            <input type="text" id="studentName" placeholder="Nama Mahasiswa" required />
            <input type="email" id="studentEmail" placeholder="Email Mahasiswa" required />
            <input type="password" id="studentPassword" placeholder="Password" required />
            <button type="submit">Tambah Akun</button>
          </form>
        </div>

        <!-- daftar akun -->
        <div class="admin-table">
          <h3>Akun Terdaftar</h3>
          <table id="studentTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Password</th>
                <th>Email</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="studentsTableBody">
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <script src="../JS/akun.js"></script>
  </body>
</html>
