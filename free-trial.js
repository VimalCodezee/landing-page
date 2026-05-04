document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("freeTrialForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    const fullName = document.getElementById("fullName");
    const businessName = document.getElementById("businessName");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const employeesCount = document.getElementById("employeesCount");

    // Clear existing error messages
    document.querySelectorAll(".error-msg").forEach((el) => el.remove());
    // Reset invalid borders
    document.querySelectorAll(".border-red-400").forEach((el) => {
      el.classList.remove("border-red-400", "ring-red-100", "ring-2");
      el.classList.add("border-gray-200");
    });

    const showError = (input, message) => {
      isValid = false;
      const errorSpan = document.createElement("span");
      errorSpan.className = "error-msg text-red-500 text-xs mt-1 block font-medium";
      errorSpan.textContent = message;

      let targetContainer = input.parentElement;
      let inputElement = input;

      // Handle the phone input layout
      if (input.id === "phone") {
        targetContainer = input.parentElement.parentElement;
        inputElement = input.parentElement; // The div wrapper
      }

      targetContainer.appendChild(errorSpan);
      
      // Highlight the input with red border
      inputElement.classList.remove("border-gray-200");
      inputElement.classList.add("border-red-400", "ring-red-100", "ring-2");
    };

    if (!fullName.value.trim() || fullName.value.trim().length < 2) {
      showError(fullName, "Please enter a valid full name.");
    }

    if (!businessName.value.trim() || businessName.value.trim().length < 2) {
      showError(businessName, "Please enter a valid business name.");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.value.trim())) {
      showError(phone, "Please enter a valid 10-digit phone number.");
    }

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
    }

    if (!employeesCount.value || parseInt(employeesCount.value, 10) < 1) {
      showError(employeesCount, "Please enter a valid number of employees.");
    }

    if (isValid) {
      // Simulate submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;
      submitBtn.classList.add("opacity-70", "cursor-not-allowed");

      setTimeout(() => {
        alert("Free trial request submitted successfully!");
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
      }, 1000);
    }
  });

  // Clear errors when the user starts typing
  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      let targetContainer = input.parentElement;
      let inputElement = input;

      if (input.id === "phone") {
        targetContainer = input.parentElement.parentElement;
        inputElement = input.parentElement;
      }

      const errorMsg = targetContainer.querySelector(".error-msg");
      if (errorMsg) {
        errorMsg.remove();
        inputElement.classList.remove("border-red-400", "ring-red-100", "ring-2");
        inputElement.classList.add("border-gray-200");
      }
    });
  });
});