function loginUser() {
  const nama = document.getElementById("nama").value.trim();
  const password = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.nama === nama && u.password === password);

  if (!user) {
    alert("Nama akun atau password salah!");
    return;
  }

  if (!user.active) {
    alert("Akun ini dinonaktifkan. Hubungi admin atau aktifkan kembali di halaman akun.");
    return;
  }

  alert("Login berhasil!");
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  window.location.href = "home_page.html"; // halaman setelah login
}

// back button ke dashboard
document.querySelector(".btn-back")?.addEventListener("click", () => {
    console.log("Kembali ke dashboard...");
});
