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

  // Handle fast scans or Enter
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

  // Primary form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = input.value.trim();

    if (!/^\d{4,5}$/.test(id)) {
      status.textContent = "Please enter a valid 4- or 5-digit ID.";
      return;
    }

    fetch(https://script.google.com/macros/s/AKfycbzXfen0UDdXOjwH99Lij1VkOmVxp-tmZGPkMSGUQOXYwREZWmVpKNta1RwzQWy6aVVp/exec, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ employeeId: id, timestamp: new Date().toISOString() })
})
.then(r => r.json())
.then(res => {
  if (res.status === "notInRoster") {
    // Show fallback form
    form.style.display = "none";
    fallbackForm.style.display = "block";
    confirmIdInput.value = id;
    status.textContent = "This ID is not in the system. Please enter your full name.";
  } else if (res.status === "ok") {
    status.textContent = "Sign-in successful!";
    setTimeout(() => { status.textContent = ""; }, 3000);
  } else {
    status.textContent = "Error: " + (res.message || "Unknown issue");
  }
  input.value = "";
  input.focus();
})
.catch(() => {
  status.textContent = "Network error. Try again.";
});

      } else if (res.status === "ok") {
        status.textContent = "Sign-in successful!";
        setTimeout(() => { status.textContent = ""; }, 3000);
      } else {
        status.textContent = "Error: " + (res.message || "Unknown issue");
      }
      input.value = "";
      input.focus();
    })
    .catch(() => {
      status.textContent = "Network error. Try again.";
    });
  });

  // Handle fallback submission
  fallbackSubmit.addEventListener("click", function () {
    const fullName = fullNameInput.value.trim();
    const confirmedId = confirmIdInput.value.trim();

    if (!fullName || !/^\d{4,5}$/.test(confirmedId)) {
      status.textContent = "Please enter your full name and a valid 4- or 5-digit ID.";
      return;
    }

    fetch(https://script.google.com/macros/s/AKfycbzXfen0UDdXOjwH99Lij1VkOmVxp-tmZGPkMSGUQOXYwREZWmVpKNta1RwzQWy6aVVp/exec, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName,
        employeeId: confirmedId,
        timestamp: new Date().toISOString(),
        notInRoster: true
      })
    });

    status.textContent = "Sign-in recorded. Thank you!";
    fallbackForm.reset();
    fallbackForm.style.display = "none";
    form.style.display = "block";
    input.value = "";
    input.focus();
  });
});
