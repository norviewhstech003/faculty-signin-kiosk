document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signin-form");
  const input = document.getElementById("employee-id");
  const status = document.getElementById("status");
  const dateElement = document.getElementById("current-date");

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = new Date().toLocaleDateString(undefined, options);

  input.focus();

  let scanBuffer = '';
  let lastKeyTime = Date.now();

  input.addEventListener("keydown", function (e) {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastKeyTime;
    lastKeyTime = currentTime;

    // Reset buffer if typing is slow
    if (timeDiff > 100) {
      scanBuffer = '';
    }

    // Track digits only
    if (e.key >= "0" && e.key <= "9") {
      scanBuffer += e.key;

      // Only auto-submit if 5 digits are typed rapidly
      if (/^\d{5}$/.test(scanBuffer)) {
        setTimeout(() => {
          if (input.value.trim() === scanBuffer) {
            form.requestSubmit();
          }
          scanBuffer = '';
        }, 20);
      }
    }
  });

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
