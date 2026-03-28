const BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000/api"
  : "https://erp-ten-pied.vercel.app/api";

async function updateDashboard() {
  console.log("Dashboard running...");

  const token = localStorage.getItem("token");

  // ✅ Token check
  if (!token) {
    alert("Please login first");
    window.location.href = "../login.html";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // 🔥 Unauthorized handle
    if (res.status === 401) {
      localStorage.clear();
      window.location.href = "../login.html";
      return;
    }

    const result = await res.json();
    console.log("API DATA:", result);

    const user = result.user || result;

    // ================= UI UPDATE =================

    const studentName = user.name || "Student";

    // Header name
    const headerEl = document.getElementById("header-student-name");
    if (headerEl) headerEl.innerText = studentName;

    // Welcome name
    const welcomeEl = document.getElementById("welcome-name");
    if (welcomeEl) welcomeEl.innerText = studentName.split(" ")[0];

    // Profile image
    const profileEl = document.getElementById("profile-pic");
    if (profileEl) {
      profileEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=0D8ABC&color=fff`;
    }

    // GPA update
    if (user.gpa) {
      const gpaEl = document.querySelector(".gpa-value");
      if (gpaEl) gpaEl.innerText = user.gpa;
    }

    // Course
    if (user.course) {
      const courseEl = document.getElementById("course");
      if (courseEl) courseEl.innerText = user.course;
    }

    // Semester
    if (user.semester) {
      const semEl = document.getElementById("semester");
      if (semEl) semEl.innerText = user.semester;
    }

    console.log("✅ Dashboard updated successfully");

  } catch (err) {
    console.error("❌ Dashboard Error:", err.message);
    alert("Error loading dashboard");
  }
}

// 🚀 Run on load
document.addEventListener("DOMContentLoaded", updateDashboard);