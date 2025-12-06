<?php
session_start();
include 'database.php'; 

header('Content-Type: application/json');

if (!isset($_SESSION["mahasiswa_id"])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Akses ditolak. Silakan login lagi."]);
    exit();
}

$mahasiswa_id = $_SESSION["mahasiswa_id"];

$input_json = file_get_contents('php://input');
$data = json_decode($input_json, true) ?? []; 

$action = $data['action'] ?? $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    
    case 'get_events':
        $sql = "SELECT jadwal_id, nama_matkul, dosen, tanggal, 
                        TIME_FORMAT(waktu_mulai, '%H:%i') AS waktu_mulai, 
                        TIME_FORMAT(waktu_selesai, '%H:%i') AS waktu_selesai, 
                        ruangan, repeat_id 
                FROM jadwal_kuliah 
                WHERE mahasiswa_id = ?";
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param("i", $mahasiswa_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $events = [];
        while ($row = $result->fetch_assoc()) {
            $row['time'] = $row['waktu_mulai'] . ' - ' . $row['waktu_selesai']; 
            $events[] = [
                'id' => $row['jadwal_id'],
                'title' => $row['nama_matkul'],
                'dosen' => $row['dosen'],
                'date' => $row['tanggal'],
                'time' => $row['time'],
                'room' => $row['ruangan'],
                'repeatId' => $row['repeat_id']
            ];
        }
        
        echo json_encode($events);
        $stmt->close();
        break;

    // perulangan jadwal mingguan
    case 'save_event':
        $matkul = $data['title'] ?? '';
        $dosen = $data['dosen'] ?? '';
        $date = $data['date'] ?? '';
        $time_range = $data['time'] ?? '';
        $room = $data['room'] ?? '';
        $repeat_weekly = $data['repeatWeekly'] ?? false;
        
        // Validasi input
        if (empty($matkul) || empty($date) || empty($time_range)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data Matkul, Tanggal, atau Waktu tidak lengkap."]);
            break;
        }

        [$waktu_mulai, $waktu_selesai] = explode(' - ', $time_range);

        // Buat repeat_id jika berulang
        $repeat_id = $repeat_weekly ? 'R' . time() . $mahasiswa_id : null;

        // Simpan jadwal utama dulu
        $sql = "INSERT INTO jadwal_kuliah 
                (mahasiswa_id, nama_matkul, dosen, tanggal, waktu_mulai, waktu_selesai, ruangan, repeat_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);

        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gagal menyiapkan query utama: " . $db->error]);
            break;
        }

        $stmt->bind_param("isssssss", $mahasiswa_id, $matkul, $dosen, $date, $waktu_mulai, $waktu_selesai, $room, $repeat_id);
        $success = $stmt->execute();

        if (!$success) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan jadwal pertama: " . $stmt->error]);
            $stmt->close();
            break;
        }

        // Kalau berulang, buat 12 minggu ke depan
        if ($repeat_weekly) {
            $tanggal_awal = new DateTime($date);

            for ($i = 1; $i <= 12; $i++) {
                $tanggal_awal->modify('+7 days');
                $next_date = $tanggal_awal->format('Y-m-d');

                $stmt2 = $db->prepare($sql);
                if ($stmt2) {
                    $stmt2->bind_param("isssssss", $mahasiswa_id, $matkul, $dosen, $next_date, $waktu_mulai, $waktu_selesai, $room, $repeat_id);
                    $stmt2->execute();
                    $stmt2->close();
                }
            }
        }

        echo json_encode([
            "status" => "success", 
            "message" => $repeat_weekly 
                ? "Jadwal berhasil disimpan dan diulang selama 3 bulan ke depan." 
                : "Jadwal berhasil disimpan.",
            "id" => $db->insert_id
        ]);
        $stmt->close();
        break;

    case 'delete_event':
        $jadwal_id = $data['id'] ?? 0;
        $repeat_id = $data['repeatId'] ?? null;

        if ($repeat_id !== null) {
            $sql = "DELETE FROM jadwal_kuliah WHERE repeat_id = ? AND mahasiswa_id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("si", $repeat_id, $mahasiswa_id);
            $message = "Semua jadwal berulang berhasil dihapus.";
        } else if ($jadwal_id > 0) {
            $sql = "DELETE FROM jadwal_kuliah WHERE jadwal_id = ? AND mahasiswa_id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("ii", $jadwal_id, $mahasiswa_id);
            $message = "Jadwal berhasil dihapus.";
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID jadwal tidak ditemukan."]);
            break;
        }

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => $message]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gagal menghapus jadwal: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'update_event':
        $jadwal_id = $data['id'] ?? 0;
        $matkul = $data['title'] ?? '';
        $dosen = $data['dosen'] ?? '';
        $time_range = $data['time'] ?? '';
        $room = $data['room'] ?? '';
        $repeat_id = $data['repeatId'] ?? null;
        $repeat_weekly = $data['repeatWeekly'] ?? false;

        if (!$jadwal_id || empty($matkul) || empty($time_range)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID, Nama Matkul, atau Waktu tidak lengkap."]);
            break;
        }

        [$waktu_mulai, $waktu_selesai] = explode(' - ', $time_range);

        // Jika ada repeatId dan checkbox repeat checked, update semua dengan repeat_id yang sama
        if ($repeat_id && $repeat_weekly) {
            $sql = "UPDATE jadwal_kuliah 
                    SET nama_matkul = ?, dosen = ?, waktu_mulai = ?, waktu_selesai = ?, ruangan = ?
                    WHERE repeat_id = ? AND mahasiswa_id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("ssssssi", $matkul, $dosen, $waktu_mulai, $waktu_selesai, $room, $repeat_id, $mahasiswa_id);
            $success = $stmt->execute();
            $message = "Semua jadwal berulang berhasil diubah.";
        } else {
            // Update hanya jadwal yang dipilih
            $sql = "UPDATE jadwal_kuliah 
                    SET nama_matkul = ?, dosen = ?, waktu_mulai = ?, waktu_selesai = ?, ruangan = ?
                    WHERE jadwal_id = ? AND mahasiswa_id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("sssssii", $matkul, $dosen, $waktu_mulai, $waktu_selesai, $room, $jadwal_id, $mahasiswa_id);
            $success = $stmt->execute();
            $message = "Jadwal berhasil diubah.";
        }

        if ($success) {
            echo json_encode(["status" => "success", "message" => $message]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gagal mengubah jadwal: " . $stmt->error]);
        }
        $stmt->close();
        break;
        
        /* ===================== CRUD USER (BARU DITAMBAHKAN) ===================== */

    // ===== READ USERS =====
    case 'get_users':
        $sql = "SELECT id, nama, email, active FROM users ORDER BY id DESC";
        $result = $db->query($sql);

        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        echo json_encode($users);
        break;


    // ===== CREATE USER =====
    case 'create_user':
        $nama = $data['nama'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (!$nama || !$email || !$password) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
            break;
        }

        // Cek email sudah ada atau belum
        $check = $db->prepare("SELECT id FROM users WHERE email = ?");
        $check->bind_param("s", $email);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Email sudah terdaftar"]);
            break;
        }

        $check->close();

        // Insert user baru
        $sql = "INSERT INTO users (nama, email, password, active) VALUES (?, ?, ?, 1)";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("sss", $nama, $email, $password);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Akun berhasil ditambahkan"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menambah akun"]);
        }

        $stmt->close();
        break;


    // ===== UPDATE USER =====
    case 'update_user':
        $id = $data['id'] ?? 0;
        $nama = $data['nama'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (!$id || !$nama || !$email) {
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
            break;
        }

        if ($password == "" || $password == null) {
            // Tidak ganti password
            $sql = "UPDATE users SET nama = ?, email = ? WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("ssi", $nama, $email, $id);
        } else {
            // Ganti password
            $sql = "UPDATE users SET nama = ?, email = ?, password = ? WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("sssi", $nama, $email, $password, $id);
        }

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Akun berhasil diperbarui"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal memperbarui akun"]);
        }

        $stmt->close();
        break;


    // ===== TOGGLE ACTIVE STATUS =====
    case 'toggle_status':
        $id = $data['id'] ?? 0;

        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
            break;
        }

        // Ambil status lama
        $sql = "SELECT active FROM users WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        $newStatus = $result['active'] == 1 ? 0 : 1;

        // Update status baru
        $sql2 = "UPDATE users SET active = ? WHERE id = ?";
        $stmt2 = $db->prepare($sql2);
        $stmt2->bind_param("ii", $newStatus, $id);

        if ($stmt2->execute()) {
            echo json_encode(["status" => "success", "message" => "Status berhasil diubah"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mengubah status"]);
        }

        $stmt->close();
        $stmt2->close();
        break;


    // ===== DELETE USER =====
    case 'delete_user':
        $id = $data['id'] ?? 0;

        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
            break;
        }

        $sql = "DELETE FROM users WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Akun berhasil dihapus"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menghapus akun"]);
        }

        $stmt->close();
        break;


    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Aksi tidak valid atau tidak dikenal."]);
        break;
}

$db->close();
?>
