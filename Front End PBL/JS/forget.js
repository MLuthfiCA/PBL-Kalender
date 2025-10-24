function changePassword() {
  const oldPass = document.getElementById("Password lama").value.trim();
  const newPass = document.getElementById("Password baru").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedUser) {
    alert("Anda belum login! Silakan login dulu.");
    return;
  }

  const userIndex = users.findIndex(u => u.email === loggedUser.email);

  if (userIndex === -1) {
    alert("Akun tidak ditemukan!");
    return;
  }

  if (users[userIndex].password !== oldPass) {
    alert("Password lama salah!");
    return;
  }

  users[userIndex].password = newPass;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Password berhasil diubah!");

  window.location.href = "login_page.html";
}
