// Textarea auto-resize
const respondingTeamTextarea = document.getElementById('respondingTeam');

respondingTeamTextarea.addEventListener('input', () => {
    // Reset height to recalculate based on new content
    respondingTeamTextarea.style.height = 'auto';
    // Set height based on the scroll height of the content
    respondingTeamTextarea.style.height = respondingTeamTextarea.scrollHeight + 'px';
});

// Trigger input event to adjust height on load (if there's already content)
respondingTeamTextarea.dispatchEvent(new Event('input'));

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

function filterBarangays() {
    const input = barangayInput.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (!input) {
    suggestionsList.classList.add('hidden');
    return;
    }

    const filtered = barangays.filter(barangay => 
    barangay.toLowerCase().includes(input)
    );

    filtered.forEach((barangay, index) => {
    const li = document.createElement('li');
    li.textContent = barangay;
    li.addEventListener('click', () => selectBarangay(barangay));
    suggestionsList.appendChild(li);
    });

    if (filtered.length > 0) {
    suggestionsList.classList.remove('hidden');
    positionSuggestions();

    // Pre-select the first item by default
    selectedIndex = 0;
    updateActiveItem(suggestionsList.getElementsByTagName('li'));
    } else {
    suggestionsList.classList.add('hidden');
    }
}

function selectBarangay(barangay) {
    barangayInput.value = barangay;
    suggestionsList.classList.add('hidden');
}

function handleKeydown(event) {
    const items = suggestionsList.getElementsByTagName('li');

    if (event.key === 'ArrowDown') {
    event.preventDefault();
    selectedIndex = (selectedIndex + 1) % items.length;
    updateActiveItem(items);
    } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    updateActiveItem(items);
    } else if (event.key === 'Enter') {
    if (selectedIndex > -1) {
        event.preventDefault();
        selectBarangay(items[selectedIndex].textContent);
    }
    } else if (event.key === 'Tab') {
    if (selectedIndex > -1) {
        // Autocomplete first result on Tab
        selectBarangay(items[selectedIndex].textContent);
        event.preventDefault(); // Prevent tabbing to next element
    }
    }
}

function updateActiveItem(items) {
    for (let i = 0; i < items.length; i++) {
    items[i].classList.remove('active');
    }

    if (selectedIndex > -1) {
    items[selectedIndex].classList.add('active');
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
}

function positionSuggestions() {
    const rect = barangayInput.getBoundingClientRect();
    suggestionsList.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionsList.style.left = `${rect.left + window.scrollX}px`;
    suggestionsList.style.width = `${rect.width}px`;
}

document.addEventListener('click', (event) => {
    if (event.target !== barangayInput) {
    suggestionsList.classList.add('hidden');
    }
});

//INVOLVED
const structuralOptions = [
    'Apartment Building', 'Condominiums', 'Dormitory', 'Hotel', 'Lodging and Rooming Houses', 
    'Single and Two Family Dwelling', 'Assembly', 'Business', 'Detention and Correctional', 
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
    involved.innerHTML = '<option value=""></option>';

    let options = [];
    if (occupancy === 'structural') {
        options = structuralOptions;
    } else if (occupancy === 'non structural') {
        options = nonStructuralOptions;
    }

    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        involved.appendChild(opt);
    });
}

// Format phone numbers to (0975) 993 2701 format
function formatPhoneInput(input) {
    // Remove all non-numeric characters
    let cleaned = input.value.replace(/\D+/g, '');

    // Limit to 11 digits
    if (cleaned.length > 11) {
        cleaned = cleaned.slice(0, 11);
    }

    // Format as (0975) 993 2701
    let formatted = '';
    if (cleaned.length >= 4) {
        formatted += `(${cleaned.slice(0, 4)}) `;
        if (cleaned.length >= 7) {
            formatted += `${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
        } else {
            formatted += `${cleaned.slice(4)}`;
        }
    } else {
        formatted = cleaned;
    }

    input.value = formatted;
}

// Format phone number to (0975) 993 2701 format
function formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D+/g, '');

    // Limit to 11 digits
    if (cleaned.length > 11) {
        cleaned = cleaned.slice(0, 11);
    }

    // Format as (0975) 993 2701
    let formatted = '';
    if (cleaned.length >= 4) {
        formatted += `(${cleaned.slice(0, 4)}) `;
        if (cleaned.length >= 7) {
            formatted += `${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
        } else {
            formatted += `${cleaned.slice(4)}`;
        }
    } else {
        formatted = cleaned;
    }

    return formatted;
}

// Format date and time to "HHMMH of DD Mmmm YYYY"
function formatDateTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}H of ${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`;
}

// Function to format damage input to "P1,000,000.00" format
function formatDamageInput(input) {
    // Get the cursor position
    const cursorPosition = input.selectionStart;

    // Remove all non-numeric characters except for the decimal point
    let cleaned = input.value.replace(/[^0-9.]/g, '');

    // Split the cleaned value into integer and decimal parts
    let parts = cleaned.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] ? parts[1].slice(0, 2) : '';

    // Format the integer part with commas
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Ensure there are always two decimal places
    if (decimalPart.length < 2) {
        decimalPart = decimalPart.padEnd(2, '0');
    }

    // Combine the integer and decimal parts
    let formatted = `₱${integerPart}.${decimalPart}`;

    // Add "more or less" if the amount is greater than 0
    if (parseFloat(cleaned) > 0) {
        formatted += " more or less";
    }

    // Update the input value
    input.value = formatted;

    // Restore the cursor position
    input.setSelectionRange(cursorPosition, cursorPosition);
}

// Function to submit and copy to clipboard
function submitInitial() {
    console.log('submitInitial function called'); // Debugging line
    const data = {
        aor: document.getElementById('aor').value,
        involved: document.getElementById('involved').value,
        occupancy: document.getElementById('occupancy').value,
        location: document.getElementById('location').value,
        barangay: document.getElementById('barangay').value,
        city: document.getElementById('city').value,
        region: document.getElementById('region').value,
        timeAndDateReported: formatDateTime(new Date(document.getElementById('dateTimeReported').value)),
        timeAndDateOfArrival: formatDateTime(new Date(document.getElementById('timeArrival').value)),
        timeAndDateOfFireOut: formatDateTime(new Date(document.getElementById('timeFireOut').value)),
        alarm: document.getElementById('alarm').value,
        commander: document.getElementById('commander').value,
        commanderContact: formatPhoneNumber(document.getElementById('commanderContact').value),
        sender: document.getElementById('sender').value,
        senderContact: formatPhoneNumber(document.getElementById('senderContact').value),
        respondingTeam: document.getElementById('respondingTeam').value
    };

    const report = `Initial Report

${data.aor}, reporting a ${data.occupancy} fire incident at ${data.location}, Barangay ${data.barangay}, ${data.city}, ${data.region}

Responding Team:
${data.respondingTeam}

Time/Date Reported: ${data.timeAndDateReported}
Involved: ${data.involved}
Alarm Status: ${data.alarm}
Time of Arrival: ${data.timeAndDateOfArrival}
Fire Out: ${data.timeAndDateOfFireOut}

Ground Commander: ${data.commander} ${data.commanderContact}
Sender: ${data.sender} ${data.senderContact}`;

    // Copy to clipboard
    navigator.clipboard.writeText(report).then(() => {
        alert('Initial report copied to clipboard!');
    });
}

// Function to submit progress and copy to clipboard
function submitProgress() {
    console.log('submitProgress function called'); // Debugging line
    const data = {
        aor: document.getElementById('aor').value,
        involved: document.getElementById('involved').value,
        occupancy: document.getElementById('occupancy').value,
        location: document.getElementById('location').value,
        barangay: document.getElementById('barangay').value,
        city: document.getElementById('city').value,
        region: document.getElementById('region').value,
        timeAndDateReported: formatDateTime(new Date(document.getElementById('dateTimeReported').value)),
        timeAndDateOfArrival: formatDateTime(new Date(document.getElementById('timeArrival').value)),
        timeAndDateOfFireOut: formatDateTime(new Date(document.getElementById('timeFireOut').value)),
        alarm: document.getElementById('alarm').value,
        commander: document.getElementById('commander').value,
        commanderContact: formatPhoneNumber(document.getElementById('commanderContact').value),
        sender: document.getElementById('sender').value,
        senderContact: formatPhoneNumber(document.getElementById('senderContact').value),
        respondingTeam: document.getElementById('respondingTeam').value,
        noofestablishment: document.getElementById('noofestablishment').value,
        nooffamilies: document.getElementById('nooffamilies').value,
        responders: document.getElementById('responders').value,
        nameofestablishment: document.getElementById('nameofestablishment').value,
        sqm: document.getElementById('sqm').value,
        owner: document.getElementById('owner').value,
        damage: document.getElementById('damage').value,
        fatality: document.getElementById('fatality').value,
        injured: document.getElementById('injured').value
    };

    const report = `Progress Report
    
Time/Date Reported: ${formatDateTime(new Date(document.getElementById('dateTimeReported').value))}
Location: ${data.location}, Barangay ${data.barangay}, ${data.city}, ${data.region}
Name of Owner: ${data.owner}
Alarm Status: ${data.alarm}
Time of Arrival: ${formatDateTime(new Date(document.getElementById('timeArrival').value))}
Fire Out: ${formatDateTime(new Date(document.getElementById('timeFireOut').value))}

Estimated Damage: ${data.damage}
Fatality: ${data.fatality}
Injured: ${data.injured}
Number of House/Establishment: ${data.noofestablishment}
Number of Families: ${data.nooffamilies}
Number of Responders: ${data.responders}

Ground Commander: ${data.commander} ${data.commanderContact}
Sender: ${data.sender} ${data.senderContact}`;

    // Copy to clipboard
    navigator.clipboard.writeText(report).then(() => {
        alert('Progress report copied to clipboard!');
    });
}

// Function to submit complete and copy to clipboard
function submitComplete() {
    console.log('submitComplete function called'); // Debugging line
    const data = {
        aor: document.getElementById('aor').value,
        involved: document.getElementById('involved').value,
        occupancy: document.getElementById('occupancy').value,
        location: document.getElementById('location').value,
        barangay: document.getElementById('barangay').value,
        city: document.getElementById('city').value,
        region: document.getElementById('region').value,
        timeAndDateReported: formatDateTime(new Date(document.getElementById('dateTimeReported').value)),
        timeAndDateOfArrival: formatDateTime(new Date(document.getElementById('timeArrival').value)),
        timeAndDateOfFireOut: formatDateTime(new Date(document.getElementById('timeFireOut').value)),
        alarm: document.getElementById('alarm').value,
        commander: document.getElementById('commander').value,
        commanderContact: formatPhoneNumber(document.getElementById('commanderContact').value),
        sender: document.getElementById('sender').value,
        senderContact: formatPhoneNumber(document.getElementById('senderContact').value),
        respondingTeam: document.getElementById('respondingTeam').value,
        noofestablishment: document.getElementById('noofestablishment').value,
        nooffamilies: document.getElementById('nooffamilies').value,
        responders: document.getElementById('responders').value,
        nameofestablishment: document.getElementById('nameofestablishment').value,
        sqm: document.getElementById('sqm').value,
        owner: document.getElementById('owner').value,
        damage: document.getElementById('damage').value,
        fatality: document.getElementById('fatality').value,
        injured: document.getElementById('injured').value
    };

    const report = `Complete Report

FS: ${data.aor}
IPO: Fire Incident at ${data.location}, Barangay ${data.barangay}, ${data.city}, ${data.region}

DTR: ${data.timeAndDateReported}
TED: 
TAS:
RT:
DIST:
Involved: ${data.involved}
Owner: ${data.owner}
Family:
Individuals:
Structure Burned:
FA: ${data.sqm} sqm
Responders
    BFP FT -
    Ambu -
    Auxuliary -
Operational Status

Casuality:
    Injured: ${data.injured}
    Fatality: ${data.fatality}

IPC:
FAI:
FCOS:
`;

    // Copy to clipboard
    navigator.clipboard.writeText(report).then(() => {
        alert('Complete report copied to clipboard!');
    });
}

const closeModalButton = document.querySelector('.close');
const confirmButton = document.getElementById('confirmApparatus');
const modal = document.getElementById('apparatusModal');
const apparatusListContainer = document.getElementById('apparatusList');
const textarea = document.getElementById('respondingTeam');

// Apparatus List (Sample Data)
const apparatusList = [
'Zamboanga City Central Fire Station, ZCFD, Rosenbauer FT FE23 (FIRST-DUE)',
    'Zamboanga City Central Fire Station, ZCFD, Hino FT FE36 (FIRST-DUE)',
    'Zamboanga City Central Fire Station, ZCFD, Isuzu Morita Super Tanker FE01 (SECOND-DUE)',
    'Ayala FSS, ZCFD, Isuzu 6-wheeler FE33 (FIRST-DUE)',
    
    'Boalan FSS, ZCFD, Isuzu Anos Pumper FT FE11 (FIRST-DUE)',
    'Buenavista FSS, ZCFD, Isuzu Morita FT FE16 (FIRST-DUE)',
    'Cabaluay FSS, ZCFD, ZCDRRMO FT (FIRST-DUE)',
    'Calarian FSS, ZCFD, Isuzu 6-wheeler FT FE30 (FIRST-DUE)',
    'Culianan FSS, ZCFD, Isuzu 6-wheeler FT FE32 (FIRST-DUE)',
    'Guiwan FSS, ZCFD, Isuzu Anos Pumper FT FE09 (FIRST-DUE)',
    'Labuan FSS, ZCFD, Isuzu 6-wheeler FT FE24 (FIRST-DUE)',
  
    'Lunzuran FSS, ZCFD, Isuzu 6-wheeler FT FE27 (FIRST-DUE)',
    'Mampang FSS, ZCFD, Isuzu 6-wheeler FT FE25 (FIRST-DUE)',
    'Manicahan FSS, ZCFD, Isuzu 6-wheeler FT FE29 (FIRST-DUE)',
    'Mercedes FSS, ZCFD, Isuzu 6-wheeler FT FE28 (FIRST-DUE)',
    'Pasonanca FSS, ZCFD, Isuzu Brake Squirt FE13 (FIRST-DUE)',
    'Putik FSS, ZCFD, Foton FT FE20 (FIRST-DUE)',
    'Quiniput FSS, Isuzu Anos Pumper FT FE18 (FIRST-DUE)',
    'Recodo FSS, ZCFD, Hino Pumper FT FE14 (FIRST-DUE)',
    'Sangali FSS, ZCFD, Isuzu 6-wheeler FT FE34 (FIRST-DUE)',
    'San Jose Gusu FSS, ZCFD, Kia Anos Penetrator FT FE19 (FIRST-DUE)',
    'San Roque FSS, ZCFD, Rosenbauer FT FE10 (FIRST-DUE)',
    'Sta. Catalina FSS, ZCFD, Isuzu 6-wheeler FT FE35 (FIRST-DUE)',
    'Sta. Maria FSS, ZCFD, Isuzu 6-wheeler FT FE26 (FIRST-DUE)',
    'Sta. Maria FSS, ZCFD, Isuzu Morita Super Tanker FE02 (SECOND-DUE)',
    'Sta. Maria FSS, ZCFD, Isuzu Morita Aerial Platform FE04 (SECOND-DUE)',
    'Talisayan FSS, ZCFD, Isuzu Morita Pumper FT FE15 (FIRST-DUE)',
    'Talisayan FSS, ZCFD, Lighting Tower FE22 (SECOND-DUE)',
    'Talon-Talon FSS, ZCFD, Foton Pumper FT FE12 (FIRST-DUE)',
    'Tetuan FSS, ZCFD, Hino Pumper FT FE05 (FIRST-DUE)',
    'Tumaga FSS, ZCFD, Isuzu Pumper FT FE03 (FIRST-DUE)',
    'Tugbungan FSS, ZCFD, Foton Pumper FT FE08 (FIRST-DUE)',
    'Tigbalabag FSS, ZCFD, Hino Nikki Pumper FT FE07 (FIRST-DUE)',
    'Vitali FSS, ZCFD, Isuzu 6-wheeler FT FE31 (FIRST-DUE)',
    'Special Rescue Force, ZCFD, Isuzu Morita Rescue Truck',
    'Emergency Medical Services, ZCFD, Ambulance',
    'Zamboanga City Fire District, Toyota Rush',
    'Zamboanga City Fire District, Toyota Hilux',
    'Zamboanga City Disaster Risk Reduction Management Office (ZCDRRMO), Water Tanker',
    'Zamboanga City Disaster Risk Reduction Management Office (ZCDRRMO), EMS',
    'Zamboanga City Water District (ZCWD), Water Tanker',
    'Philippine National Police (PNP)',
    'Bernardo, Water Tanker',
    'Alesson, Water Tanker',
];

let selectedApparatus = [];

// ✅ Open modal and populate list
textarea.addEventListener('click', () => {
showModal();
});

function showModal() {
apparatusListContainer.innerHTML = ''; // Clear previous list
const existingApparatus = textarea.value.split('\n').filter(Boolean);

// Remove (FIRST-DUE) and (SECOND-DUE) for comparison
selectedApparatus = existingApparatus.map(app => app.replace(/\s*\(FIRST-DUE\)|\s*\(SECOND-DUE\)/g, ''));

apparatusList.forEach(item => {
    const container = document.createElement('div');
    container.className = 'apparatus-item';
    container.textContent = item;

    // Mark as selected if it’s already chosen
    if (selectedApparatus.includes(item.replace(/\s*\(FIRST-DUE\)|\s*\(SECOND-DUE\)/g, ''))) {
        container.classList.add('selected');
    }

    // Handle selection toggle
    container.addEventListener('click', () => {
        const normalizedItem = item.replace(/\s*\(FIRST-DUE\)|\s*\(SECOND-DUE\)/g, '');

        if (selectedApparatus.includes(normalizedItem)) {
            selectedApparatus = selectedApparatus.filter(app => app !== normalizedItem);
            container.classList.remove('selected');
        } else {
            selectedApparatus.push(normalizedItem);
            container.classList.add('selected');
        }
    });

    apparatusListContainer.appendChild(container);
});

modal.style.display = 'flex';
}

// ✅ Close modal (on close button)
closeModalButton.addEventListener('click', () => closeModal());

// ✅ Close modal (on click outside)
window.addEventListener('click', (event) => {
if (event.target === modal) {
    closeModal();
}
});

// ✅ Confirm selection and close modal
confirmButton.addEventListener('click', (event) => {
event.preventDefault(); // ✅ Prevent form submission
updateTextarea();
closeModal();
});

function closeModal() {
modal.style.display = 'none';
}

// ✅ Update textarea with selected apparatus
function updateTextarea() {
textarea.value = selectedApparatus.join('\n');
textarea.style.height = 'auto';
textarea.style.height = textarea.scrollHeight + 'px';

const respondersField = document.getElementById('responders');

// ✅ Count BFP FE
const feCount = selectedApparatus.filter(app => /FE\d{2}/.test(app)).length;

// ✅ Count BFP SRF
const srfCount = selectedApparatus.some(app => /Special Rescue Force/.test(app)) ? 1 : 0;

// ✅ Count BFP EMS
const emsCount = selectedApparatus.some(app => /Emergency Medical Services/.test(app)) ? 1 : 0;

// ✅ Final Count: FE + SRF + EMS (if present)
const totalCount = feCount + srfCount + emsCount;

// ✅ Create formatted output
let output = `Total: ${totalCount} \nBFP FE: ${feCount}`;
if (srfCount) output += `\nBFP SRF: ${srfCount}`;
if (emsCount) output += `\nBFP EMS: ${emsCount}`;

// ✅ Update Number of Responders field
respondersField.value = output;

// ✅ Auto-expand the `responders` textarea
respondersField.style.height = 'auto';
respondersField.style.height = respondersField.scrollHeight + 'px';
}



//TEST
