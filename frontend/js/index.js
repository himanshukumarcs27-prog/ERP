document.addEventListener("DOMContentLoaded", () => {
  const roleCards = document.querySelectorAll(".role-card");

  roleCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Get role from data-role attribute
      const role = card.getAttribute("data-role");

      // Save to localStorage for the login page to use
      localStorage.setItem("selectedRole", role);

      // Redirect to login page
      window.location.href = "pages/auth/login.html";
    });
  });
});