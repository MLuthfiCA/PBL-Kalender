function registerUser() {
  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!nama || !email || !password) {
    alert("Semua kolom wajib diisi!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Cegah duplikat email
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    alert("Email sudah terdaftar!");
    return;
  }

  // Simpan akun baru
  const newUser = {
    nama,
    email,
    password,
    active: true
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Akun berhasil dibuat!");
  window.location.href = "login_page.html";
}
