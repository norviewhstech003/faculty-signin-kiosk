document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signin-form");
  const input = document.getElementById("employee-id");
  const status = document.getElementById("status");
  const dateElement = document.getElementById("current-date");
  const fallbackForm = document.getElementById("fallback-form");
  const fullNameInput = document.getElementById("full-name");
  const confirmIdInput = document.getElementById("confirm-id");
  const fallbackSubmit = document.getElementById("fallback-submit");

  // 👇 Paste your latest Web App URL here
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzXfen0UDdXOjwH99Lij1VkOmVxp-tmZGPkMSGUQOXYwREZWmVpKNta1RwzQWy6aVVp/exec";

  // Show today's date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = new Date().toLocaleDateString(undefined, options);

  input.focus();

  let scanBuffer = '';
  let lastKeyTime = Date.now();

  // Handle fast barcode scans or Enter key presses
  input.addEventListener("keydown", function (e) {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastKeyTime;
    lastKeyTime = currentTime;

    if (timeDiff > 100) scanBuffer = '';

    if (e.key >= "0" && e.key <= "9") {
      scanBuffer += e.key;

      if (/^\d{4,5}$/.test(scanBuffer)) {
        setTimeout(() => {
          if (input.value.trim() === scanBuffer) {
            form.requestSubmit();
          }
          scanBuffer = '';
        }, 20);
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const id = input.value.trim();
      if (/^\d{4,5}$/.test(id)) {
        form.requestSubmit();
      }
    }
  });

  // Handle primary form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = input.value.trim();

    if (!/^\d{4,5}$/.test(id)) {
      status.textContent = "Please enter a valid 4- or 5-digit ID.";
      return;
    }

    // Always send to Apps Script — it decides if ID is in roster
    submitToSheet({ employeeId: id, timestamp: new Date().toISOString() });
  });

  // Handle fallback form
  fallbackSubmit.addEventListener("click", function () {
    const fullName = fullNameInput.value.trim();
    const confirmedId = confirmIdInput.value.trim();

    if (!fullName || !/^\d{4,5}$/.test(confirmedId)) {
      status.textContent = "Please enter your full name and a valid 4- or 5-digit ID.";
      return;
    }

    const payload = {
      fullName: fullName,
      employeeId: confirmedId,
      timestamp: new Date().toISOString(),
      notInRoster: true
    };

    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    status.textContent = "Sign-in recorded. Thank you!";
    fallbackForm.reset();
    fallbackForm.style.display = "none";
    form.style.display = "block";
    input.value = "";
    input.focus();
  });

  function submitToSheet(payload) {
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    status.textContent = "Sign-in successful!";
    setTimeout(() => { status.textContent = ""; }, 3000);

    input.value = "";
    input.focus();
  }
});
