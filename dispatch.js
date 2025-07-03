const barangayList = [
    // Add your barangay names here, e.g.:
    "Tetuan", "Sta. Maria", "Pasonanca", "Putik", "San Roque", "Canelar", "Guiwan", "Tumaga"
    // ...etc
];

// Autocomplete for barangay
function filterBarangays() {
    const input = document.getElementById('barangay');
    const suggestions = document.getElementById('barangay-suggestions');
    const value = input.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (!value) {
        suggestions.classList.add('hidden');
        return;
    }
    const matches = barangayList.filter(b => b.toLowerCase().startsWith(value));
    if (matches.length === 0) {
        suggestions.classList.add('hidden');
        return;
    }
    matches.forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        li.onclick = () => {
            input.value = b;
            suggestions.classList.add('hidden');
        };
        suggestions.appendChild(li);
    });
    suggestions.classList.remove('hidden');
}
function handleBarangayKeydown(e) {
    const suggestions = document.getElementById('barangay-suggestions');
    if (e.key === 'ArrowDown' && suggestions.children.length > 0) {
        suggestions.children[0].focus();
        e.preventDefault();
    }
}

// Alarm press logic
let alarmLevel = 0;
const alarmLabel = document.getElementById('alarm-status-label');
const alarmInput = document.getElementById('alarm');
const alarmLog = document.getElementById('alarm-log-container');
document.getElementById('alarm-minus').onclick = () => {
    if (alarmLevel > 0) alarmLevel--;
    updateAlarmDisplay();
};
document.getElementById('alarm-plus').onclick = () => {
    alarmLevel++;
    updateAlarmDisplay();
};
document.getElementById('alarm-under-control').onclick = () => {
    alarmLevel = 0;
    updateAlarmDisplay("Fire Under Control");
};
function updateAlarmDisplay(status) {
    if (status === "Fire Under Control") {
        alarmLabel.textContent = "Fire Under Control";
        alarmInput.value = "Fire Under Control";
    } else {
        alarmLabel.textContent = alarmLevel === 0 ? "Verification" : `${alarmLevel} Alarm`;
        alarmInput.value = alarmLevel === 0 ? "Verification" : `${alarmLevel} Alarm`;
    }
    const log = document.createElement('div');
    log.textContent = `Alarm set to: ${alarmInput.value} (${new Date().toLocaleTimeString()})`;
    alarmLog.appendChild(log);
}

// Telegram Bot credentials (same as main.js)
const token = '7742982738:AAEKDUd43h9v6-TsZ8fRcfNopn2aDQjr1qY';
const chatId = -1002847077785;

document.getElementById('dispatchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const exactaddress = document.getElementById('exactaddress').value.trim();
    const barangay = document.getElementById('barangay').value.trim();
    const city = document.getElementById('city').value.trim();
    const alarm = document.getElementById('alarm').value.trim();
    const type = document.getElementById('type').value.trim();
    const occupancy = document.getElementById('occupancy').value.trim();
    const involved = document.getElementById('involved').value.trim();
    const responders = document.getElementById('responders').value.trim();
    const msgDiv = document.getElementById('dispatchMsg');

    if (!exactaddress || !barangay || !city || !alarm || !type || !occupancy || !involved || !responders) {
        msgDiv.textContent = "Please fill in all fields.";
        msgDiv.style.color = "#f44336";
        return;
    }

    const message =
`[${type}] ${alarm}
Location: ${exactaddress}, ${barangay}, ${city}
Occupancy: ${occupancy}
Involved: ${involved}
Responding Team: ${responders}`;

    msgDiv.textContent = "Sending...";
    msgDiv.style.color = "#bbb";

    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
        const data = await res.json();
        if (data.ok) {
            msgDiv.textContent = "Alert sent successfully!";
            msgDiv.style.color = "#4caf50";
            document.getElementById('dispatchForm').reset();
        } else {
            msgDiv.textContent = "Failed to send alert.";
            msgDiv.style.color = "#f44336";
        }
    } catch (err) {
        msgDiv.textContent = "Network error. Try again.";
        msgDiv.style.color = "#f44336";
    }
});
