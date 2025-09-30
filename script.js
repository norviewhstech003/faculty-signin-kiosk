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

 const validIds = [23490,16303,38917,27778,33267,36836,8319,35934,8614,14075,8543,12382,32836,35490,36936,18716,6697,37081,12401,34483,17538,37581,39204,33707,3379,1999,34536,38077,2738,17457,35110,34632,36370,25020,17256,3315,36669,21139,37911,13755,28870,19011,23049,38179,30448,37751,16246,1777,38324,37836,9389,6241,10543,16450,36265,37891,20865,35072,25811,12761,21526,20900,33182,16244,30768,22277,36744,35436,6113,9630,33014,5176,35661,3390,36247,14206,13028,22277,4220,8513,35812,33265,37524,30039,38605,37307,35879,33040,21612,38223,35396,34000,16082,34613,30405,36761,5914,9745,34106,39018,4255,33622,20792,32917,35670,37172,28886,34660,33013,14300,2610,37531,37289,27406,5132,37874,13906,37950,31925,1963,38325,35511,10890,4010,33033,8225,1924,16359,36982,11853,16259,36916,37790,22632,36771,36666,14162,22578,28952,21964,26030,37871,36667,32254,10608,37490,32140,14289,34291,36518,15334,31222,6307,36795,33181,15307,28062,36017,30607,36379,25134,37856,11997,36992,20080];


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

    fetch("https://script.google.com/macros/s/AKfycbzXfen0UDdXOjwH99Lij1VkOmVxp-tmZGPkMSGUQOXYwREZWmVpKNta1RwzQWy6aVVp/exec", {
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

    fetch("https://script.google.com/macros/s/AKfycbzXfen0UDdXOjwH99Lij1VkOmVxp-tmZGPkMSGUQOXYwREZWmVpKNta1RwzQWy6aVVp/exec", {
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
