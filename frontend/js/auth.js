const BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000/api"
  : "https://erp-ten-pied.vercel.app/api";

// ================== 🔐 LOGIN ==================
async function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const selectedRole = localStorage.getItem("selectedRole");

  if (!email || !password) {
    return alert("Email and Password required");
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, role: selectedRole })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user?.role);

    redirectUser(data.user?.role);

  } catch (err) {
    console.error("Login Error:", err.message);
    alert(err.message);
  }
}

// ================== 📝 REGISTER ==================
async function register() {
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const role = document.getElementById("role")?.value;

  const roll_no = document.getElementById("roll_no")?.value || "";
  const course = document.getElementById("course")?.value || "";
  const semester = document.getElementById("semester")?.value || "";

  if (!name || !email || !password || !role) {
    return alert("All fields required");
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        roll_no,
        course,
        semester
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    alert("Registered successfully!");
    window.location.href = "login.html";

  } catch (err) {
    console.error("Register Error:", err.message);
    alert(err.message);
  }
}

// ================== 🔐 REDIRECT ==================
function redirectUser(role) {
  if (role === "admin") {
    window.location.href = "../admin/dashboard.html";
  } else if (role === "teacher") {
    window.location.href = "../teacher/dashboard.html";
  } else {
    window.location.href = "../student/dashboard.html";
  }
}

// ================== 🔒 PROTECTED API ==================
async function getProtectedData() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "../login.html";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/students/me`, { // ✅ FIXED
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Unauthorized");
    }

    return data;

  } catch (err) {
    console.error("Protected API Error:", err.message);
    alert(err.message);
  }
}

// ================== 🌍 GLOBAL ==================
window.login = login;
window.register = register;