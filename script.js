// ---------- Step navigation ----------
var steps = [1, 2, 3, 4];

function showStep(stepNum) {
  steps.forEach(function (n) {
    document.getElementById(stepId(n)).classList.toggle("hidden", n !== stepNum);
    document.querySelector('.step[data-step="' + n + '"]').classList.toggle("active", n === stepNum);
  });
  if (stepNum === 4) {
    buildReview();
  }
}

function stepId(n) {
  if (n === 1) return "stepPersonal";
  if (n === 2) return "stepAddress";
  if (n === 3) return "stepCourse";
  if (n === 4) return "stepReview";
}

document.querySelectorAll(".next-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var current = btn.closest(".form-step");
    if (!validateStep(current.id)) return;
    showStep(parseInt(btn.dataset.next, 10));
  });
});

document.querySelectorAll(".prev-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    showStep(parseInt(btn.dataset.prev, 10));
  });
});

// ---------- Validation ----------
function setError(fieldId, message) {
  var el = document.getElementById("err-" + fieldId);
  if (el) el.textContent = message || "";
}

function validateStep(stepIdName) {
  var valid = true;

  if (stepIdName === "stepPersonal") {
    var fullName = document.getElementById("fullName").value.trim();
    var dob = document.getElementById("dob").value;
    var gender = document.getElementById("gender").value;
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();

    setError("fullName", "");
    setError("dob", "");
    setError("gender", "");
    setError("email", "");
    setError("phone", "");

    if (!fullName) {
      setError("fullName", "Enter your full name");
      valid = false;
    }
    if (!dob) {
      setError("dob", "Select your date of birth");
      valid = false;
    }
    if (!gender) {
      setError("gender", "Select your gender");
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Enter a valid email");
      valid = false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("phone", "Enter a valid 10-digit number");
      valid = false;
    }
  }

  if (stepIdName === "stepAddress") {
    setError("address", "");
    var r1 = document.getElementById("r1").value.trim();
    var r3 = document.getElementById("r3").value.trim();
    if (!r1 || !r3) {
      setError("address", "Fill at least address line 1 and city");
      valid = false;
    }
  }

  if (stepIdName === "stepCourse") {
    var course = document.getElementById("course").value;
    var tenth = document.getElementById("tenthPercent").value;
    var twelfth = document.getElementById("twelfthPercent").value;

    setError("course", "");
    setError("tenthPercent", "");
    setError("twelfthPercent", "");

    if (!course) {
      setError("course", "Select a course");
      valid = false;
    }
    if (!tenth || tenth < 0 || tenth > 100) {
      setError("tenthPercent", "Enter a valid percentage");
      valid = false;
    }
    if (!twelfth || twelfth < 0 || twelfth > 100) {
      setError("twelfthPercent", "Enter a valid percentage");
      valid = false;
    }
  }

  return valid;
}

// ---------- Address copy feature ----------
var addressFields = [1, 2, 3, 4];
var copyStatus = document.getElementById("copyStatus");

document.getElementById("copySelected").addEventListener("click", function () {
  var selected = addressFields.filter(function (n) {
    return document.getElementById("c" + n).checked;
  });

  if (selected.length === 0) {
    copyStatus.textContent = "Tick at least one line first";
    return;
  }

  selected.forEach(function (n) {
    document.getElementById("p" + n).value = document.getElementById("r" + n).value;
  });

  copyStatus.textContent = "Copied line " + selected.join(", ") + " to permanent address";
});

document.getElementById("copyAll").addEventListener("click", function () {
  addressFields.forEach(function (n) {
    document.getElementById("p" + n).value = document.getElementById("r" + n).value;
  });
  copyStatus.textContent = "Copied all lines to permanent address";
});

document.getElementById("clearPermanent").addEventListener("click", function () {
  addressFields.forEach(function (n) {
    document.getElementById("p" + n).value = "";
  });
  copyStatus.textContent = "Permanent address cleared";
});

// ---------- Review ----------
function buildReview() {
  var data = [
    ["Full Name", document.getElementById("fullName").value],
    ["Date of Birth", document.getElementById("dob").value],
    ["Gender", document.getElementById("gender").value],
    ["Email", document.getElementById("email").value],
    ["Phone", document.getElementById("phone").value],
    ["Residential Address", buildAddress("r")],
    ["Permanent Address", buildAddress("p")],
    ["Course", document.getElementById("course").value],
    ["10th %", document.getElementById("tenthPercent").value],
    ["12th %", document.getElementById("twelfthPercent").value]
  ];

  var html = "";
  data.forEach(function (row) {
    html +=
      '<div class="review-item"><span class="review-label">' +
      row[0] +
      '</span><span class="review-value">' +
      (row[1] || "-") +
      "</span></div>";
  });

  document.getElementById("reviewBox").innerHTML = html;
}

function buildAddress(prefix) {
  return [1, 2, 3, 4]
    .map(function (n) {
      return document.getElementById(prefix + n).value;
    })
    .filter(Boolean)
    .join(", ");
}

// ---------- Submit ----------
document.getElementById("admissionForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("admissionForm").classList.add("hidden");
  document.getElementById("successBox").classList.remove("hidden");
});

document.getElementById("restartBtn").addEventListener("click", function () {
  document.getElementById("admissionForm").reset();
  document.getElementById("admissionForm").classList.remove("hidden");
  document.getElementById("successBox").classList.add("hidden");
  showStep(1);
  copyStatus.textContent = "";
});
