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

$action = $_POST['action'] ?? $_GET['action'] ?? '';


// logika crud
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

    // nyimpan jadwal baru
    case 'save_event':
        $matkul = $_POST['title'] ?? '';
        $dosen = $_POST['dosen'] ?? '';
        $date = $_POST['date'] ?? '';
        $time_range = $_POST['time'] ?? '';
        $room = $_POST['room'] ?? '';
        $repeat_id = $_POST['repeatId'] ?? NULL;

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
        $jadwal_id = $_POST['id'] ?? 0;
        $delete_type = $_POST['delete_type'] ?? 'single'; 
        $repeat_id = $_POST['repeatId'] ?? NULL;

        if ($delete_type === 'all_repeat' && $repeat_id) {
            // hapus semua jadwal
            $sql = "DELETE FROM jadwal_kuliah WHERE repeat_id = ? AND mahasiswa_id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("si", $repeat_id, $mahasiswa_id);
        } else {
            // hapus jadwal tunggal
            $sql = "DELETE FROM jadwal_kuliah WHERE jadwal_id = ? AND mahasiswa_id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("ii", $jadwal_id, $mahasiswa_id);
        }

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Jadwal berhasil dihapus."]);
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