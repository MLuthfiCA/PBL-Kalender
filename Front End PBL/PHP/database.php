<?php

$hostname = "localhost";
$nama = "root";
$password = "";
$database_name = "jadwal_pribadi";

$db =  mysqli_connect($hostname, $nama, $password, $database_name);

if($db->connect_error) {
    echo "koneksi database rusak";
    die("error");
}
?>