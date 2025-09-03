document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signin-form");
  const input = document.getElementById("employee-id");
  const status = document.getElementById("status");
  const dateElement = document.getElementById("current-date");

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = new Date().toLocaleDateString(undefined, options);

  input.focus();

  let scanTimeout;

  input.addEventListener("input", function () {
    clearTimeout(scanTimeout);

    // Start timeout only if input length is exactly 4 or 5 digits
    scanTimeout = setTimeout(() => {
      const id = input.value.trim();
      if (/^\d{4,5}$/.test(id)) {
        form.requestSubmit();
      }
    }, 150);
  });

  // If a user takes longer and finishes typing, they can still press Enter or click Submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = input.value.trim();

    if (!/^\d{4,5}$/.test(id)) {
      status.textContent = "Please enter a valid 4- or 5-digit ID.";
      return;
    }

    const payload = {
      employeeId: id,
      timestamp: new Date().toISOString()
    };

    fetch("https://script.google.com/macros/s/AKfycbzXfen0UDdXOjwH99Lij1VkOmVxp-tmZGPkMSGUQOXYwREZWmVpKNta1RwzQWy6aVVp/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    status.textContent = "Sign-in successful!";
    input.value = "";
    input.focus();
  });
});
