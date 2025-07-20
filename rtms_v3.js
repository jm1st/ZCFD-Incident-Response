//CHOOSE OOPTION MODAL
document.addEventListener('DOMContentLoaded', function() {
    const optionInput = document.getElementById('optionInput');
    const optionModal = document.getElementById('optionModal');
    const closeModalBtn = optionModal.querySelector('.close-modal');
    const optionList = document.getElementById('optionList');

    // Show modal when input is clicked
    optionInput.addEventListener('click', function() {
        optionModal.classList.add('show');
    });

    // Hide modal when close button is clicked
    closeModalBtn.addEventListener('click', function() {
        optionModal.classList.remove('show');
    });

    // Hide modal when clicking outside modal content
    optionModal.addEventListener('click', function(e) {
        if (e.target === optionModal) {
            optionModal.classList.remove('show');
        }
    });

    // Handle option selection
    optionList.addEventListener('click', function(e) {
        if (e.target.classList.contains('option-item')) {
            optionInput.value = e.target.textContent;
            optionModal.classList.remove('show');
        }
    });
    
});

//CHOOSE OOPTION MODAL END

//BARANGAY AUTOCOMPLETE
const barangays = [
"Arena Blanco", "Ayala", "Baliwasan", "Baluno", "Zone I", "Zone II",
"Zone III", "Zone IV", "Boalan", "Bolong", "Buenavista", "Bunguiao",
"Busay", "Cabaluay", "Cabatangan", "Cacao", "Calabasa", "Calarian", "Camino Nuevo",
"Campo Islam", "Canelar", "Capisan", "Cawit", "Culianan", "Curuan", "Dita", "Divisoria",
"Dulian (Upper Bunguiao)", "Dulian (Upper Pasonanca)", "Guisao", "Guiwan", "Kasanyangan",
"La Paz", "Labuan", "Lamisahan", "Landang Gua", "Landang Laum", "Lanzones", "Lapakan",
"Latuan", "Licomo", "Limaong", "Limpapa", "Lubigan", "Lumayang", "Lumbangan", "Lunzuran",
"Maasin", "Malagutay", "Mampang", "Manalipa", "Mangusu", "Manicahan", "Mariki", "Mercedes",
"Muti", "Pamucutan", "Pangapuyan", "Panubigan", "Pasilmanta", "Pasobolong", "Pasonanca",
"Patalon", "Putik", "Quiniput", "Recodo", "Rio Hondo", "Salaan", "San Jose Cawa-cawa",
"San Jose Gusu", "San Roque", "Sangali", "St. Barbara", "St. Catalina", "St. Maria",
"Santo Niño", "Sibulao", "Sinubung", "Sinunuc", "Tagasilay", "Taguiti", "Talabaan",
"Talisayan", "Talon-talon", "Taluksangay", "Tetuan", "Tictapul", "Tigbalabag", "Tigtabon",
"Tolosa", "Tugbungan", "Tulungatung", "Tumaga", "Tumalutab", "Tumitus", "Victoria",
"Vitali", "Zambowood"
];

const barangayInput = document.getElementById('barangay');
const suggestionsList = document.getElementById('suggestions');
let selectedIndex = -1;
let filteredBarangays = [];

function filterBarangays() {
    const input = barangayInput.value.trim().toLowerCase();
    suggestionsList.innerHTML = '';
    filteredBarangays = [];

    if (!input) {
        suggestionsList.classList.add('hidden');
        resetSuggestionsStyle();
        return;
    }

    filteredBarangays = barangays.filter(barangay =>
        barangay.toLowerCase().includes(input)
    );

    filteredBarangays.forEach((barangay, index) => {
        const li = document.createElement('li');
        li.textContent = barangay;
        li.className = 'suggestion-item';
        li.tabIndex = -1;
        li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectBarangay(barangay);
        });
        li.addEventListener('mouseenter', () => {
            selectedIndex = index;
            updateActiveItem();
        });
        suggestionsList.appendChild(li);
    });

    if (filteredBarangays.length > 0) {
        suggestionsList.classList.remove('hidden');
        positionSuggestions();
        selectedIndex = 0;
        updateActiveItem();
    } else {
        suggestionsList.classList.add('hidden');
        resetSuggestionsStyle();
    }
}

function selectBarangay(barangay) {
    barangayInput.value = barangay;
    suggestionsList.classList.add('hidden');
    // Instead of resetting all styles, only hide and clear content
    suggestionsList.innerHTML = '';
}

function handleKeydown(event) {
    const items = suggestionsList.getElementsByTagName('li');
    if (!items.length || suggestionsList.classList.contains('hidden')) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateActiveItem();
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateActiveItem();
    } else if (event.key === 'Enter') {
        if (selectedIndex > -1) {
            event.preventDefault();
            selectBarangay(items[selectedIndex].textContent);
        }
    } else if (event.key === 'Tab') {
        if (items.length > 0 && selectedIndex > -1) {
            // Autocomplete to the currently highlighted option (not always the topmost)
            selectBarangay(items[selectedIndex].textContent);
            event.preventDefault();
        }
    }
}

function updateActiveItem() {
    const items = suggestionsList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    if (selectedIndex > -1 && items[selectedIndex]) {
        items[selectedIndex].classList.add('active');
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
}

function positionSuggestions() {
    const rect = barangayInput.getBoundingClientRect();
    suggestionsList.style.position = 'absolute';
    suggestionsList.style.left = `${rect.left + window.scrollX}px`;
    suggestionsList.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionsList.style.width = `${rect.width}px`;
    suggestionsList.style.zIndex = 10000;
    suggestionsList.style.background = '#222';
    suggestionsList.style.border = '1px solid #444';
    suggestionsList.style.borderRadius = '6px';
    suggestionsList.style.maxHeight = '180px';
    suggestionsList.style.overflowY = 'auto';
    suggestionsList.style.margin = '0';
    suggestionsList.style.padding = '0';
    suggestionsList.style.listStyle = 'none';
    suggestionsList.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)';
}

function resetSuggestionsStyle() {
    suggestionsList.style.position = '';
    suggestionsList.style.left = '';
    suggestionsList.style.top = '';
    suggestionsList.style.width = '';
    suggestionsList.style.zIndex = '';
    suggestionsList.style.background = '';
    suggestionsList.style.border = '';
    suggestionsList.style.borderRadius = '';
    suggestionsList.style.maxHeight = '';
    suggestionsList.style.overflowY = '';
    suggestionsList.style.margin = '';
    suggestionsList.style.padding = '';
    suggestionsList.style.listStyle = '';
    suggestionsList.style.boxShadow = '';
}

document.addEventListener('mousedown', (event) => {
    if (event.target !== barangayInput && !suggestionsList.contains(event.target)) {
        suggestionsList.classList.add('hidden');
        resetSuggestionsStyle();
    }
});

//BARANGAY AUTOCOMPLETE  END

// --- Station Barangay Autocomplete (separate instance) ---
const stationBarangayInput = document.getElementById('stationBarangay');
const stationSuggestionsList = document.getElementById('station-suggestions');
let stationSelectedIndex = -1;
let stationFilteredBarangays = [];

function filterStationBarangays() {
    if (!stationBarangayInput || !stationSuggestionsList) return;
    const input = stationBarangayInput.value.trim().toLowerCase();
    stationSuggestionsList.innerHTML = '';
    stationFilteredBarangays = [];

    if (!input) {
        stationSuggestionsList.classList.add('hidden');
        resetStationSuggestionsStyle();
        return;
    }

    stationFilteredBarangays = barangays.filter(barangay =>
        barangay.toLowerCase().includes(input)
    );

    stationFilteredBarangays.forEach((barangay, index) => {
        const li = document.createElement('li');
        li.textContent = barangay;
        li.className = 'suggestion-item';
        li.tabIndex = -1;
        li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectStationBarangay(barangay);
        });
        li.addEventListener('mouseenter', () => {
            stationSelectedIndex = index;
            updateStationActiveItem();
        });
        stationSuggestionsList.appendChild(li);
    });

    if (stationFilteredBarangays.length > 0) {
        stationSuggestionsList.classList.remove('hidden');
        positionStationSuggestions();
        stationSelectedIndex = 0;
        updateStationActiveItem();
    } else {
        stationSuggestionsList.classList.add('hidden');
        resetStationSuggestionsStyle();
    }
}

function selectStationBarangay(barangay) {
    stationBarangayInput.value = barangay;
    stationSuggestionsList.classList.add('hidden');
    stationSuggestionsList.innerHTML = '';
}

function handleStationKeydown(event) {
    const items = stationSuggestionsList.getElementsByTagName('li');
    if (!items.length || stationSuggestionsList.classList.contains('hidden')) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        stationSelectedIndex = (stationSelectedIndex + 1) % items.length;
        updateStationActiveItem();
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        stationSelectedIndex = (stationSelectedIndex - 1 + items.length) % items.length;
        updateStationActiveItem();
    } else if (event.key === 'Enter') {
        if (stationSelectedIndex > -1) {
            event.preventDefault();
            selectStationBarangay(items[stationSelectedIndex].textContent);
        }
    } else if (event.key === 'Tab') {
        if (items.length > 0 && stationSelectedIndex > -1) {
            selectStationBarangay(items[stationSelectedIndex].textContent);
            event.preventDefault();
        }
    }
}

function updateStationActiveItem() {
    const items = stationSuggestionsList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    if (stationSelectedIndex > -1 && items[stationSelectedIndex]) {
        items[stationSelectedIndex].classList.add('active');
        items[stationSelectedIndex].scrollIntoView({ block: 'nearest' });
    }
}

function positionStationSuggestions() {
    const rect = stationBarangayInput.getBoundingClientRect();
    stationSuggestionsList.style.position = 'absolute';
    stationSuggestionsList.style.left = `${rect.left + window.scrollX}px`;
    stationSuggestionsList.style.top = `${rect.bottom + window.scrollY}px`;
    stationSuggestionsList.style.width = `${rect.width}px`;
    stationSuggestionsList.style.zIndex = 10000;
    stationSuggestionsList.style.background = '#222';
    stationSuggestionsList.style.border = '1px solid #444';
    stationSuggestionsList.style.borderRadius = '6px';
    stationSuggestionsList.style.maxHeight = '180px';
    stationSuggestionsList.style.overflowY = 'auto';
    stationSuggestionsList.style.margin = '0';
    stationSuggestionsList.style.padding = '0';
    stationSuggestionsList.style.listStyle = 'none';
    stationSuggestionsList.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)';
}

function resetStationSuggestionsStyle() {
    stationSuggestionsList.style.position = '';
    stationSuggestionsList.style.left = '';
    stationSuggestionsList.style.top = '';
    stationSuggestionsList.style.width = '';
    stationSuggestionsList.style.zIndex = '';
    stationSuggestionsList.style.background = '';
    stationSuggestionsList.style.border = '';
    stationSuggestionsList.style.borderRadius = '';
    stationSuggestionsList.style.maxHeight = '';
    stationSuggestionsList.style.overflowY = '';
    stationSuggestionsList.style.margin = '';
    stationSuggestionsList.style.padding = '';
    stationSuggestionsList.style.listStyle = '';
    stationSuggestionsList.style.boxShadow = '';
}

document.addEventListener('mousedown', (event) => {
    if (
        stationBarangayInput &&
        stationSuggestionsList &&
        event.target !== stationBarangayInput &&
        !stationSuggestionsList.contains(event.target)
    ) {
        stationSuggestionsList.classList.add('hidden');
        resetStationSuggestionsStyle();
    }
});

// Apparatus assignment mapping (updated to match your new format)
const apparatusByStation = {
    "Zamboanga City Central Fire Station, ZCFD": [
        "Engine 23",
        "Engine 36",
        "Engine 01"
    ],
    "Ayala Fire Sub-Station, ZCFD": [
        "Engine 33"
    ],
    "Boalan Fire Sub-Station, ZCFD": [
        "Engine 11"
    ],
    "Buenavista Fire Sub-Station, ZCFD": [
        "Engine 16"
    ],
    "Cabaluay Fire Sub-Station, ZCFD": [
        "ZCDRRMO FT"
    ],
    "Calarian Fire Sub-Station, ZCFD": [
        "Engine 30"
    ],
    "Culianan Fire Sub-Station, ZCFD": [
        "Engine 32"
    ],
    "Guiwan Fire Sub-Station, ZCFD": [
        "Engine 09"
    ],
    "Labuan Fire Sub-Station, ZCFD": [
        "Engine 24"
    ],
    "Lunzuran Fire Sub-Station, ZCFD": [
        "Engine 27"
    ],
    "Mampang Fire Sub-Station, ZCFD": [
        "Engine 25"
    ],
    "Manicahan Fire Sub-Station, ZCFD": [
        "Engine 29"
    ],
    "Mercedes Fire Sub-Station, ZCFD": [
        "Engine 28"
    ],
    "Pasonanca Fire Sub-Station, ZCFD": [
        "Engine 13"
    ],
    "Putik Fire Sub-Station, ZCFD": [
        "Engine 20"
    ],
    "Quiniput Fire Sub-Station, ZCFD": [
        "Engine 18"
    ],
    "Recodo Fire Sub-Station, ZCFD": [
        "Engine 14"
    ],
    "Sangali Fire Sub-Station, ZCFD": [
        "Engine 34"
    ],
    "San Jose Gusu Fire Sub-Station, ZCFD": [
        "Engine 19"
    ],
    "San Roque Fire Sub-Station, ZCFD": [
        "Engine 10"
    ],
    "Sta Catalina Fire Sub-Station, ZCFD": [
        "Engine 35"
    ],
    "Sta Maria Fire Sub-Station, ZCFD": [
        "Engine 26",
        "Engine 02",
        "Engine 04"
    ],
    "Talisayan Fire Sub-Station, ZCFD": [
        "Engine 15",
        "Engine 22"
    ],
    "Talon-Talon Fire Sub-Station, ZCFD": [
        "Engine 12"
    ],
    "Tetuan Fire Sub-Station, ZCFD": [
        "Engine 05"
    ],
    "Tumaga Fire Sub-Station, ZCFD": [
        "Engine 03"
    ],
    "Tugbungan Fire Sub-Station, ZCFD": [
        "Engine 08"
    ],
    "Tigbalabag Fire Sub-Station, ZCFD": [
        "Engine 07"
    ],
    "Vitali Fire Sub-Station, ZCFD": [
        "Engine 31"
    ],
    "Special Rescue Force, ZCFD": [
        "Rescue Truck"
    ],
    "Emergency Medical Services, ZCFD": [
        "Ambulance"
    ],
    "Zamboanga City Fire District": [
        "Toyota Rush",
        "Toyota Hilux"
    ]
}; // <-- Add this closing brace to end the object

// Update apparatus dropdown based on selected AOR
document.addEventListener('DOMContentLoaded', function() {
    const aorSelect = document.getElementById('aor');
    const apparatusSelect = document.getElementById('apparatus');
    const shiftSelect = document.getElementById('station');

    function resetSelect(select, placeholder, keepOptions) {
        if (keepOptions) {
            select.selectedIndex = 0;
        } else {
            select.innerHTML = `<option value="" disabled selected hidden>${placeholder}</option>`;
        }
    }

    if (aorSelect && apparatusSelect && shiftSelect) {
        // Set initial placeholders
        resetSelect(shiftSelect, 'Choose Fire Station');
        resetSelect(apparatusSelect, 'Choose Fire Station');

        aorSelect.addEventListener('change', function() {
            const selectedAor = aorSelect.value;
            // Always reset both selects
            resetSelect(shiftSelect, 'Choose Fire Station');
            resetSelect(apparatusSelect, 'Choose Fire Station');

            if (selectedAor === "Intelligence and Investigation Section, ZCFD") {
                // Only shift enabled, apparatus disabled
                shiftSelect.disabled = false;
                apparatusSelect.disabled = true;
                shiftSelect.innerHTML = `
                    <option value="" disabled selected hidden>Select Shift</option>
                    <option value="Shift A">A Shift</option>
                    <option value="Shift B">B Shift</option>
                `;
            } else if (selectedAor === "Zamboanga City Fire District") {
                // Both shift and apparatus disabled, keep their placeholders
                shiftSelect.disabled = true;
                apparatusSelect.disabled = true;
                resetSelect(shiftSelect, 'Choose Fire Station');
                resetSelect(apparatusSelect, 'Choose Fire Station');
            } else if (selectedAor) {
                // Both shift and apparatus enabled for other stations
                shiftSelect.disabled = false;
                apparatusSelect.disabled = false;
                shiftSelect.innerHTML = `
                    <option value="" disabled selected hidden>Select Shift</option>
                    <option value="Shift A">A Shift</option>
                    <option value="Shift B">B Shift</option>
                `;
                resetSelect(apparatusSelect, 'Choose Apparatus');
                if (apparatusByStation[selectedAor]) {
                    apparatusByStation[selectedAor].forEach(app => {
                        const option = document.createElement('option');
                        option.value = app;
                        option.textContent = app;
                        apparatusSelect.appendChild(option);
                    });
                }
            } else {
                shiftSelect.disabled = true;
                apparatusSelect.disabled = true;
                resetSelect(shiftSelect, 'Choose Fire Station');
                resetSelect(apparatusSelect, 'Choose Fire Station');
            }
        });

        // On page load, disable shift and apparatus until station is chosen
        shiftSelect.disabled = true;
        apparatusSelect.disabled = true;
    }

});

// Utility to set current datetime-local value to an input by id
function setCurrentDateTime(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const formatted = now.getFullYear() + '-' +
        pad(now.getMonth() + 1) + '-' +
        pad(now.getDate()) + 'T' +
        pad(now.getHours()) + ':' +
        pad(now.getMinutes());
    input.value = formatted;
    // Trigger input event for auto-calc if needed
    input.dispatchEvent(new Event('input'));
}

// Calculate response time in minutes between dispatched and arrived on scene
function updateResponseTime() {
    const dispatched = document.getElementById('datetime-dispatched').value;
    const arrived = document.getElementById('datetime-arrivedonscene').value;
    const responseInput = document.getElementById('responsetime');
    if (dispatched && arrived) {
        const dispatchedDate = new Date(dispatched);
        const arrivedDate = new Date(arrived);
        if (!isNaN(dispatchedDate) && !isNaN(arrivedDate) && arrivedDate > dispatchedDate) {
            const diffMs = arrivedDate - dispatchedDate;
            const diffMin = Math.round(diffMs / 60000);
            responseInput.value = diffMin + " minutes";
        } else {
            responseInput.value = "";
        }
    } else {
        responseInput.value = "";
    }
    responseInput.setAttribute('readonly', 'readonly');
}

document.addEventListener('DOMContentLoaded', function() {
    const dispatchedInput = document.getElementById('datetime-dispatched');
    const arrivedInput = document.getElementById('datetime-arrivedonscene');
    if (dispatchedInput && arrivedInput) {
        dispatchedInput.addEventListener('input', updateResponseTime);
        arrivedInput.addEventListener('input', updateResponseTime);
    }
});


//INVOLVED
const structuralOptions = [
    'Residential','Apartment Building', 'Condominiums', 'Dormitory', 'Hotel', 'Lodging and Rooming Houses', 
    'Assembly', 'Business', 'Detention and Correctional', 
    'Educational', 'Health Care', 'Industrial', 'Mercantile', 'Miscellaneous', 
    'Mixed Occupancies', 'Storage'
];

const nonStructuralOptions = [
    'Agricultural Land', 'Ambulant Vendor', 'Electrical Pole', 'Forest', 'Grass', 'Rubbish', 
    'Aircraft', 'Automobile', 'Bus', 'Heavy Equipment', 'Jeepney', 'Locomotive', 
    'Motorcycle', 'Ship/Watervessel', 'Tricycle', 'Truck'
];

function updateInvolvedOptions() {
    const occupancy = document.getElementById('occupancy').value;
    const involved = document.getElementById('involved');
    
    // Clear previous options
    involved.innerHTML = '<option value="" disabled selected hidden>Choose Occupancy</option>';

    let options = [];
    if (occupancy === 'structural') {
        options = structuralOptions;
    } else if (occupancy === 'non structural') {
        options = nonStructuralOptions;
    }

    if (options.length > 0) {
        involved.disabled = false;
        involved.innerHTML = '<option value="" disabled selected hidden>Choose Involved</option>';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            involved.appendChild(opt);
        });
    } else {
        involved.disabled = true;
        involved.innerHTML = '<option value="" disabled selected hidden>Choose Occupancy</option>';
    }
    // Reset owner if involved changes
    const ownerInput = document.getElementById('owner');
    if (ownerInput) ownerInput.value = '';
}

// Auto-populate owner if involved is "Electrical Pole"
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    const involved = document.getElementById('involved');
    const ownerInput = document.getElementById('owner');
    if (involved && ownerInput) {
        involved.addEventListener('change', function() {
            if (involved.value === 'Electrical Pole') {
                ownerInput.value = 'ZAMCELCO/TELCO';
            }
        });
    }
    // ...existing code...
});

const alarmLevels = [
    "VERIFICATION",
    "FIRST ALARM",
    "SECOND ALARM",
    "THIRD ALARM",
    "FOURTH ALARM",
    "FIFTH ALARM",
    "TASK FORCE ALPHA",
    "TASK FORCE BRAVO",
    "TASK FORCE CHARLIE",
    "TASK FORCE DELTA",
    "TASK FORCE ECHO",
    "GENERAL ALARM"
];

let alarmIndex = 0; // Start at Verification
let isUnderControl = false;
let isFireOut = false;
let isFireOutUponArrival = false;

function updateAlarmStatusDisplay() {
    const label = document.getElementById('alarm-status-label');
    const alarmInput = document.getElementById('alarm');
    const plusBtn = document.getElementById('alarm-plus');
    const underControlBtn = document.getElementById('alarm-under-control');
    const minusBtn = document.getElementById('alarm-minus');

    // Update label and value
    if (isFireOutUponArrival) {
        if (label) label.textContent = "FIRE OUT UPON ARRIVAL";
        if (alarmInput) alarmInput.value = "FIRE OUT UPON ARRIVAL";
    } else if (isFireOut) {
        if (label) label.textContent = "FIRE OUT";
        if (alarmInput) alarmInput.value = "FIRE OUT";
    } else if (isUnderControl) {
        if (label) label.textContent = "FIRE UNDER CONTROL";
        if (alarmInput) alarmInput.value = "FIRE UNDER CONTROL";
    } else {
        if (label) label.textContent = alarmLevels[alarmIndex];
        if (alarmInput) alarmInput.value = alarmIndex === 0 ? "" : alarmLevels[alarmIndex];
    }

    // Button logic
    if (plusBtn) plusBtn.disabled = isUnderControl || isFireOut || isFireOutUponArrival;
    if (underControlBtn) {
        if (isFireOutUponArrival) {
            underControlBtn.textContent = "FIRE OUT";
            underControlBtn.disabled = true;
        } else if (isUnderControl) {
            underControlBtn.textContent = "FIRE OUT";
            underControlBtn.disabled = false;
        } else if (isFireOut) {
            underControlBtn.textContent = "FIRE OUT";
            underControlBtn.disabled = true;
        } else {
            underControlBtn.textContent = "FIRE UNDER CONTROL";
            underControlBtn.disabled = false;
        }
    }
    if (minusBtn) {
        minusBtn.disabled = alarmIndex === 0 && !isUnderControl && !isFireOut && !isFireOutUponArrival;
    }

    // Show current alarm details above the buttons
    const detailsDiv = document.getElementById('alarm-current-details');
    if (detailsDiv) {
        let entry = null;
        if (isFireOutUponArrival) {
            const logEntries = document.querySelectorAll('#alarm-log-container .alarm-log-entry');
            entry = logEntries[logEntries.length - 1];
        } else if (isFireOut) {
            const logEntries = document.querySelectorAll('#alarm-log-container .alarm-log-entry');
            entry = logEntries[logEntries.length - 1];
        } else if (isUnderControl) {
            const logEntries = document.querySelectorAll('#alarm-log-container .alarm-log-entry');
            entry = logEntries[logEntries.length - 1];
        } else if (alarmIndex > 0) {
            const logEntries = document.querySelectorAll('#alarm-log-container .alarm-log-entry');
            entry = logEntries[alarmIndex - 1];
        }
        if (entry) {
            const timeInput = entry.querySelector('input[type="datetime-local"]');
            const icInput = entry.querySelector('input[type="text"]:nth-of-type(1)');
            const desigInput = entry.querySelector('input[type="text"]:nth-of-type(2)');
            detailsDiv.innerHTML = `
                <div class="alarm-current-details-card">
                    <div><b>Time:</b> ${timeInput ? timeInput.value : ''}</div>
                    <div><b>Ground Commander:</b> ${icInput ? icInput.value : ''}</div>
                    <div><b>Designation:</b> ${desigInput ? desigInput.value : ''}</div>
                </div>
            `;
        } else {
            detailsDiv.innerHTML = '';
        }
    }
}

// Update details live when user edits the current alarm log entry
document.addEventListener('input', function(e) {
    if (
        e.target.closest('#alarm-log-container .alarm-log-entry') &&
        (
            e.target.type === 'datetime-local' ||
            e.target.type === 'text'
        )
    ) {
        updateAlarmStatusDisplay();
    }
});

function addAlarmLogEntry(alarmName) {
    const container = document.getElementById('alarm-log-container');
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = 'alarm-log-entry';

    // Alarm title as h2
    const title = document.createElement('h2');
    title.textContent = alarmName;
    entry.appendChild(title);

    // Date/Time input
    const dateInput = document.createElement('input');
    dateInput.type = 'datetime-local';
    dateInput.required = true;
    dateInput.style.marginBottom = "8px";
    // Set current datetime as default
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    dateInput.value = now.getFullYear() + '-' +
        pad(now.getMonth() + 1) + '-' +
        pad(now.getDate()) + 'T' +
        pad(now.getHours()) + ':' +
        pad(now.getMinutes());
    entry.appendChild(dateInput);

    // IC and Designation side by side
    const icDesigRow = document.createElement('div');
    icDesigRow.className = 'ic-desig-row';

    // Incident Commander
    const icDiv = document.createElement('div');
    const icLabel = document.createElement('label');
    icLabel.textContent = 'Incident Commander:';
    icLabel.setAttribute('for', `ic-${container.children.length}`);
    icDiv.appendChild(icLabel);
    const icInput = document.createElement('input');
    icInput.type = 'text';
    icInput.id = `ic-${container.children.length}`;
    icInput.required = true;
    icDiv.appendChild(icInput);

    // Designation
    const desigDiv = document.createElement('div');
    const desigLabel = document.createElement('label');
    desigLabel.textContent = 'Designation:';
    desigLabel.setAttribute('for', `desig-${container.children.length}`);
    desigDiv.appendChild(desigLabel);
    const desigInput = document.createElement('input');
    desigInput.type = 'text';
    desigInput.id = `desig-${container.children.length}`;
    desigInput.required = true;
    desigDiv.appendChild(desigInput);

    icDesigRow.appendChild(icDiv);
    icDesigRow.appendChild(desigDiv);

    entry.appendChild(icDesigRow);

    container.appendChild(entry);
}

function removeLastAlarmLogEntry() {
    const container = document.getElementById('alarm-log-container');
    if (container && container.lastElementChild) {
        container.removeChild(container.lastElementChild);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    updateAlarmStatusDisplay();

    const plusBtn = document.getElementById('alarm-plus');
    const minusBtn = document.getElementById('alarm-minus');
    const underControlBtn = document.getElementById('alarm-under-control');

    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            if (isUnderControl || isFireOut || isFireOutUponArrival) return;
            if (alarmIndex < alarmLevels.length - 1) {
                alarmIndex++;
                updateAlarmStatusDisplay();
                addAlarmLogEntry(alarmLevels[alarmIndex]);
            }
        });
    }
    if (minusBtn) {
        minusBtn.addEventListener('click', function() {
            if (isFireOut) {
                // Remove Fire Out card
                const container = document.getElementById('alarm-log-container');
                if (container && container.lastElementChild) {
                    container.removeChild(container.lastElementChild);
                }
                isFireOut = false;
                updateAlarmStatusDisplay();
                return;
            }
            if (isUnderControl) {
                // Remove Under Control card
                const container = document.getElementById('alarm-log-container');
                if (container && container.lastElementChild) {
                    container.removeChild(container.lastElementChild);
                }
                isUnderControl = false;
                updateAlarmStatusDisplay();
                return;
            }
            if (isFireOutUponArrival) {
                // Remove Fire Out Upon Arrival card
                const container = document.getElementById('alarm-log-container');
                if (container && container.lastElementChild) {
                    container.removeChild(container.lastElementChild);
                }
                isFireOutUponArrival = false;
                updateAlarmStatusDisplay();
                return;
            }
            if (alarmIndex > 0) {
                removeLastAlarmLogEntry();
                alarmIndex--;
                updateAlarmStatusDisplay();
            }
        });
    }
    if (underControlBtn) {
        underControlBtn.addEventListener('click', function() {
            if (alarmIndex === 0 && !isUnderControl && !isFireOut && !isFireOutUponArrival) {
                // No alarm raised, treat as Fire Out Upon Arrival
                isFireOutUponArrival = true;
                addAlarmLogEntry("FIRE OUT UPON ARRIVAL");
                updateAlarmStatusDisplay();
            } else if (!isUnderControl && !isFireOut && !isFireOutUponArrival) {
                // Add Fire Under Control card
                isUnderControl = true;
                addAlarmLogEntry("FIRE UNDER CONTROL");
                updateAlarmStatusDisplay();
            } else if (isUnderControl && !isFireOut && !isFireOutUponArrival) {
                // Add Fire Out card
                isFireOut = true;
                addAlarmLogEntry("FIRE OUT");
                updateAlarmStatusDisplay();
            }
        });
    }

    // --- Fire Investigator and FCOS auto-populate logic ---
    const aorSelect = document.getElementById('aor');
    const shiftSelect = document.getElementById('station');
    const faiContainer = document.querySelector('.fai-detailscontainer');
    const fcosNameInput = document.getElementById('fcos-name');
    const fcosContactInput = document.getElementById('fcos-contact');

    // Fire Investigator options
    const shiftAInvestigators = [
        "SFO1 Francis F Atilano",
        "FO2 Nashier K Paris",
        "FO1 Christopher Padilla",
        "FO1 Jimfirst B Natividad"
    ];
    const shiftBInvestigators = [
        "SFO1 Luigi P Chan",
        "FO3 Nikko Ralph C Torres",
        "FO3 Mohammad Salahuddin"
    ];

    function updateInvestigatorAndFCOS() {
        const aor = aorSelect ? aorSelect.value : "";
        const shift = shiftSelect ? shiftSelect.value : "";

        // Fire Investigator dropdown logic
        const existingDropdown = document.getElementById('fai-dropdown');
        const faiInput = document.getElementById('fai');
        if (aor === "Intelligence and Investigation Section, ZCFD" && (shift === "Shift A" || shift === "Shift B")) {
            // Show dropdown, hide text input
            if (!existingDropdown) {
                const select = document.createElement('select');
                select.id = 'fai-dropdown';
                select.name = 'fai';
                select.required = true;
                select.style.marginBottom = '15px';
                select.innerHTML = '<option value="" disabled selected hidden>Select Investigator</option>';
                // Insert before the original input
                faiInput.style.display = 'none';
                faiInput.parentNode.insertBefore(select, faiInput);
            }
            const dropdown = document.getElementById('fai-dropdown');
            dropdown.innerHTML = '<option value="" disabled selected hidden>Select Investigator</option>';
            const options = shift === "Shift A" ? shiftAInvestigators : shiftBInvestigators;
            options.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                dropdown.appendChild(opt);
            });
            dropdown.style.display = '';
        } else {
            // Remove dropdown if exists, show text input
            if (existingDropdown) {
                existingDropdown.parentNode.removeChild(existingDropdown);
            }
            if (faiInput) faiInput.style.display = '';
        }

        // FCOS auto-populate for Shift A
        if (aor === "Intelligence and Investigation Section, ZCFD" && shift === "Shift A") {
            if (fcosNameInput) {
                fcosNameInput.value = "SFO1 Jenny Zabala";
                fcosNameInput.readOnly = true;
            }
            if (fcosContactInput) {
                fcosContactInput.value = "(0955) 781 6063";
                fcosContactInput.readOnly = true;
            }
        } else {
            if (fcosNameInput) {
                fcosNameInput.value = "";
                fcosNameInput.readOnly = false;
            }
            if (fcosContactInput) {
                fcosContactInput.value = "";
                fcosContactInput.readOnly = false;
            }
        }
    }

    if (aorSelect && shiftSelect) {
        aorSelect.addEventListener('change', updateInvestigatorAndFCOS);
        shiftSelect.addEventListener('change', updateInvestigatorAndFCOS);
    }

    // --- Dynamic Injured, Fatality, and Missing Details ---
    function createPersonDetailRow(type, index) {
        // type: 'injured' or 'fatality' or 'missing'
        const wrapper = document.createElement('div');
        wrapper.className = 'person-detail-row';
        wrapper.style.marginBottom = '10px';

        // Name
        const nameLabel = document.createElement('label');
        nameLabel.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} #${index + 1} Name:`;
        nameLabel.setAttribute('for', `${type}-name-${index}`);
        wrapper.appendChild(nameLabel);
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = `${type}-name-${index}`;
        nameInput.name = `${type}-name-${index}`;
        nameInput.required = true;
        wrapper.appendChild(nameInput);

        // Age
        const ageLabel = document.createElement('label');
        ageLabel.textContent = 'Age:';
        ageLabel.setAttribute('for', `${type}-age-${index}`);
        wrapper.appendChild(ageLabel);
        const ageInput = document.createElement('input');
        ageInput.type = 'number';
        ageInput.id = `${type}-age-${index}`;
        ageInput.name = `${type}-age-${index}`;
        ageInput.min = 0;
        ageInput.required = true;
        wrapper.appendChild(ageInput);

        // Chief Complaint (skip for missing)
        if (type !== 'missing') {
            const ccLabel = document.createElement('label');
            ccLabel.textContent = 'Chief Complaint:';
            ccLabel.setAttribute('for', `${type}-cc-${index}`);
            wrapper.appendChild(ccLabel);
            const ccInput = document.createElement('textarea');
            ccInput.id = `${type}-cc-${index}`;
            ccInput.name = `${type}-cc-${index}`;
            ccInput.required = true;
            ccInput.rows = 1;
            ccInput.style.overflowY = 'auto';
            ccInput.style.height = '22px';
            ccInput.addEventListener('input', function() {
                ccInput.style.height = '22px';
                ccInput.style.height = Math.min(ccInput.scrollHeight, 120) + 'px';
            });
            wrapper.appendChild(ccInput);
        }

        // Connection
        const connLabel = document.createElement('label');
        connLabel.textContent = 'Connection:';
        connLabel.setAttribute('for', `${type}-conn-${index}`);
        wrapper.appendChild(connLabel);
        const connSelect = document.createElement('select');
        connSelect.id = `${type}-conn-${index}`;
        connSelect.name = `${type}-conn-${index}`;
        connSelect.required = true;
        connSelect.innerHTML = `
            <option value="" disabled selected hidden>Select Connection</option>
            <option value="BFP">BFP</option>
            <option value="Civ">Civilian</option>
        `;
        wrapper.appendChild(connSelect);

        return wrapper;
    }

    function updatePersonDetails(type, count) {
        const containerId =
            type === 'injured'
                ? 'injured-details-container'
                : type === 'fatality'
                ? 'fatality-details-container'
                : 'missing-details-container';
        let container = document.getElementById(containerId);
        if (!container) {
            // Create container for missing if not present
            if (type === 'missing') {
                container = document.createElement('div');
                container.id = 'missing-details-container';
                // Insert after fatality-details-container
                const fatalityContainer = document.getElementById('fatality-details-container');
                if (fatalityContainer && fatalityContainer.parentNode) {
                    fatalityContainer.parentNode.insertBefore(container, fatalityContainer.nextSibling);
                }
            } else {
                return;
            }
        }
        container.innerHTML = '';
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                container.appendChild(createPersonDetailRow(type, i));
            }
            container.style.display = '';
        } else {
            container.style.display = 'none';
        }
    }

    // Setup listeners for casualties and fatalities and missing
    const injuredInput = document.getElementById('casualties-injured');
    const fatalityInput = document.getElementById('casualties-fatality');
    const missingInput = document.getElementById('casualties-missing');

    if (injuredInput) {
        injuredInput.addEventListener('input', function() {
            let val = parseInt(injuredInput.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            injuredInput.value = val;
            updatePersonDetails('injured', val);
        });
        if (injuredInput.value) {
            let val = parseInt(injuredInput.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            injuredInput.value = val;
            updatePersonDetails('injured', val);
        }
    }
    if (fatalityInput) {
        fatalityInput.addEventListener('input', function() {
            let val = parseInt(fatalityInput.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            fatalityInput.value = val;
            updatePersonDetails('fatality', val);
        });
        if (fatalityInput.value) {
            let val = parseInt(fatalityInput.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            fatalityInput.value = val;
            updatePersonDetails('fatality', val);
        }
    }
    if (missingInput) {
        missingInput.addEventListener('input', function() {
            let val = parseInt(missingInput.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            missingInput.value = val;
            updatePersonDetails('missing', val);
        });
        if (missingInput.value) {
            let val = parseInt(missingInput.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            missingInput.value = val;
            updatePersonDetails('missing', val);
        }
    }

    // ...existing code...
});

// Auto-format contact numbers to (####) ### ####
function formatContactNumber(value) {
    // Remove all non-digits
    let digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    // Limit to 11 digits (for PH mobile numbers)
    digits = digits.substring(0, 11);
    // Format: (####) ### ####
    let formatted = '';
    if (digits.length <= 4) {
        formatted = '(' + digits;
    } else if (digits.length <= 7) {
        formatted = '(' + digits.substring(0, 4) + ') ' + digits.substring(4);
    } else {
        formatted = '(' + digits.substring(0, 4) + ') ' + digits.substring(4, 7) + ' ' + digits.substring(7);
    }
    return formatted;
}

function setupContactNumberAutoFormat(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('input', function (e) {
        const caret = input.selectionStart;
        const oldValue = input.value;
        const formatted = formatContactNumber(oldValue);
        input.value = formatted;
        // Try to keep caret at the end
        input.setSelectionRange(input.value.length, input.value.length);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    // Setup auto-format for all contact number fields
    setupContactNumberAutoFormat('contactnumber');
    setupContactNumberAutoFormat('fai-contact');
    setupContactNumberAutoFormat('fcos-contact');
    setupContactNumberAutoFormat('firegroundcommander-contactnumber'); // <-- Add this line

    // --- Injured/Fatality + and - buttons ---
    const injuredInput = document.getElementById('casualties-injured');
    const fatalityInput = document.getElementById('casualties-fatality');
    const injuredPlus = document.getElementById('injured-plus');
    const injuredMinus = document.getElementById('injured-minus');
    const fatalityPlus = document.getElementById('fatality-plus');
    const fatalityMinus = document.getElementById('fatality-minus');

    if (injuredPlus && injuredInput) {
        injuredPlus.addEventListener('click', function() {
            let val = parseInt(injuredInput.value, 10) || 0;
            val++;
            injuredInput.value = val;
            injuredInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }
    if (injuredMinus && injuredInput) {
        injuredMinus.addEventListener('click', function() {
            let val = parseInt(injuredInput.value, 10) || 0;
            if (val > 0) {
                if (confirm('Are you sure you want to decrease the number of injured? This may remove entered details.')) {
                    val--;
                    injuredInput.value = val;
                    injuredInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });
    }
    if (fatalityPlus && fatalityInput) {
        fatalityPlus.addEventListener('click', function() {
            let val = parseInt(fatalityInput.value, 10) || 0;
            val++;
            fatalityInput.value = val;
            fatalityInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }
    if (fatalityMinus && fatalityInput) {
        fatalityMinus.addEventListener('click', function() {
            let val = parseInt(fatalityInput.value, 10) || 0;
            if (val > 0) {
                if (confirm('Are you sure you want to decrease the number of fatalities? This may remove entered details.')) {
                    val--;
                    fatalityInput.value = val;
                    fatalityInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });
    }

    // --- Clipboard Copy on Submit ---
    const form = document.getElementById('rtmsForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Helper to get value by id or fallback
            const val = id => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : '';
            };

            // Apparatus label
            let apparatusLabel = '';
            const apparatusSel = document.getElementById('apparatus');
            if (apparatusSel && !apparatusSel.disabled && apparatusSel.selectedIndex > 0) {
                apparatusLabel = apparatusSel.options[apparatusSel.selectedIndex].text;
            }

            // Shift
            let shiftLabel = '';
            const shiftSel = document.getElementById('station');
            if (shiftSel && !shiftSel.disabled && shiftSel.selectedIndex > 0) {
                shiftLabel = shiftSel.options[shiftSel.selectedIndex].text;
            }

            // AOR
            let aorLabel = '';
            const aorSel = document.getElementById('aor');
            if (aorSel && aorSel.selectedIndex > 0) {
                aorLabel = aorSel.options[aorSel.selectedIndex].text;
            }

            // Barangay
            const barangay = val('barangay');
            const city = val('city');
            const region = val('region');

            // Station Address fields
            const stationAddress = val('stationAddress');
            const stationBarangay = val('stationBarangay');
            const stationCity = val('stationCity');

            //Exact Location
            const exactLocation = val('exactaddress');

            // Date/time fields
            const dtReport = val('datetime-report');
            const dtDispatched = val('datetime-dispatched');
            const dtArrived = val('datetime-arrivedonscene');
            const formatDT = dt => {
                if (!dt) return '';
                const d = new Date(dt);
                if (isNaN(d)) return '';
                const day = d.getDate();
                const month = d.toLocaleString('default', { month: 'long' });
                const year = d.getFullYear();
                const hour = d.getHours().toString().padStart(2, '0');
                const min = d.getMinutes().toString().padStart(2, '0');
                return `${day} ${hour}${min}H ${month} ${year}`;
            };

            // Response time and distance
            const responsetime = val('responsetime');
            const distancetravelled = val('distancetravelled');

            // Involved/Occupancy
            let involved = '';
            const involvedSel = document.getElementById('involved');
            if (involvedSel && !involvedSel.disabled && involvedSel.selectedIndex > 0) {
                involved = involvedSel.options[involvedSel.selectedIndex].text;
            }

            // Owner
            const owner = val('owner');
            const families = val('familiesaffected');
            const individuals = val('individualsaffected');
            const houses = val('housesaffected');
            const floorarea = val('floorarea');

            // Responders (only include if value > 0, no tab/indent)
            const respondersList = [];
            const responderFields = [
                { id: 'bfp-fireengine', label: 'BFP Firetruck' },
                { id: 'bfp-rescue', label: 'BFP Rescue Truck' },
                { id: 'bfp-ambulance', label: 'BFP Ambulance' },
                { id: 'otherfiretrucks', label: 'Aux Firetruck' },
                { id: 'otherrescue', label: 'Aux Rescue' },
                { id: 'otherambulance', label: 'Aux Ambulance' }
            ];
            responderFields.forEach(r => {
                const v = parseInt(val(r.id), 10) || 0;
                if (v > 0) respondersList.push(`${r.label} – ${v}`);
            });

            // Alarm log (no tab, hyphen formatting, compact, and deduplicate name if same as previous)
            let operationalStatus = '';
            const alarmLog = document.querySelectorAll('#alarm-log-container .alarm-log-entry');
            let lastIC = '';
            let lastDesig = '';
            function ordinal(n) {
                if (n === 1) return '1st';
                if (n === 2) return '2nd';
                if (n === 3) return '3rd';
                if (n > 3) return n + 'th';
                return '';
            }
            alarmLog.forEach((entry, idx) => {
                const alarmTitle = entry.querySelector('h2') ? entry.querySelector('h2').textContent : '';
                const dtInput = entry.querySelector('input[type="datetime-local"]');
                let dtStr = '';
                if (dtInput && dtInput.value) {
                    const d = new Date(dtInput.value);
                    if (!isNaN(d)) {
                        const hour = d.getHours().toString().padStart(2, '0');
                        const min = d.getMinutes().toString().padStart(2, '0');
                        dtStr = `${hour}${min}H`;
                    }
                }
                // Use id selectors to reliably get the correct inputs
                const icInput = entry.querySelector('input[id^="ic-"]');
                const desigInput = entry.querySelector('input[id^="desig-"]');
                let icVal = icInput && icInput.value ? icInput.value.trim() : '';
                let desigVal = desigInput && desigInput.value ? desigInput.value.trim() : '';
                let line = '';
                if (alarmTitle && dtStr) {
                    let alarmNum = '';
                    let alarmMatch = alarmTitle.match(/^([A-Z ]*?)ALARM/i);
                    if (alarmMatch) {
                        // e.g. "FIRST ALARM", "SECOND ALARM"
                        let numWord = alarmTitle.split(' ')[0].toUpperCase();
                        let num = 0;
                        if (numWord === 'FIRST') num = 1;
                        else if (numWord === 'SECOND') num = 2;
                        else if (numWord === 'THIRD') num = 3;
                        else if (numWord === 'FOURTH') num = 4;
                        else if (numWord === 'FIFTH') num = 5;
                        else if (numWord === 'GENERAL') num = 0;
                        if (num > 0) alarmNum = `${ordinal(num)} Alarm`;
                        else if (numWord === 'GENERAL') alarmNum = 'General Alarm';
                        else alarmNum = alarmTitle.charAt(0).toUpperCase() + alarmTitle.slice(1).toLowerCase();
                    } else if (alarmTitle.toUpperCase().includes('TASK FORCE')) {
                        // Capitalize first letter of each word
                        alarmNum = alarmTitle.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                    } else if (alarmTitle.toUpperCase().includes('FIRE OUT UPON ARRIVAL')) {
                        alarmNum = 'FOUA';
                    } else if (alarmTitle.toUpperCase().includes('FIRE UNDER CONTROL')) {
                        alarmNum = 'FUC';
                    } else if (alarmTitle.toUpperCase().includes('FIRE OUT')) {
                        alarmNum = 'FO';
                    } else if (alarmTitle.toUpperCase().includes('VERIFICATION')) {
                        alarmNum = 'Verification';
                    } else {
                        alarmNum = alarmTitle.charAt(0).toUpperCase() + alarmTitle.slice(1).toLowerCase();
                    }

                    // Compose line
                    // Use designation and name: by [designation][name], only if present
                    line = `${dtStr} - ${alarmNum} by${desigVal ? ' ' + desigVal : ''}${icVal ? ' ' + icVal : ''}`;
                    lastIC = icVal;
                    lastDesig = desigVal;
                    operationalStatus += line + '\n';
                }
            });

            // Casualties
            const injured = parseInt(val('casualties-injured')) || 0;
            const fatality = parseInt(val('casualties-fatality')) || 0;
            const missing = parseInt(val('casualties-missing')) || 0;

            // ICP
            const icp = val('icplocation');

            // Fire Ground Commander (use new input fields)
            const fgCommander = val('firegroundcommander');
            const fgCommanderContact = val('firegroundcommander-contactnumber');

            // FAI (dropdown or input)
            let fai = '';
            const faiDropdown = document.getElementById('fai-dropdown');
            if (faiDropdown && faiDropdown.value) {
                fai = faiDropdown.value;
            } else {
                fai = val('fai');
            }
            const faiContact = val('fai-contact');

            // FCOS
            const fcosName = val('fcos-name');
            const fcosContact = val('fcos-contact');

            // Injured/Fatality/Missing details
            function getPersonDetails(type, count) {
                let details = [];
                for (let i = 0; i < count; i++) {
                    const name = val(`${type}-name-${i}`);
                    const age = val(`${type}-age-${i}`);
                    const cc = val(`${type}-cc-${i}`);
                    const connSel = document.getElementById(`${type}-conn-${i}`);
                    const conn = connSel && connSel.selectedIndex > 0 ? connSel.options[connSel.selectedIndex].text : '';
                    let gender = '';
                    // For missing, only include name, age, conn (no cc)
                    if (type === 'missing') {
                        let line = [name, gender, age, conn].filter(Boolean).join(', ');
                        if (line) details.push(`- ${line}`);
                    } else {
                        let line = [name, gender, age, cc, conn].filter(Boolean).join(', ');
                        if (line) details.push(`- ${line}`);
                    }
                }
                return details;
            }

            let injuredDetails = '';
            if (injured > 0) {
                const arr = getPersonDetails('injured', injured).map(s => s.trim()).filter(Boolean);
                if (arr.length > 0) injuredDetails = arr.join('\n');
            }
            let fatalityDetails = '';
            if (fatality > 0) {
                const arr = getPersonDetails('fatality', fatality).map(s => s.trim()).filter(Boolean);
                if (arr.length > 0) fatalityDetails = arr.join('\n');
            }
            let missingDetails = '';
            if (missing > 0) {
                const arr = getPersonDetails('missing', missing).map(s => s.trim()).filter(Boolean);
                if (arr.length > 0) missingDetails = arr.join('\n');
            }

            // Compose output
            const output =
`FS: ${apparatusLabel}${apparatusLabel ? ',' : ''} ${shiftLabel}${shiftLabel ? ',' : ''} ${aorLabel}${aorLabel ? ',' : ' '} ${stationAddress}${stationAddress ? ", " : ""}Barangay ${stationBarangay}${stationCity ? ', ' + stationCity : ''}

IPO: Fire Incident at ${exactLocation}${exactLocation ? ', ' : ''}Barangay ${barangay}, ${city}

DTR: ${formatDT(dtReport)}
TED: ${formatDT(dtDispatched)}
TAS: ${formatDT(dtArrived)}
RT: ${responsetime}
DIST: ${distancetravelled}${distancetravelled ? ' km' : ''}
Involved: ${involved}
Owners: ${owner}
Family: ${families}
Individuals: ${individuals}
Structure Burned: ${houses}
FA: ${floorarea}${floorarea ? ' sqm' : ''}

Responders:
${respondersList.length > 0 ? respondersList.map(r => '          ' + r).join('\n') : ''}

Operational Status:
${operationalStatus.trim().split('\n').map(line => '          ' + line).join('\n')}

Casualties: ${injured + fatality}
A. Injured: ${injured}${injuredDetails ? '\n          ' + injuredDetails.replace(/\n/g, '\n          ') : ''}
B. Fatality: ${fatality}${fatalityDetails ? '\n          ' + fatalityDetails.replace(/\n/g, '\n          ') : ''}
C. Missing: ${missing}${missingDetails ? '\n          ' + missingDetails.replace(/\n/g, '\n          ') : ''}

ICP: ${icp}

Fire Ground Commander: ${fgCommander}${fgCommanderContact ? '/' + fgCommanderContact : ''}
FAI: ${fai || ''}${faiContact ? '/' + faiContact : ''}
FCOS:
`;

            // Copy to clipboard
            let clipboardOk = false;
            try {
                await navigator.clipboard.writeText(output);
                clipboardOk = true;
            } catch (err) {
                alert('Failed to copy to clipboard. Please copy manually.\n\n' + output);
            }

            // --- Telegram Bot Send ---
            // Replace with your bot token and the actual chat ID of the GC
            const token = '7742982738:AAEKDUd43h9v6-TsZ8fRcfNopn2aDQjr1qY'; // <-- Replace with your bot token
            const chatId = '-1002652410269'; // <-- Replace with actual chat ID (number, not link)

            if (token === 'YOUR_BOT_TOKEN' || chatId === 'YOUR_CHAT_ID') {
                alert('Please set your Telegram bot token and chat ID in the code.');
                return;
            }

            let telegramOk = false;
            try {
                const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: output
                    })
                });
                const data = await res.json();
                if (data.ok) {
                    telegramOk = true;
                } else {
                    alert('Failed to send to Telegram GC.');
                }
            } catch (err) {
                alert('Network error. Try again.');
            }

            if (clipboardOk && telegramOk) {
                alert('Form data copied to clipboard and sent to Telegram GC!');
            } else if (clipboardOk) {
                alert('Form data copied to clipboard.');
            } else if (telegramOk) {
                alert('Details sent to Telegram GC!');
            }
        });
    }

    // Prevent negative values for BFP Responders, Auxiliary, families, individuals, houses, floor area
    const zeroMinIds = [
        'bfp-fireengine', 'bfp-rescue', 'bfp-ambulance',
        'otherfiretrucks', 'otherrescue', 'otherambulance',
        'familiesaffected', 'individualsaffected', 'housesaffected', 'floorarea'
    ];
    zeroMinIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute('min', '0');
            el.addEventListener('input', function() {
                let val = parseInt(el.value, 10);
                if (isNaN(val) || val < 0) el.value = 0;
            });
        }
    });

    // ...existing code...
});

