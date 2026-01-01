-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql306.byetcluster.com
-- Generation Time: Jan 01, 2026 at 08:04 AM
-- Server version: 11.4.9-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_40688408_jadwal_pribadi`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `nama` varchar(30) NOT NULL,
  `password` varchar(15) NOT NULL,
  `subject_count` int(5) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `nama`, `password`, `subject_count`) VALUES
(1, 'admin1', 'ifbpagi6', 0);

-- --------------------------------------------------------

--
-- Table structure for table `catatan_pribadi`
--

CREATE TABLE `catatan_pribadi` (
  `id` int(11) NOT NULL,
  `mahasiswa_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `isi` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `catatan_pribadi`
--

INSERT INTO `catatan_pribadi` (`id`, `mahasiswa_id`, `tanggal`, `isi`, `created_at`) VALUES
(2, 6, '2025-11-30', 'hari ini ada mengerjakan filter yang rusak, perbaiki css catatan, menambahkan database catatan dan perbaiki css tabel 1 dan 2', '2025-11-30 14:39:51'),
(5, 6, '2025-11-30', 'dsaasdas', '2025-11-30 16:21:30'),
(8, 5, '2025-12-16', 'tugas PBL kelompok 6 IF1B - Pagi', '2025-12-16 15:34:21'),
(11, 17, '2025-12-17', 'Ada tugas PTI, Dasproweb dan Daspro yang belum siap.\r\nTenggat: 20 Desember 2025', '2025-12-17 16:44:56'),
(15, 17, '2025-12-29', 'myk', '2025-12-29 08:47:44');

-- --------------------------------------------------------

--
-- Table structure for table `jadwal_kuliah`
--

CREATE TABLE `jadwal_kuliah` (
  `jadwal_id` int(11) NOT NULL,
  `mahasiswa_id` int(11) NOT NULL,
  `nama_matkul` varchar(150) NOT NULL,
  `dosen` varchar(100) DEFAULT NULL,
  `tanggal` date NOT NULL,
  `waktu_mulai` time DEFAULT NULL,
  `waktu_selesai` time DEFAULT NULL,
  `ruangan` varchar(50) DEFAULT NULL,
  `repeat_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jadwal_kuliah`
--

INSERT INTO `jadwal_kuliah` (`jadwal_id`, `mahasiswa_id`, `nama_matkul`, `dosen`, `tanggal`, `waktu_mulai`, `waktu_selesai`, `ruangan`, `repeat_id`) VALUES
(19, 6, 'pbl', 'dimas', '2025-11-30', '07:00:00', '07:50:00', '123', NULL),
(50, 6, 'mtk', 'pak damar', '2025-12-06', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(51, 6, 'mtk', 'pak damar', '2025-12-13', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(52, 6, 'mtk', 'pak damar', '2025-12-20', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(53, 6, 'mtk', 'pak damar', '2025-12-27', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(54, 6, 'mtk', 'pak damar', '2026-01-03', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(55, 6, 'mtk', 'pak damar', '2026-01-10', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(56, 6, 'mtk', 'pak damar', '2026-01-17', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(57, 6, 'mtk', 'pak damar', '2026-01-24', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(58, 6, 'mtk', 'pak damar', '2026-01-31', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(59, 6, 'mtk', 'pak damar', '2026-02-07', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(60, 6, 'mtk', 'pak damar', '2026-02-14', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(61, 6, 'mtk', 'pak damar', '2026-02-21', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(62, 6, 'mtk', 'pak damar', '2026-02-28', '07:00:00', '07:50:00', '1234', 'R17650358696'),
(63, 6, 'daspr', '123', '2025-12-08', '07:00:00', '07:50:00', '123', NULL),
(69, 17, 'Pengantar Teknologi Informasi', 'Pak Syaprilla', '2025-12-17', '13:40:00', '14:30:00', 'GU 706', NULL),
(130, 27, 'daspro', 'buk cyn', '2025-12-18', '07:00:00', '07:50:00', '701', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `mahasiswa_id` int(11) NOT NULL,
  `nama` char(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `subject_count` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`mahasiswa_id`, `nama`, `password`, `email`, `subject_count`) VALUES
(5, 'dimas', '150906dimas', 'nemocat09@gmail.com', 10),
(6, 'damar', '1234', 'damar@gmail.com', 1211),
(17, 'Dimas Cakra Surya Ananta', '150906Dimas', '3312501049.Dimas@students.polibatam.ac.id', 5),
(20, 'Rafi Sa`Id', '101010', '3312501051.Rafi@students.polibatam.ac.id', 0),
(25, 'rafi123', '123', 'ahmadrafi@gmail.com', 0),
(27, 'dimascakra', '123', 'dimascakra@gmail.com', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `catatan_pribadi`
--
ALTER TABLE `catatan_pribadi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mahasiswa_id` (`mahasiswa_id`);

--
-- Indexes for table `jadwal_kuliah`
--
ALTER TABLE `jadwal_kuliah`
  ADD PRIMARY KEY (`jadwal_id`),
  ADD KEY `mahasiswa_id` (`mahasiswa_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`mahasiswa_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `catatan_pribadi`
--
ALTER TABLE `catatan_pribadi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `jadwal_kuliah`
--
ALTER TABLE `jadwal_kuliah`
  MODIFY `jadwal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `mahasiswa_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `catatan_pribadi`
--
ALTER TABLE `catatan_pribadi`
  ADD CONSTRAINT `catatan_pribadi_ibfk_1` FOREIGN KEY (`mahasiswa_id`) REFERENCES `user` (`mahasiswa_id`);

--
-- Constraints for table `jadwal_kuliah`
--
ALTER TABLE `jadwal_kuliah`
  ADD CONSTRAINT `jadwal_kuliah_ibfk_1` FOREIGN KEY (`mahasiswa_id`) REFERENCES `user` (`mahasiswa_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
