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
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwt7T19upulx_rJHaLDu-kv0Cw9IAHcaCu6jJyt72EH9ES8K4Sh6irJma5zuMCGZIGD/exec";

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
  body: JSON.stringify({
    employeeId: id,
    timestamp: new Date().toISOString()
  })
})
  .then(async r => {
    const text = await r.text();
    console.log("Raw response:", text);

    let res;
    try {
      res = JSON.parse(text);
    } catch {
      status.textContent = "Server did not return JSON. Response: " + text.slice(0, 120);
      throw new Error("Non-JSON response");
    }
    return res;
  })
  .then(res => {
    if (res.status === "notInRoster") {
      form.style.display = "none";
      fallbackForm.style.display = "block";
      confirmIdInput.value = id;
      status.textContent = "This ID is not in the system. Please enter your full name.";
    } else if (res.status === "ok") {
      status.textContent = "Sign-in successful!";
      setTimeout(() => { status.textContent = ""; }, 3000);
      input.value = "";
      input.focus();
    } else {
      status.textContent = "Error: " + (res.message || "Unknown issue");
    }
  })
  .catch(() => {
    status.textContent = "Network error. Try again.";
  });
});
});
