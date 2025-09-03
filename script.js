document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signin-form");
  const input = document.getElementById("employee-id");
  const status = document.getElementById("status");

  input.focus();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = input.value.trim();

    if (!id) {
      status.textContent = "Please enter a valid ID.";
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
