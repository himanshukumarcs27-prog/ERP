 const BASE_URL=window.location.hostname.includes("localhost")
  ? "http://localhost:5000/api"
  : "https://erp-ten-pied.vercel.app/api";
async function initAdminDashboard() {
    const token = localStorage.getItem('token');
    
    // Check if token exists
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    try {
        const response = await fetch(BASE_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 403) {
            alert("Access Denied: You are not an admin!");
            window.location.href = '../auth/login.html';
        }

        const stats = await response.json();
        // Update stats on the cards here...
        
    } catch (err) {
        console.error("Admin API Error:", err);
    }
}

document.addEventListener('DOMContentLoaded', initAdminDashboard);