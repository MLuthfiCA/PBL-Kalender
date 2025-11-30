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

// 1. Ambil Data Input (Prioritas JSON Body, lalu GET/POST biasa)
$input_json = file_get_contents('php://input');
$data = json_decode($input_json, true) ?? []; 

// 2. Tentukan Aksi dari berbagai sumber
// Cek JSON Body, lalu POST, lalu GET
$action = $data['action'] ?? $_POST['action'] ?? $_GET['action'] ?? '';


// logika crud
switch ($action) {
    
    case 'get_events':
        // Logika GET EVENTS (tetap menggunakan $_GET['action'])
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

    // nyimpan jadwal baru
    case 'save_event':
        // AMBIL DATA DARI $data (JSON BODY)
        $matkul = $data['title'] ?? '';
        $dosen = $data['dosen'] ?? '';
        $date = $data['date'] ?? '';
        $time_range = $data['time'] ?? '';
        $room = $data['room'] ?? '';
        $repeat_weekly = $data['repeatWeekly'] ?? false; // Ambil checkbox repeat
        
        // UNTUK PENGULANGAN MINGGUAN, BUAT repeat_id JIKA BELUM ADA
        $repeat_id = null;
        if ($repeat_weekly) {
            // Logika sederhana: buat ID unik dari timestamp dan ID Mahasiswa
            $repeat_id = 'R' . time() . $mahasiswa_id; 
        }

        // validasi input
        if (empty($matkul) || empty($date) || empty($time_range)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data Matkul, Tanggal, atau Waktu tidak lengkap."]);
            break;
        }

        [$waktu_mulai, $waktu_selesai] = explode(' - ', $time_range);

        $sql = "INSERT INTO jadwal_kuliah (mahasiswa_id, nama_matkul, dosen, tanggal, waktu_mulai, waktu_selesai, ruangan, repeat_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $db->prepare($sql);
        // Perbaiki binding parameter agar sesuai dengan urutan
        $stmt->bind_param("isssssss", $mahasiswa_id, $matkul, $dosen, $date, $waktu_mulai, $waktu_selesai, $room, $repeat_id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Jadwal berhasil disimpan.", "id" => $db->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan jadwal: " . $stmt->error]);
        }
        $stmt->close();
        break;

    // hapus jadwal
    case 'delete_event':
        // AMBIL DATA DARI $data (JSON BODY)
        $jadwal_id = $data['id'] ?? 0;
        $repeat_id = $data['repeatId'] ?? null;
        
        // Cek apakah ini permintaan hapus berulang atau tunggal
        if ($repeat_id !== null) {
            // Hapus semua event berulang
            $sql = "DELETE FROM jadwal_kuliah WHERE repeat_id = ? AND mahasiswa_id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("si", $repeat_id, $mahasiswa_id);
            $message = "Semua jadwal berulang berhasil dihapus.";
        } else if ($jadwal_id > 0) {
            // Hapus jadwal tunggal (seperti yang dilakukan di modal)
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

    
    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Aksi tidak valid atau tidak dikenal."]);
        break;
}

$db->close();
?>