const API =
window.location.hostname.includes("localhost")
  ? "http://localhost:5000/api"
  : "https://erp-ten-pied.vercel.app/api";

async function loadProfile() {
  const res = await fetch(API);
  const user = await res.json();

  document.getElementById("name").innerText = user.name;
  document.getElementById("email").innerText = user.email;
}

loadProfile();