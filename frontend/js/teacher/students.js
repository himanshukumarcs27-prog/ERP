const API_BASE = "http://localhost:5000/api";

// 🔐 Token (login ke baad save kiya hoga)
const token = localStorage.getItem("token");

// ================= LOAD CLASSES =================
async function loadClasses() {
  try {
    const res = await fetch(`${API_BASE}/classes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    const classSelect = document.getElementById("classSelect");

    data.forEach(cls => {
      const option = document.createElement("option");
      option.value = cls.id;
      option.textContent = cls.name;
      classSelect.appendChild(option);
    });

  } catch (err) {
    console.error("Error loading classes:", err);
  }
}

// ================= LOAD SUBJECTS =================
async function loadSubjects() {
  const classId = document.getElementById("classSelect").value;

  if (!classId) return;

  try {
    const res = await fetch(`${API_BASE}/subjects/class/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const subjects = await res.json();

    const subjectSelect = document.getElementById("subjectSelect");
    subjectSelect.innerHTML = `<option value="">Select Subject</option>`;

    subjects.forEach(sub => {
      const option = document.createElement("option");
      option.value = sub.id;
      option.textContent = sub.name;
      subjectSelect.appendChild(option);
    });

  } catch (err) {
    console.error("Error loading subjects:", err);
  }
}

// ================= LOAD STUDENTS =================
async function loadStudents() {
  const classId = document.getElementById("classSelect").value;

  if (!classId) return;

  try {
    const res = await fetch(`${API_BASE}/students?class_id=${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const students = await res.json();

    const table = document.getElementById("studentsTable");
    table.innerHTML = "";

    students.forEach(student => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.name}</td>
        <td>
          <input 
            type="number" 
            min="0" 
            max="100" 
            class="marks-input"
            data-student-id="${student.id}"
          />
        </td>
      `;

      table.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading students:", err);
  }
}

// ================= SUBMIT MARKS =================
async function submitMarks() {
  const subjectId = document.getElementById("subjectSelect").value;

  if (!subjectId) {
    alert("Please select subject");
    return;
  }

  const inputs = document.querySelectorAll(".marks-input");

  let promises = [];

  inputs.forEach(input => {
    const studentId = input.dataset.studentId;
    const marks = input.value;

    if (!marks) return;

    const payload = {
      student_id: studentId,
      subject_id: subjectId,
      marks: Number(marks),
      exam_type: "midterm" // change later if needed
    };

    promises.push(
      fetch(`${API_BASE}/marks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
    );
  });

  try {
    await Promise.all(promises);

    alert("✅ Marks submitted successfully");

  } catch (err) {
    console.error("Error submitting marks:", err);
    alert("❌ Failed to submit marks");
  }
}

// ================= INIT =================
window.onload = () => {
  loadClasses();
};