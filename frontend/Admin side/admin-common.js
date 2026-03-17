const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "admin-login.html";
}

const name = localStorage.getItem("adminName") || "Admin";

const nameElement = document.getElementById("adminName");
if (nameElement) {
  nameElement.innerText = name;
}

const avatarElement = document.getElementById("adminAvatar");
if (avatarElement) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
  avatarElement.innerText = initials;
}