const firebaseConfig = {
    apiKey: "AIzaSyAMLy3T4uXzgi8MK-u7fYrDtcu7yIeTwBs",
    authDomain: "aqua-track-ams1117.firebaseapp.com",
    databaseURL: "https://aqua-track-ams1117-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "aqua-track-ams1117",
    storageBucket: "aqua-track-ams1117.appspot.com",
    messagingSenderId: "148387512487",
    appId: "1:148387512487:web:9c1150fd899c57209f9b82"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

// Get a reference to the database
const db = firebase.database();

// Function to update the real-time clock accurately
function updateClock() {
    function displayTime() {
        let now = new Date();
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');
        let timeString = `${hours}:${minutes}:${seconds}`;
        document.getElementById("clock").innerText = timeString;
    }

    displayTime(); // Update immediately on page load
    setInterval(displayTime, 1000); // Refresh every second
}

// Run the clock update on page load
document.addEventListener("DOMContentLoaded", () => {
    updateClock();
});

// Function to update WiFi icon based on dBm strength
function updateWifiIcon(strength) {
    const wifiIcon = document.getElementById("wifi-icon");

    // Ensure wifiIcon exists before proceeding
    if (!wifiIcon) {
        console.error("WiFi icon element not found!");
        return;
    }

    console.log("WiFi Strength Received:", strength); // Debugging

    // Ensure strength is a number
    strength = Number(strength);

    let iconSrc = "icons/wifi-none.png"; // Default to no signal

    if (strength > -60) {
        iconSrc = "icons/wifi-strong.png"; // Excellent signal
    } else if (strength > -70) {
        iconSrc = "icons/wifi-medium.png"; // Good signal
    } else if (strength > -80) {
        iconSrc = "icons/wifi-weak.png"; // Weak signal
    }

    wifiIcon.src = iconSrc;
}

const dbRef = firebase.database().ref("WiFiStrength");

dbRef.on("value", (snapshot) => {
    const strength = snapshot.val();
    updateWifiIcon(strength);
});

// Function to update battery icon based on percentage
function updateBatteryIcon(level) {
    const batteryIcon = document.getElementById("battery-icon");
    let iconSrc = "icons/battery-empty.png"; // Default to empty battery
    if (level >= 75) {
        iconSrc = "icons/battery-full.png";
    } else if (level >= 50) {
        iconSrc = "icons/battery-medium.png";
    } else if (level >= 25) {
        iconSrc = "icons/battery-low.png";
    } else {
        icon = "⚠️";
    }
    batteryIcon.src = iconSrc;
}

function updateWaterMeter(usage) {
    const meterElement = document.getElementById("meter-reading");

    if (meterElement) {
        let formattedUsage = String(Math.floor(usage)).padStart(5, '0');

        // Ensure each digit is in a separate span (preserving dividers)
        meterElement.innerHTML = formattedUsage
            .split("")
            .map((digit, index) => `<span class="meter-digit">${digit}</span>`)
            .join('<span class="divider">|</span>') + " <span class='unit'>m³</span>";
    } else {
        console.error("❌ Element #meter-reading not found.");
    }
}

// Function to fetch and update UI with Firebase data
function fetchFirebaseData() {
    db.ref("/").on("value", (snapshot) => {
        if (!snapshot.exists()) {
            console.warn("⚠️ No data found in Firebase.");
            return;
        }

        let data = snapshot.val();
        console.log("✅ Firebase Data Fetched:", data);

        if (data.TotalUsage !== undefined) {
            updateWaterMeter(data.TotalUsage);
        } else {
            console.warn("⚠️ Missing TotalUsage in Firebase data.");
        }

        if (data.BatteryPercentage !== undefined) {
            updateBatteryIcon(data.BatteryPercentage);
        }

        if (data.WifiStrength !== undefined) {
            updateWifiIcon(data.WifiStrength);
        }

        updateStatisticsChart(data.TotalUsage || 0);
    }, (error) => {
        console.error("❌ Firebase Read Error:", error);
    });
}

// Real-time listener for WaterFlow data
db.ref("WaterFlow").on("value", (snapshot) => {
    if (snapshot.exists()) {
        let WaterFlow = snapshot.val();
        updateFlowRate(parseFloat(WaterFlow)); // Update the UI with real data
    } else {
        console.warn("⚠️ No WaterFlow data found in Firebase.");
    }
});

// Function to update the statistics chart (Placeholder)
function updateStatisticsChart(totalUsage) {
    const statsElement = document.getElementById("statsChart");
    if (statsElement) {
        statsElement.innerHTML = `<p>Total Usage: ${totalUsage} L</p>`;
    } else {
        console.warn("⚠️ Element #statsChart not found.");
    }
}

// Sidebar toggle function
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    let overlay = document.getElementById("overlay");

    // Toggle the "active" class for both sidebar and overlay
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
    // Check if elements exist before adding event listeners
    if (document.getElementById("login-btn")) {
        document.getElementById("login-btn").addEventListener("click", function () {
            document.getElementById("auth-popup").style.display = "block"; // Opens the login popup
        });
    }

    if (document.getElementById("connect-btn")) {
        document.getElementById("connect-btn").addEventListener("click", function () {
            document.getElementById("connect-popup").style.display = "block";
        });
    }

    if (document.getElementById("close-connect")) {
        document.getElementById("close-connect").addEventListener("click", function () {
            document.getElementById("connect-popup").style.display = "none";
        });
    }

    if (document.getElementById("notifications-btn")) {
        document.getElementById("notifications-btn").addEventListener("click", function () {
            document.getElementById("notification-popup").style.display = "block";
        });
    }

    if (document.getElementById("close-notification")) {
        document.getElementById("close-notification").addEventListener("click", function () {
            document.getElementById("notification-popup").style.display = "none";
        });
    }

    if (document.getElementById("help-btn")) {
        document.getElementById("help-btn").addEventListener("click", function () {
            window.location.href = "help.html"; // Redirects to Help page
        });
    }

    if (document.getElementById("about-btn")) {
        document.getElementById("about-btn").addEventListener("click", function () {
            window.location.href = "about.html"; // Redirects to About page
        });
    }
});

// Function to close popup
function closePopup() {
    let popup = document.getElementById("notification-popup");
    if (popup) popup.style.display = "none";
}

// Close Auth Popup
function closeAuthPopup() {
    let popup = document.getElementById("auth-popup");
    if (popup) popup.style.display = "none";
}

// Function to show custom input if "Custom" is selected
function toggleCustomInput() {
    let select = document.getElementById("notify-time");
    let customInput = document.getElementById("custom-time");

    if (select && customInput) {
        customInput.style.display = select.value === "custom" ? "block" : "none";
    }
}

// Function to save user-selected notification time
function saveNotificationSetting() {
    let select = document.getElementById("notify-time");
    let customInput = document.getElementById("custom-time");

    let notifyTime = select.value === "custom" ? parseInt(customInput.value) : parseInt(select.value);

    if (isNaN(notifyTime) || notifyTime <= 0) {
        alert("Please enter a valid time!");
        return;
    }

    alert(`Notification will be triggered after ${notifyTime} minutes of continuous water flow.`);
    closePopup();

    // Save to Firebase if Firebase is initialized
    if (typeof db !== "undefined") {
        db.ref("Notifications/selectedTime").set(notifyTime);
    } else {
        console.warn("⚠️ Firebase is not initialized.");
    }
}


// Run functions on page load
document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    fetchFirebaseData();
});

// Test Firebase connection
db.ref("/").once("value", (snapshot) => {
    console.log("✅ Firebase Data:", snapshot.val());
});

// Initialize app function
function initializeApp() {
    console.log("🚀 App Initialized!");
    fetchFirebaseData();
    updateClock();
}

// Keeps track of last known rotations
let simulatedFlow = 0;  // Store accumulated water flow
let lastFlow = 0;       // Store last recorded WaterFlow
let lastRotation = {}; // Store last known rotations for each dial
let newFlowValue = 0; // Initialize with a default value

function updateWaterMeterDials(WaterFlow) {
    console.log("🔄 Updating Water Meter Dials with WaterFlow:", WaterFlow);

    if (WaterFlow > 0) {
        simulatedFlow += WaterFlow * 0.1; // Scale up for better accuracy
    } else {
        console.warn("⚠️ WaterFlow is zero or negative, dials won't move!");
    }

    let x01 = Math.floor(simulatedFlow * 10) % 10;
    let x001 = Math.floor(simulatedFlow * 100) % 10;
    let x0001 = Math.floor(simulatedFlow * 1000) % 10;
    let x00001 = Math.floor(simulatedFlow * 10000) % 10;

    console.log(`Dial Values: x01=${x01}, x001=${x001}, x0001=${x0001}, x00001=${x00001}`);

    updateDial("dial-01", x01);
    updateDial("dial-001", x001);
    updateDial("dial-0001", x0001);
    updateDial("dial-00001", x00001);
}



function updateDial(dialId, value) {
    let dial = document.getElementById(dialId);
    if (!dial) {
        console.error(`❌ Dial element '${dialId}' not found!`);
        return;
    }

    let arrow = dial.querySelector(".arrow");
    if (!arrow) {
        console.error(`❌ Arrow element inside '${dialId}' not found!`);
        return;
    }

    let newRotation = value * 36; // ✅ Define newRotation correctly
    console.log(`🔄 Rotating ${dialId} to ${newRotation}°`);

    arrow.style.transition = "transform 0.8s ease-in-out";
    arrow.style.transform = `translate(-50%, -100%) rotate(${newRotation}deg)`;




        // Ensure lastRotation[dialId] exists
        if (!lastRotation[dialId]) lastRotation[dialId] = newRotation;

        let diff = newRotation - lastRotation[dialId];

        // **Ensure ONLY CLOCKWISE Rotation (No Backward Moves)**
        if (diff < 0) diff += 360; // Forces forward movement

        lastRotation[dialId] += diff; // Update stored rotation

        // **🚀 Ultra-Smooth Rotation (Clockwise Only)**
        arrow.style.transition = "transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
        arrow.style.transform = `translate(-50%, -100%) rotate(${lastRotation[dialId]}deg)`;
    }


// Generate circular number arrangement (with upright numbers)
function generateDialNumbers(dialId) {
    let dial = document.getElementById(dialId);
    let numbersContainer = dial.querySelector(".numbers");
    numbersContainer.innerHTML = ""; // Clear previous numbers

    let radius = 12; // Adjust this if numbers still go outside
    for (let i = 0; i < 10; i++) {
        let num = document.createElement("span");
        num.innerText = i;

        // 🔹 Start "0" at the top (270°) and move clockwise
        let angle = 270 + (i * 36); // 360° divided by 10 numbers

        num.style.left = `calc(50% + ${radius * Math.cos(angle * Math.PI / 180)}px)`;
        num.style.top = `calc(50% + ${radius * Math.sin(angle * Math.PI / 180)}px)`;
        num.style.transform = `translate(-50%, -50%)`; // Keeps numbers upright

        numbersContainer.appendChild(num);
    }
}

// Run once on page load to set up circular numbers
document.addEventListener("DOMContentLoaded", () => {
    generateDialNumbers("dial-01");
    generateDialNumbers("dial-001");
    generateDialNumbers("dial-0001");
    generateDialNumbers("dial-00001");
});

db.ref("WaterFlow").transaction((currentValue) => {
    return (currentValue || 0) + newFlowValue;
});


// Listen for WaterFlow updates
db.ref("WaterFlow").on("value", (snapshot) => {
    let flowRate = snapshot.val();

    if (flowRate > 0) {
        let currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        // Save the last detected water flow time
        db.ref("Notifications/lastFlowTime").set(currentTime);
    }
});

console.log("Simulated Flow:", simulatedFlow);
console.log("Dial Rotation Value:", newRotation);

function checkWaterFlowDuration() {
    db.ref("Notifications").once("value", (snapshot) => {
        let data = snapshot.val();
        if (!data) return;

        let selectedTime = data.selectedTime; // User-selected alert time
        let lastFlowTime = data.lastFlowTime; // When water last started flowing
        let currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        if (lastFlowTime && (currentTime - lastFlowTime) >= selectedTime) {
            sendNotification("Water has been flowing for too long!");
        }

        // Untouchable 5-hour rule (Failsafe)
        if (lastFlowTime && (currentTime - lastFlowTime) >= 18000) { // 5 hours = 18000 seconds
            sendNotification("⚠️ ALERT! Water has been flowing for 5 hours!");
        }
    });
}

// Run this check every minute
setInterval(checkWaterFlowDuration, 60000);

function sendNotification(message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🚰 Water Monitor Alert", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("🚰 Water Monitor Alert", { body: message });
            }
        });
    }
}

// Function to update water flow and animate propeller speed
function updateFlowRate(flowRate) {
    const flowRateDisplay = document.getElementById("flow-rate");
    const propeller = document.querySelector(".propeller");

   // Display the flow rate
flowRateDisplay.innerText = flowRate > 0 ? flowRate.toFixed(2) + " L/m" : "0.00 L/m";

    // Only animate the propeller if the flow rate is valid and greater than 0
    if (flowRate > 0) {
        // Adjust propeller speed based on flow rate
        let speed = Math.max(0.5, flowRate / 10); // Scale speed based on flow
        propeller.style.animationDuration = `${1 / speed}s`; // Faster spin with higher flow
        propeller.style.animationPlayState = "running"; // Ensure animation is active
    } else {
        // Stop the propeller rotation when there's no flow
        propeller.style.animationPlayState = "paused"; // Pause animation
    }
}

// Function to Open the Connect Popup
function openConnectPopup() {
    const popup = document.getElementById("connect-popup");
    popup.classList.add("active"); // Apply animation
}

// Function to Close the Connect Popup
function closePopup() {
    const popup = document.getElementById("connect-popup");
    popup.classList.remove("active"); // Remove animation
    setTimeout(() => {
        popup.style.display = "none"; // Hide after animation
    }, 300);
}

// Function to close the popup (you may need to define this in your code)
function closePopup() {
    document.getElementById("connect-popup").style.display = "none";
}

// Toggle Between Login & Signup
function toggleAuth() {
    let title = document.getElementById("auth-title");
    let actionBtn = document.getElementById("auth-action");
    let toggleText = document.getElementById("auth-toggle");

    if (title.innerText === "Log In") {
        title.innerText = "Sign Up";
        actionBtn.innerText = "Sign Up";
        toggleText.innerHTML = `Already have an account? <span onclick="toggleAuth()">Log In</span>`;
    } else {
        title.innerText = "Log In";
        actionBtn.innerText = "Log In";
        toggleText.innerHTML = `Don't have an account? <span onclick="toggleAuth()">Sign Up</span>`;
    }
}

// Sign Up or Log In User
document.getElementById("auth-action").addEventListener("click", function () {
    let emailField = document.getElementById("email");
    let passwordField = document.getElementById("password");

    if (!emailField || !passwordField) {
        alert("⚠️ Email or password field not found.");
        return;
    }

    let email = emailField.value.trim();
    let password = passwordField.value.trim();
    let action = document.getElementById("auth-action").innerText;

    if (!email || !password) {
        alert("⚠️ Please fill in all fields.");
        return;
    }

    if (action === "Sign Up") {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert("✅ Account Created! You can now log in.");
                toggleAuth();
                emailField.value = "";
                passwordField.value = "";
            })
            .catch(error => alert("❌ " + error.message));
    } else {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert("✅ Login Successful!");
                document.getElementById("auth-popup").style.display = "none";
                document.getElementById("logout-btn").style.display = "block";
                document.getElementById("login-btn").style.display = "none"; // Hide login button
            })
            .catch(error => alert("❌ " + error.message));
    }
});

// Logout User
document.getElementById("logout-btn").addEventListener("click", function () {
    firebase.auth().signOut().then(() => {
        alert("✅ Logged Out!");
        document.getElementById("logout-btn").style.display = "none";
        document.getElementById("login-btn").style.display = "block"; // Show login button again
    });
});

// Keep User Logged In
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById("logout-btn").style.display = "block";
        document.getElementById("login-btn").style.display = "none";
    } else {
        document.getElementById("logout-btn").style.display = "none";
        document.getElementById("login-btn").style.display = "block";
    }
});

// Function to go to Statistics Page
function goToStatistics() {
    window.location.href = "statistics.html"; // Redirects to statistics page
}

// Function to go back to Dashboard
function goToDashboard() {
    window.location.href = "index.html"; // Redirects back to the main dashboard
}

// Function to open camera and show preview
function openCamera() {
    const cameraOverlay = document.createElement("div");
    cameraOverlay.id = "camera-overlay";
    cameraOverlay.style.position = "fixed";
    cameraOverlay.style.top = "0";
    cameraOverlay.style.left = "0";
    cameraOverlay.style.width = "100vw";
    cameraOverlay.style.height = "100vh";
    cameraOverlay.style.background = "rgba(0, 0, 0, 0.8)";
    cameraOverlay.style.display = "flex";
    cameraOverlay.style.flexDirection = "column";
    cameraOverlay.style.justifyContent = "center";
    cameraOverlay.style.alignItems = "center";
    cameraOverlay.style.zIndex = "9999";

    const video = document.createElement("video");
    video.setAttribute("autoplay", "");
    video.setAttribute("playsinline", "");
    video.style.width = "90vw";
    video.style.maxWidth = "600px";
    video.style.borderRadius = "10px";
    video.style.border = "4px solid white";

    const captureButton = document.createElement("button");
    captureButton.innerText = "Capture";
    captureButton.style.marginTop = "10px";
    captureButton.style.padding = "10px 20px";
    captureButton.style.fontSize = "16px";
    captureButton.style.backgroundColor = "#4CAF50";
    captureButton.style.color = "white";
    captureButton.style.border = "none";
    captureButton.style.borderRadius = "5px";
    captureButton.style.cursor = "pointer";
    captureButton.onclick = () => captureImage(video, stream, cameraOverlay);

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.marginTop = "10px";
    closeButton.style.padding = "10px 20px";
    closeButton.style.fontSize = "16px";
    closeButton.style.backgroundColor = "#FF3B3B";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = () => closeCamera(stream, cameraOverlay);

    cameraOverlay.appendChild(video);
    cameraOverlay.appendChild(captureButton);
    cameraOverlay.appendChild(closeButton);
    document.body.appendChild(cameraOverlay);

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error("Camera access denied!", err);
            alert("Camera access is required to scan the meter.");
            document.body.removeChild(cameraOverlay);
        });
}

// Function to capture image and process meter reading
function captureImage(video, stream, overlay) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = canvas.toDataURL("image/png");
    processMeterReading(imageData);

    closeCamera(stream, overlay);
}

// Function to close camera overlay
function closeCamera(stream, overlay) {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    document.body.removeChild(overlay);
}

// Function to extract numbers from the captured meter image
function processMeterReading(imageData) {
    Tesseract.recognize(
        imageData,
        'eng',
        { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
        let meterValue = extractNumbers(text);
        if (meterValue) {
            document.getElementById("water-reading").innerText = meterValue;
        } else {
            alert("Could not read meter value. Try again!");
        }
    }).catch(err => {
        console.error("OCR Error:", err);
    });
}

// Function to extract numbers from OCR result
function extractNumbers(text) {
    let numbers = text.match(/\d+/g);
    return numbers ? numbers.join("") : null;
}


// Function for manual input
function manualInput() {
    let userValue = prompt("Enter Water Meter Reading (00000-99999):");
    if (userValue && !isNaN(userValue) && userValue.length <= 5) {
        document.getElementById("water-reading").innerText = userValue.padStart(5, '0');
    } else {
        alert("Invalid input! Please enter a 5-digit number.");
    }
}

// Function to update the statistics chart using Chart.js
let myChart; // Declare globally

document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("usageChart").getContext("2d");

    myChart = new Chart(ctx, {  // Now myChart is initialized properly
        type: "line",
        data: {
            labels: ["00:00", "00:01", "00:02", "00:03", "00:04"],
            datasets: [{
                label: "Water Usage",
                data: [1.2, 2.5, 3.1, 2.8, 4.0],
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
});

function filterData(timeframe) {
    document.querySelectorAll('.time-filters button').forEach(button => {
        button.classList.remove('active');
    });

    event.target.classList.add('active');

    updateChart(timeframe);
}

function updateChart(timeframe) {
    if (!myChart) {
        console.error("Chart is not initialized yet!");
        return;
    }

    let labels = [], data = [];

    switch (timeframe) {
        case "minute":
            labels = ["00:00", "00:01", "00:02", "00:03", "00:04"];
            data = [1.2, 2.5, 3.1, 2.8, 4.0];
            break;
        case "hour":
            labels = ["1 AM", "2 AM", "3 AM", "4 AM", "5 AM"];
            data = [15, 20, 18, 22, 25];
            break;
        case "day":
            labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
            data = [50, 60, 45, 70, 65];
            break;
        case "week":
            labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
            data = [200, 250, 190, 280];
            break;
        case "month":
            labels = ["Jan", "Feb", "Mar", "Apr", "May"];
            data = [800, 750, 900, 950, 1000];
            break;
        case "year":
            labels = ["2020", "2021", "2022", "2023", "2024"];
            data = [5000, 5500, 6000, 6500, 7000];
            break;
    }

    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.update();
}

