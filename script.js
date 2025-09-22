document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signin-form");
  const input = document.getElementById("employee-id");
  const status = document.getElementById("status");
  const dateElement = document.getElementById("current-date");
  const fallbackForm = document.getElementById("fallback-form");
  const fullNameInput = document.getElementById("full-name");
  const confirmIdInput = document.getElementById("confirm-id");
  const fallbackSubmit = document.getElementById("fallback-submit");
  const mainContainer = document.querySelector(".container");

  const validIds = [1234, 56789, 8513, 32140]; // ← You can paste in your staff ID list here!

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = new Date().toLocaleDateString(undefined, options);

  input.focus();

  let scanBuffer = '';
  let lastKeyTime = Date.now();

  input.addEventListener("keydown", function (e) {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastKeyTime;
    lastKeyTime = currentTime;

    if (timeDiff > 100) {
      scanBuffer = '';
    }

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
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = input.value.trim();

    if (!/^\d{4,5}$/.test(id)) {
      status.textContent = "Please enter a valid 4- or 5-digit ID.";
      return;
    }

    if (!validIds.includes(Number(id))) {
      form.style.display = "none";
      fallbackForm.style.display = "block";
      confirmIdInput.value = id;
      status.textContent = "This ID is not in the system. Please enter your full name.";
      return;
    }

    submitToSheet(id);
  });

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

    fetch("YOUR_WEB_APP_URL_HERE", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    status.textContent = "Sign-in recorded. Thank you!";
    fallbackForm.reset();
    fallbackForm.style.display = "none";
    form.style.display = "block";
    input.value = "";
    input.focus();
  });

  function submitToSheet(id) {
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
    setTimeout(() => {
      status.textContent = "";
    }, 3000);

    input.value = "";
    input.focus();
  }
});
