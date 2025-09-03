document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signin-form");
  const input = document.getElementById("employee-id");
  const status = document.getElementById("status");
  const dateElement = document.getElementById("current-date");

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = new Date().toLocaleDateString(undefined, options);

  input.focus();

  let scanBuffer = "";
  let lastKeyTime = Date.now();

  input.addEventListener("keydown", function (e) {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastKeyTime;

    // Reset buffer if time between keystrokes is slow
    if (timeDiff > 100) scanBuffer = "";

    lastKeyTime = currentTime;

    // Only track numeric digits
    if (e.key >= "0" && e.key <= "9") {
      scanBuffer += e.key;

      // Auto-submit if the buffer matches 4 or 5 digit number
      if (/^\d{4,5}$/.test(scanBuffer)) {
        setTimeout(() => {
          if (/^\d{4,5}$/.test(input.value.trim())) {
            form.requestSubmit();
          }
          scanBuffer = "";
        }, 10);
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

    fetch("YOUR_WEB_APP_URL_HERE", {
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
