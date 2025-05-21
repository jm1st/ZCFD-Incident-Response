function isNumberKey(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    return charCode >= 48 && charCode <= 57; // Allow only numbers
}

function handlePxDetails(type, containerId) {
    const count = parseInt(document.getElementById(type).value) || 0;
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing entries

    if (count > 0) {
        container.style.display = 'block'; // Show the container
        for (let i = 1; i <= count; i++) {
            const div = document.createElement('div');
            div.style.border = '1px solid #ccc';
            div.style.padding = '10px';
            div.style.marginBottom = '10px';
            div.innerHTML = `
                <label for="${type}Name${i}">${type === 'fatality' ? 'Casualty' : 'Injured'} Name ${i}:</label>
                <input type="text" id="${type}Name${i}" />

                <label for="${type}Age${i}">Age:</label>
                <input type="text" id="${type}Age${i}" />

                <label for="${type}Gender${i}">Gender:</label>
                <select id="${type}Gender${i}">
                    <option value=""></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label for="${type}CC${i}">Chief Complaint:</label>
                <textarea id="${type}CC${i}" class="expandable" oninput="autoExpandTextarea(this)"></textarea>
            `;
            container.appendChild(div);

            // Trigger auto-expand for the newly created textarea
            const textarea = container.querySelector(`#${type}CC${i}`);
            autoExpandTextarea(textarea);
        }
    } else {
        container.style.display = 'none'; // Hide the container
    }
}

function autoExpandTextarea(textarea) {
    if (textarea.value.trim() === '') {
        textarea.style.height = '40px'; // Reset to initial height if empty
    } else {
        textarea.style.height = '40px'; // Reset to initial height before recalculating
        textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on content
    }
}

const closeModalButton = document.querySelector('.close');
const confirmButton = document.getElementById('confirmApparatus');
const modal = document.getElementById('apparatusModal');
const apparatusListContainer = document.getElementById('apparatusList');
const textarea = document.getElementById('respondingTeam');

// Apparatus List (Sample Data)
const apparatusList = [
'Emergency Medical Services, ZCFD, Ambulance',
'Zamboanga City Central Fire Station, ZCFD, Rosenbauer FT FE23 (FIRST-DUE)',
'Zamboanga City Central Fire Station, ZCFD, Hino FT FE36 (FIRST-DUE)',
'Zamboanga City Central Fire Station, ZCFD, Isuzu Morita Super Tanker FE01 (SECOND-DUE)',
'Ayala FSS, ZCFD, Isuzu 6-wheeler FE33 (FIRST-DUE)',
'Ayala FSS, ZCFD, Isuzu Brake Squirt FE13 (SECOND-DUE)',
'Boalan FSS, ZCFD, Isuzu Anos Pumper FT FE11 (FIRST-DUE)',
'Buenavista FSS, ZCFD, Isuzu Morita FT FE16 (SECOND-DUE)',
'Cabaluay FSS, ZCFD, ZCDRRMO FT (FIRST-DUE)',
'Calarian FSS, ZCFD, Isuzu 6-wheeler FT FE30 (FIRST-DUE)',
'Culianan FSS, ZCFD, Isuzu 6-wheeler FT FE32 (FIRST-DUE)',
'Guiwan FSS, ZCFD, Isuzu Anos Pumper FT FE09 (FIRST-DUE)',
'Labuan FSS, ZCFD, Isuzu 6-wheeler FT FE24 (FIRST-DUE)',
'Labuan FSS, ZCFD, Foton Pumper FT FE08 (SECOND-DUE)',
'Lunzuran FSS, ZCFD, Isuzu 6-wheeler FT FE27 (FIRST-DUE)',
'Mampang FSS, ZCFD, Isuzu 6-wheeler FT FE25 (FIRST-DUE)',
'Manicahan FSS, ZCFD, Isuzu 6-wheeler FT FE29 (FIRST-DUE)',
'Mercedes FSS, ZCFD, Isuzu 6-wheeler FT FE28 (FIRST-DUE)',
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
'Tigbalabag FSS, ZCFD, Hino Nikki Pumper FT FE07 (FIRST-DUE)',
'Vitali FSS, ZCFD, Isuzu 6-wheeler FT FE31 (FIRST-DUE)',
'Special Rescue Force, ZCFD, Isuzu Morita Rescue Truck',
'Zamboanga City Fire District, Toyota Rush',
'Zamboanga City Fire District, Toyota Hilux',
'Zamboanga City Disaster Risk Reduction Management Office (ZCDRRMO), Water Tanker',
'Zamboanga City Disaster Risk Reduction Management Office (ZCDRRMO), EMS',
'Philippine National Police (PNP)',
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
    let totalCount = 0;
    let output = "";
  
    // Only add FE count if there is a Fire Engine selected
    if (feCount > 0) {
      totalCount += feCount;
      output += `BFP FE: ${feCount}`;
      output += '\n';  // Use \n for line break
    }
  
    // Only add SRF if selected
    if (srfCount > 0) {
      totalCount += srfCount;
      output += `BFP SRF: ${srfCount}`;
      output += '\n';  // Use \n for line break
    }
  
    // Only add EMS if selected
    if (emsCount > 0) {
      totalCount += emsCount;
      output += `BFP EMS: ${emsCount}`;
      output += '\n';  // Use \n for line break
    }
  
    // ✅ Update Total Count and Responders field with a single line output
    output = `Total: ${totalCount}\n` + output.trim();  // Add \n for total count
  
    respondersField.value = output;
  
    // ✅ Auto-expand the responders textarea
    respondersField.style.height = 'auto';
    respondersField.style.height = respondersField.scrollHeight + 'px';
  }
  

// Function to submit and copy to clipboard
function emssubmitInitial() {
    console.log('emssubmitInitial function called'); // Debugging line

    const isMedicalFacilityVisible = !document.getElementById('medicalFacilitySection').classList.contains('hidden');
    const isCallToAddressVisible = !document.getElementById('calltoaddress').classList.contains('hidden');

    let destination = '';
    if (isMedicalFacilityVisible) {
        destination = `${document.getElementById('medicalFacility').value}, Zamboanga City, Region IX`;
    } else if (isCallToAddressVisible) {
        destination = `${document.getElementById('tolocation').value}, Barangay ${document.getElementById('tobarangay').value}, ${document.getElementById('tocity').value}, ${document.getElementById('toregion').value}`;
    } else {
        destination = 'No destination specified';
    }

    const data = {
        aor: document.getElementById('aor').value,
        calltype: document.getElementById('typeofcall').value,
        locationfrom: document.getElementById('fromlocation').value,
        barangayfrom: document.getElementById('frombarangay').value,
        cityfrom: document.getElementById('fromcity').value,
        destination: destination,
        respondingTeam: document.getElementById('respondingTeam').value,
        dateTimeReported: formatDateTime(new Date(document.getElementById('dateTimeReported').value)),
        actiontaken: document.getElementById('actiontaken').value,
        responders: document.getElementById('responders').value,
        timeArrivalofResidence: formatDateTime(new Date(document.getElementById('timeArrivalofResidence').value)),
        timeArrivalofHospital: formatDateTime(new Date(document.getElementById('timeArrivalofHospital').value)),
        commander: document.getElementById('commander').value,
        sender: document.getElementById('sender').value,
        senderContact: formatPhoneNumber(document.getElementById('senderContact').value),
    };

    const emsreport = `INITIAL REPORT

${data.aor}, reporting to a ${data.calltype} from ${data.locationfrom}, Barangay ${data.barangayfrom}, ${data.cityfrom} to ${data.destination}

RESPONDING TEAM:
${data.respondingTeam}

TIME AND DATE REPORTED: ${data.dateTimeReported}

FIRE TRUCK OR AMBULANCE RESPONDED: ${data.responders}

GROUND COMMANDER: ${data.commander}

SENDER: ${data.sender} ${data.senderContact}`;

    // Copy to clipboard
    navigator.clipboard.writeText(emsreport).then(() => {
        alert('Initial report copied to clipboard!');
    });
}


// Function to submit complete and copy to clipboard
function submitComplete() {
    console.log('submitComplete function called'); // Debugging line

    const isMedicalFacilityVisible = !document.getElementById('medicalFacilitySection').classList.contains('hidden');
    const isCallToAddressVisible = !document.getElementById('calltoaddress').classList.contains('hidden');

    let destination = '';
    if (isMedicalFacilityVisible) {
        destination = `${document.getElementById('medicalFacility').value}, Zamboanga City, Region IX`;
    } else if (isCallToAddressVisible) {
        destination = `${document.getElementById('tolocation').value}, Barangay ${document.getElementById('tobarangay').value}, ${document.getElementById('tocity').value}, ${document.getElementById('toregion').value}`;
    } else {
        destination = 'No destination specified';
    }

    const data = {
        aor: document.getElementById('aor').value,
        calltype: document.getElementById('typeofcall').value,
        locationfrom: document.getElementById('fromlocation').value,
        barangayfrom: document.getElementById('frombarangay').value,
        cityfrom: document.getElementById('fromcity').value,
        destination: destination,
        respondingTeam: document.getElementById('respondingTeam').value,
        dateTimeReported: formatDateTime(new Date(document.getElementById('dateTimeReported').value)),
        actiontaken: document.getElementById('actiontaken').value,
        responders: document.getElementById('responders').value,
        timeArrivalofResidence: formatDateTime(new Date(document.getElementById('timeArrivalofResidence').value)),
        timeArrivalofHospital: formatDateTime(new Date(document.getElementById('timeArrivalofHospital').value)),
        commander: document.getElementById('commander').value,
        sender: document.getElementById('sender').value,
        senderContact: formatPhoneNumber(document.getElementById('senderContact').value),

        timeAndDateOfArrival: formatDateTime(new Date(document.getElementById('timeArrivalofResidence').value)),
        timeArrivalofHospital: formatDateTime(new Date(document.getElementById('timeArrivalofHospital').value)),
        actiontaken: document.getElementById('actiontaken').value,
        involved: document.getElementById('involved').value,
        fatality: document.getElementById('fatality').value,
        injured: document.getElementById('injured').value,

    };

    let fatalityDetails = '';
    const fatalityCount = parseInt(data.fatality) || 0;

    for (let i = 1; i <= fatalityCount; i++) {
        const name = document.getElementById(`fatalityName${i}`).value || 'N/A';
        const age = document.getElementById(`fatalityAge${i}`).value || 'N/A';
        const gender = document.getElementById(`fatalityGender${i}`).value || 'N/A';
        const condition = document.getElementById(`fatalityCC${i}`).value || 'N/A';

        fatalityDetails += `Px ${i} Name: ${name}, ${age} years old, ${gender}\n`;
        fatalityDetails += `Px ${i} Condition of the Patient: ${condition}\n`;
    }

    let injuredDetails = '';
    const injuredCount = parseInt(data.injured) || 0;

    for (let i = 1; i <= injuredCount; i++) {
        const name = document.getElementById(`injuredName${i}`).value || 'N/A';
        const age = document.getElementById(`injuredAge${i}`).value || 'N/A';
        const gender = document.getElementById(`injuredGender${i}`).value || 'N/A';
        const condition = document.getElementById(`injuredCC${i}`).value || 'N/A';

        injuredDetails += `Px ${i} Name: ${name}, ${age} years old, ${gender}\n`;
        injuredDetails += `Px ${i} Condition of the Patient: ${condition}\n`;
    }

    const report = `FINAL REPORT

${data.aor}, reporting to a ${data.calltype} from ${data.locationfrom}, Barangay ${data.barangayfrom}, ${data.cityfrom} to ${data.destination}

RESPONDING TEAM:
${data.respondingTeam}

TIME AND DATE REPORTED: ${data.dateTimeReported}
INVOLVED:
TIME AND DATE OF ARRIVAL (Scene): ${data.timeAndDateOfArrival}
TIME AND DATE OF ARRIVAL (Hospital): ${data.timeArrivalofHospital}

ACTION TAKEN: ${data.actiontaken}

Casualty/Fatality: ${data.fatality}
${fatalityDetails.trim()}
Injured: ${data.injured}
${injuredDetails.trim()}
Rescue Vehicle Responded: ${data.responders}

GROUND COMMANDER: ${data.commander}

SENDER: ${data.sender} ${data.senderContact}`;

    // Copy to clipboard
    navigator.clipboard.writeText(report).then(() => {
        alert('Complete report copied to clipboard!');
    });
}

// Format date and time to "HHMMH of DD Mmmm YYYY"
function formatDateTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}H of ${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`;
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
"San Jose Gusu", "San Roque", "Sangali", "Sta. Barbara", "Sta. Catalina", "Sta. Maria",
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

// BARANGAY AUTOCOMPLETE FOR FROM
const barangayInputFrom = document.getElementById('frombarangay');
const suggestionsListFrom = document.getElementById('suggestionsFrom');
let selectedIndexFrom = -1;

function filterBarangaysFrom() {
    const input = barangayInputFrom.value.toLowerCase();
    suggestionsListFrom.innerHTML = '';

    if (!input) {
        suggestionsListFrom.classList.add('hidden');
        return;
    }

    const filtered = barangays.filter(barangay => 
        barangay.toLowerCase().includes(input)
    );

    filtered.forEach((barangay, index) => {
        const li = document.createElement('li');
        li.textContent = barangay;
        li.addEventListener('click', () => selectBarangayFrom(barangay));
        suggestionsListFrom.appendChild(li);
    });

    if (filtered.length > 0) {
        suggestionsListFrom.classList.remove('hidden');
        positionSuggestionsFrom();

        selectedIndexFrom = 0;
        updateActiveItemFrom(suggestionsListFrom.getElementsByTagName('li'));
    } else {
        suggestionsListFrom.classList.add('hidden');
    }
}

function selectBarangayFrom(barangay) {
    barangayInputFrom.value = barangay;
    suggestionsListFrom.classList.add('hidden');
}

function handleKeydownFrom(event) {
    const items = suggestionsListFrom.getElementsByTagName('li');

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndexFrom = (selectedIndexFrom + 1) % items.length;
        updateActiveItemFrom(items);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndexFrom = (selectedIndexFrom - 1 + items.length) % items.length;
        updateActiveItemFrom(items);
    } else if (event.key === 'Enter') {
        if (selectedIndexFrom > -1) {
            event.preventDefault();
            selectBarangayFrom(items[selectedIndexFrom].textContent);
        }
    } else if (event.key === 'Tab') {
        if (selectedIndexFrom > -1) {
            selectBarangayFrom(items[selectedIndexFrom].textContent);
            event.preventDefault();
        }
    }
}

function updateActiveItemFrom(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }

    if (selectedIndexFrom > -1) {
        items[selectedIndexFrom].classList.add('active');
        items[selectedIndexFrom].scrollIntoView({ block: 'nearest' });
    }
}

function positionSuggestionsFrom() {
    const rect = barangayInputFrom.getBoundingClientRect();
    suggestionsListFrom.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionsListFrom.style.left = `${rect.left + window.scrollX}px`;
    suggestionsListFrom.style.width = `${rect.width}px`;
}

// BARANGAY AUTOCOMPLETE FOR TO
const barangayInputTo = document.getElementById('tobarangay');
const suggestionsListTo = document.getElementById('suggestionsTo');
let selectedIndexTo = -1;

function filterBarangaysTo() {
    const input = barangayInputTo.value.toLowerCase();
    suggestionsListTo.innerHTML = '';

    if (!input) {
        suggestionsListTo.classList.add('hidden');
        return;
    }

    const filtered = barangays.filter(barangay => 
        barangay.toLowerCase().includes(input)
    );

    filtered.forEach((barangay, index) => {
        const li = document.createElement('li');
        li.textContent = barangay;
        li.addEventListener('click', () => selectBarangayTo(barangay));
        suggestionsListTo.appendChild(li);
    });

    if (filtered.length > 0) {
        suggestionsListTo.classList.remove('hidden');
        positionSuggestionsTo();

        selectedIndexTo = 0;
        updateActiveItemTo(suggestionsListTo.getElementsByTagName('li'));
    } else {
        suggestionsListTo.classList.add('hidden');
    }
}

function selectBarangayTo(barangay) {
    barangayInputTo.value = barangay;
    suggestionsListTo.classList.add('hidden');
}

function handleKeydownTo(event) {
    const items = suggestionsListTo.getElementsByTagName('li');

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndexTo = (selectedIndexTo + 1) % items.length;
        updateActiveItemTo(items);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndexTo = (selectedIndexTo - 1 + items.length) % items.length;
        updateActiveItemTo(items);
    } else if (event.key === 'Enter') {
        if (selectedIndexTo > -1) {
            event.preventDefault();
            selectBarangayTo(items[selectedIndexTo].textContent);
        }
    } else if (event.key === 'Tab') {
        if (selectedIndexTo > -1) {
            selectBarangayTo(items[selectedIndexTo].textContent);
            event.preventDefault();
        }
    }
}

function updateActiveItemTo(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }

    if (selectedIndexTo > -1) {
        items[selectedIndexTo].classList.add('active');
        items[selectedIndexTo].scrollIntoView({ block: 'nearest' });
    }
}

function positionSuggestionsTo() {
    const rect = barangayInputTo.getBoundingClientRect();
    suggestionsListTo.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionsListTo.style.left = `${rect.left + window.scrollX}px`;
    suggestionsListTo.style.width = `${rect.width}px`;
}

document.addEventListener('click', (event) => {
    if (event.target !== barangayInputFrom) {
        suggestionsListFrom.classList.add('hidden');
    }
    if (event.target !== barangayInputTo) {
        suggestionsListTo.classList.add('hidden');
    }
});

function handleTransportChange() {
    const isTransport = document.getElementById('isTransport').value;
    const typeOfCall = document.getElementById('typeofcall').value;
    const medicalFacilitySection = document.getElementById('medicalFacilitySection');

    if (isTransport === 'yes' && (typeOfCall === 'patient transport' || typeOfCall === 'medical call')) {
        medicalFacilitySection.classList.remove('hidden');
    } else {
        medicalFacilitySection.classList.add('hidden');
    }
}

function handleSave() {
    alert('Save button clicked!');
}

function handleCancel() {
    alert('Cancel button clicked!');
}

function toggleHospitalOption(option) {
    const medicalFacilitySection = document.getElementById('medicalFacilitySection');
    const calltoaddress = document.getElementById('calltoaddress');

    if (option === 'yes') {
        medicalFacilitySection.classList.remove('hidden');
        calltoaddress.classList.add('hidden');
    } else if (option === 'no') {
        medicalFacilitySection.classList.add('hidden');
        calltoaddress.classList.remove('hidden');
    }
}

function setCurrentDateTime(inputId) {
    const input = document.getElementById(inputId);
    const now = new Date();

    // Format the date and time as "YYYY-MM-DDTHH:mm"
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    input.value = formattedDateTime;
}