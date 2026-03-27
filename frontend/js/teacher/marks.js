// ========================== CONFIG ==========================
const BASE_URL = "http://localhost:5000/api";

const STUDENT_API = `${BASE_URL}/students`;
const SUBJECT_API = `${BASE_URL}/subjects`;
const ADD_MARKS_API = `${BASE_URL}/marks/add`;
const GET_MARKS_API = `${BASE_URL}/marks`;

let students = [];
let subjects = [];

// ========================== INIT ==========================
async function init() {
  const token = localStorage.getItem("token");

  try {
    // Fetch Students
    const sRes = await fetch(STUDENT_API, {
      headers: { Authorization: `Bearer ${token}` }
    });
    students = await sRes.json();

    // Fetch Subjects
    const subRes = await fetch(SUBJECT_API, {
      headers: { Authorization: `Bearer ${token}` }
    });
    subjects = await subRes.json();

    loadDropdowns();

  } catch (err) {
    console.error("Init error:", err);
  }
}

// ========================== DROPDOWNS ==========================
function loadDropdowns() {
  const studentSelect = document.getElementById("studentSelect");
  const subjectSelect = document.getElementById("subjectSelect");

  studentSelect.innerHTML = `<option value="">Select Student</option>`;
  subjectSelect.innerHTML = `<option value="">Select Subject</option>`;

  students.forEach(s => {
    studentSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
  });

  subjects.forEach(sub => {
    subjectSelect.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
  });
}

// ========================== SUBMIT MARKS ==========================
async function submitMarks() {
  const token = localStorage.getItem("token");

  const student_id = document.getElementById("studentSelect").value;
  const subject_id = document.getElementById("subjectSelect").value;
  const marks = document.getElementById("marks").value;

  if (!student_id || !subject_id || !marks) {
    alert("⚠️ Please fill all fields");
    return;
  }

  try {
    const res = await fetch(ADD_MARKS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        student_id,
        subject_id,
        marks: Number(marks),
        exam_type: "midterm"
      })
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    alert("✅ Marks saved successfully!");

    // 🔥 Refresh table instantly
    fetchMarks();

  } catch (err) {
    console.error("Error saving marks:", err);
    alert("❌ Failed to save marks");
  }
}

// ========================== FETCH MARKS ==========================
async function fetchMarks() {
  const token = localStorage.getItem("token");
  const subject_id = document.getElementById("subjectSelect").value;

  if (!subject_id) return;

  try {
    const res = await fetch(
      `${GET_MARKS_API}?subject_id=${subject_id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const result = await res.json();

    const table = document.getElementById("marksTable");
    table.innerHTML = "";

    if (!result.data || result.data.length === 0) {
      table.innerHTML = `<tr><td colspan="4">No data found</td></tr>`;
      return;
    }

    result.data.forEach(m => {
      table.innerHTML += `
        <tr>
          <td>${m.students?.name || "N/A"}</td>
          <td>${m.subjects?.name || "N/A"}</td>
          <td>${m.marks ?? 0}</td>
          <td>${m.grade ? m.grade : "Not Generated"}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error fetching marks:", err);
  }
}
async function generateResult() {
  const token = localStorage.getItem("token");

  const class_id = "PUT_YOUR_CLASS_ID"; // 🔥 replace this

  try {
    const res = await fetch(
      "http://localhost:5000/api/results/generate-class",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ class_id }),
      }
    );

    const data = await res.json();

    alert("✅ Result Generated!");

  } catch (err) {
    console.error(err);
    alert("❌ Error generating result");
  }
}

// ========================== EVENTS ==========================

// 🔥 Auto fetch when subject changes
document.getElementById("subjectSelect")
  .addEventListener("change", fetchMarks);

// ========================== START ==========================
init();