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

// Apparatus assignment mapping
const apparatusByStation = {
    "Zamboanga City Central Fire Station, ZCFD": [
        "Rosenbauer FT FE23 (FIRST-DUE)",
        "Hino FT FE36 (FIRST-DUE)",
        "Isuzu Morita Super Tanker FE01 (SECOND-DUE)"
    ],
    "Ayala Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FE33 (FIRST-DUE)"
    ],
    "Boalan Fire Sub-Station, ZCFD": [
        "Isuzu Anos Pumper FT FE11 (FIRST-DUE)"
    ],
    "Buenavista Fire Sub-Station, ZCFD": [
        "Isuzu Morita FT FE16 (FIRST-DUE)"
    ],
    "Cabaluay Fire Sub-Station, ZCFD": [
        "ZCDRRMO FT (FIRST-DUE)"
    ],
    "Calarian Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE30 (FIRST-DUE)"
    ],
    "Culianan Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE32 (FIRST-DUE)"
    ],
    "Guiwan Fire Sub-Station, ZCFD": [
        "Isuzu Anos Pumper FT FE09 (FIRST-DUE)"
    ],
    "Labuan Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE24 (FIRST-DUE)"
    ],
    "Lunzuran Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE27 (FIRST-DUE)"
    ],
    "Mampang Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE25 (FIRST-DUE)"
    ],
    "Manicahan Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE29 (FIRST-DUE)"
    ],
    "Mercedes Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE28 (FIRST-DUE)"
    ],
    "Pasonanca Fire Sub-Station, ZCFD": [
        "Isuzu Brake Squirt FE13 (FIRST-DUE)"
    ],
    "Putik Fire Sub-Station, ZCFD": [
        "Foton FT FE20 (FIRST-DUE)"
    ],
    "Quiniput Fire Sub-Station, ZCFD": [
        "Isuzu Anos Pumper FT FE18 (FIRST-DUE)"
    ],
    "Recodo Fire Sub-Station, ZCFD": [
        "Hino Pumper FT FE14 (FIRST-DUE)"
    ],
    "Sangali Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE34 (FIRST-DUE)"
    ],
    "San Jose Gusu Fire Sub-Station, ZCFD": [
        "Kia Anos Penetrator FT FE19 (FIRST-DUE)"
    ],
    "San Roque Fire Sub-Station, ZCFD": [
        "Rosenbauer FT FE10 (FIRST-DUE)"
    ],
    "Sta Catalina Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE35 (FIRST-DUE)"
    ],
    "Sta Maria Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE26 (FIRST-DUE)",
        "Isuzu Morita Super Tanker FE02 (SECOND-DUE)",
        "Isuzu Morita Aerial Platform FE04 (SECOND-DUE)"
    ],
    "Talisayan Fire Sub-Station, ZCFD": [
        "Isuzu Morita Pumper FT FE15 (FIRST-DUE)",
        "Lighting Tower FE22 (SECOND-DUE)"
    ],
    "Talon-Talon Fire Sub-Station, ZCFD": [
        "Foton Pumper FT FE12 (FIRST-DUE)"
    ],
    "Tetuan Fire Sub-Station, ZCFD": [
        "Hino Pumper FT FE05 (FIRST-DUE)"
    ],
    "Tumaga Fire Sub-Station, ZCFD": [
        "Isuzu Pumper FT FE03 (FIRST-DUE)"
    ],
    "Tugbungan Fire Sub-Station, ZCFD": [
        "Foton Pumper FT FE08 (FIRST-DUE)"
    ],
    "Tigbalabag Fire Sub-Station, ZCFD": [
        "Hino Nikki Pumper FT FE07 (FIRST-DUE)"
    ],
    "Vitali Fire Sub-Station, ZCFD": [
        "Isuzu 6-wheeler FT FE31 (FIRST-DUE)"
    ],
    "Special Rescue Force, ZCFD": [
        "Isuzu Morita Rescue Truck"
    ],
    "Emergency Medical Services, ZCFD": [
        "Ambulance"
    ],
    "Zamboanga City Fire District": [
        "Toyota Rush",
        "Toyota Hilux"
    ]
    // Add more if needed
};

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
                // Only show shift placeholder and options, do not change placeholder
                shiftSelect.innerHTML = `
                    <option value="" disabled selected hidden>Select Shift</option>
                    <option value="Shift A">A Shift</option>
                    <option value="Shift B">B Shift</option>
                `;
            } else if (selectedAor === "Zamboanga City Fire District") {
                // Both shift and apparatus disabled, keep their placeholders
                shiftSelect.disabled = true;
                apparatusSelect.disabled = true;
                // Keep placeholder as "Choose Station First"
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
                        const engineMatch = app.match(/(FE\d{2})/);
                        const label = engineMatch ? `Engine ${engineMatch[1].replace('FE', '')}` : app;
                        const option = document.createElement('option');
                        option.value = app;
                        option.textContent = label;
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

    // ...existing code...
});

