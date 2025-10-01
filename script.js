document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signin-form");
  const input = document.getElementById("employee-id");
  const status = document.getElementById("status");
  const dateElement = document.getElementById("current-date");
  const fallbackForm = document.getElementById("fallback-form");
  const fullNameInput = document.getElementById("full-name");
  const confirmIdInput = document.getElementById("confirm-id");
  const fallbackSubmit = document.getElementById("fallback-submit");

  // 👇 Paste your latest Web App URL here after each Apps Script deployment
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwrFZYoZ2gOlA5coKyNqCeOS65jsftyQgrRO4Gs2fnL-ZMb-zW5X53utMJquYwWGbCT/exec";

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

  // Primary form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = input.value.trim();

    if (!/^\d{4,5}$/.test(id)) {
      status.textContent = "Please enter a valid 4- or 5-digit ID.";
      return;
    }

    fetch(WEB_APP_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ employeeId: id, timestamp: new Date().toISOString() })
})
.then(r => r.text())   // 👈 grab raw text
.then(res => {
  console.log("Raw response:", res);   // 👈 see in DevTools console
  try {
    const parsed = JSON.parse(res);
    if (parsed.status === "ok") {
      status.textContent = "Sign-in successful!";
    } else {
      status.textContent = "Error: " + (parsed.message || "Unknown issue");
    }
  } catch (err) {
    status.textContent = "Response was not JSON. Check console.";
  }
})
.catch(err => {
  console.error("Fetch failed:", err);
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

    fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName,
        employeeId: confirmedId,
        timestamp: new Date().toISOString(),
        notInRoster: true
      })
    })
    .then(r => r.json())
    .then(res => {
      if (res.status === "ok" || res.status === "notInRoster") {
        status.textContent = "Sign-in recorded. Thank you!";
        setTimeout(() => { status.textContent = ""; }, 3000);
      } else {
        status.textContent = "Error: " + (res.message || "Unknown issue");
      }
      fallbackForm.reset();
      fallbackForm.style.display = "none";
      form.style.display = "block";
      input.value = "";
      input.focus();
    })
    .catch(() => {
      status.textContent = "Network error. Try again.";
    });
  });
});
