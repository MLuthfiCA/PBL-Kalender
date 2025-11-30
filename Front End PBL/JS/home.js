const API_URL = '../PHP/api_jadwal.php';

let nav = 0;
let clicked = null;
let events = []; 
let clickedEventId = null; 
let clickedRepeatId = null;
let clickedEventTitle = null;

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const eventTimeInput = document.getElementById("eventTime");
const eventRoomInput = document.getElementById("eventRoom");
const repeatWeeklyCheckbox = document.getElementById("repeatWeekly");
const eventText = document.getElementById("eventText");
const monthDisplay = document.getElementById("monthDisplay");
const eventDosenInput = document.getElementById("eventDosenInput");

const weekdays = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

async function loadEventsFromDB() {
    try {
        const response = await fetch(`${API_URL}?action=get_events`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gagal memuat data: ${response.statusText}. Pesan: ${errorText}`);
        }
        
        events = await response.json(); 
        
    } catch (error) {
        console.error("Error loading events:", error);
        events = [];
    }
}

// fungsi search and filter
function filterBoxes() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filterType = document.getElementById("filterSelect").value; 

    const allScheduleBoxes = document.querySelectorAll('.tugas, .jadwal');

    allScheduleBoxes.forEach(box => {
        const eventTitle = box.getAttribute('data-event-title') || '';
        const eventDosen = box.getAttribute('data-event-dosen') || '';
        
        let shouldShow = true;

        if (searchInput.length > 0) {
            let matchesSearch = false;
            
            if (filterType === 'dosen' && eventDosen.includes(searchInput)) {
                matchesSearch = true;
            } 
            else if (filterType === 'title' && eventTitle.includes(searchInput)) {
                matchesSearch = true;
            } 
            else if (filterType === '' && (eventTitle.includes(searchInput) || eventDosen.includes(searchInput))) {
                matchesSearch = true;
            }
            
            if (!matchesSearch) {
                shouldShow = false;
            }
        }
        
        if (shouldShow) {
            box.style.display = 'flex'; 
        } else {
            box.style.display = 'none'; 
        }
    });
}

async function load() {
    await loadEventsFromDB(); 

    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0].slice(0,3)); 

    monthDisplay.innerText = `${dt.toLocaleDateString('id-ID', { month: 'long' })} ${year}`;
    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${year}-${(month + 1)
            .toString()
            .padStart(2, '0')}-${(i - paddingDays)
            .toString()
            .padStart(2, '0')}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            const eventsForDay = events.filter(e => e.date === dayString);
            
            if (eventsForDay.length > 0) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                
                const displayEvent = eventsForDay[0]; 
                
                const titleText = eventsForDay.length > 1 
                                     ? `${displayEvent.title} (+${eventsForDay.length - 1})` 
                                     : displayEvent.title;
                                     
                eventDiv.innerHTML = `<strong>${titleText}</strong>`;

                if (displayEvent.dosen && displayEvent.dosen.trim() !== "") {
                    const dosenDiv = document.createElement('div');
                    dosenDiv.classList.add('event-dosen');
                    dosenDiv.innerText = `${displayEvent.dosen}`;
                    eventDiv.appendChild(dosenDiv);
                }

                daySquare.appendChild(eventDiv);
            }

            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }
        
        if (dayString === new Date().toISOString().split("T")[0] && nav === 0) {
            daySquare.id = 'currentDay';
        }

        calendar.appendChild(daySquare);
    }

    renderActivityAndTodayBoxes();
}


function renderActivityAndTodayBoxes() {
    const now = new Date();
    const oneWeekBefore = new Date();
    const oneWeekAfter = new Date();
    oneWeekBefore.setDate(now.getDate() - 7);
    oneWeekAfter.setDate(now.getDate() + 7);

    const activityBox = document.getElementById("activityList");
    const todayBox = document.getElementById("todaySchedule");
    if (!activityBox || !todayBox) return;

    // Reset konten box
    activityBox.innerHTML = '<h3>Aktivitas Minggu Ini</h3><p class="sub">Jadwal yang Akan Datang</p>';
    todayBox.innerHTML = '<h3>Jadwal Hari Ini</h3><p class="sub">Jadwal Kuliah Hari Ini</p>';

    // Filter event dalam rentang satu minggu
    const eventsInRange = events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= oneWeekBefore && eventDate <= oneWeekAfter;
    });
    

    const todayStr = now.toISOString().split("T")[0];
    const eventsToday = events.filter(e => e.date === todayStr);

    eventsInRange.forEach((e) => {
        const eventDate = new Date(e.date);
        const diffDays = Math.floor((eventDate - new Date(todayStr)) / (1000 * 60 * 60 * 24));

        let status = (diffDays < 0) ? "Tertunda" : "Akan Datang";
        let color = (diffDays < 0) ? "#f4b266" : "#4a90e2";
        
        const dosenName = (e.dosen && e.dosen.trim() !== "") ? e.dosen : 'Tidak Ada Data';
        const notesText = ''; 

        const eventDiv = document.createElement("div");
        eventDiv.classList.add("tugas");
        
        eventDiv.setAttribute('data-event-title', e.title ? e.title.toLowerCase() : '');
        eventDiv.setAttribute('data-event-dosen', dosenName.toLowerCase());
        
        eventDiv.style.display = "flex";
        eventDiv.style.justifyContent = "space-between";
        eventDiv.style.alignItems = "center";
        eventDiv.style.marginBottom = "8px";

        eventDiv.innerHTML = `
            <div style="display:flex; gap:10px;">
                <div>
                    <h4>${e.title}</h4>
                    <p>Dosen: ${dosenName} | Ruangan: ${e.room || '-'} | ${e.time || '-'}${notesText}</p>
                    <p>Tanggal: ${e.date}</p>
                </div>
            </div>
            <span class="status" style="
                background-color: ${color};
                color: white;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
            ">${status}</span>
        `;

        activityBox.appendChild(eventDiv);
    });

    if (activityBox.querySelectorAll('.tugas').length === 0) {
         activityBox.innerHTML += `<p style="color:#666; padding-top: 10px;">Tidak ada jadwal/tugas terdekat yang ditemukan.</p>`;
    } 

    // render Jadwal Hari Ini
    eventsToday.forEach((e) => {
        const div = document.createElement("div");
        const dosenName = (e.dosen && e.dosen.trim() !== "") ? e.dosen : 'Tidak Ada Data';
        const notesText = '';
        
        div.classList.add("jadwal");
        
        div.setAttribute('data-event-title', e.title ? e.title.toLowerCase() : '');
        div.setAttribute('data-event-dosen', dosenName.toLowerCase());
        
        div.innerHTML = `
            <h4>${e.title}</h4>
            <p>Dosen: ${dosenName} | Ruang ${e.room || '-'} — ${e.time || '-'}${notesText}</p>
        `;
        todayBox.appendChild(div);
    });

    if (todayBox.querySelectorAll('.jadwal').length === 0) {
        todayBox.innerHTML += `<p style="color:#666; padding-top: 10px;">Tidak ada jadwal hari ini</p>`;
    }
    
    filterBoxes();
}


function openModal(date) {
    clicked = date;
    
    const eventsForDay = events.filter(e => e.date === clicked);

    if (eventsForDay.length > 0) {
        let eventListHTML = '<h2 style="margin-bottom: 10px;">Jadwal Tanggal ' + clicked + '</h2>';
        
        eventsForDay.forEach(eventForDay => {
            const dosenName = (eventForDay.dosen && eventForDay.dosen.trim() !== "") ? eventForDay.dosen : 'Tidak Ada Data';
            const notesText = ''; 
            
            eventListHTML += `
                <div class="single-event-detail" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                    <p style="margin: 0;">
                        <strong>${eventForDay.title}</strong>
                        <br>Waktu: ${eventForDay.time}
                        <br>Ruangan: ${eventForDay.room || '-'}
                        <br>Dosen: ${dosenName}
                        ${notesText}
                    </p>
                    <button 
                        class="delete-single-btn" 
                        style="margin-top: 8px; padding: 5px 10px; cursor: pointer; background-color: #d9534f; color: white; border: none; border-radius: 3px;"
                        onclick="confirmDeleteEvent(${eventForDay.id}, '${eventForDay.repeatId || 'null'}', '${eventForDay.title}')">
                        Hapus Jadwal
                    </button>
                </div>
            `;
        });
        
        eventText.innerHTML = eventListHTML;
        
        document.getElementById('deleteButton').style.display = 'none'; 
        document.getElementById('closeButton').style.display = 'block'; 
        
        deleteEventModal.style.display = 'block'; 
        
    } else {
        newEventModal.style.display = 'block';
    }
    backDrop.style.display = 'block';
}

function confirmDeleteEvent(id, repeatId, title) {
    clickedEventId = id;
    clickedRepeatId = repeatId === 'null' ? null : repeatId; 
    clickedEventTitle = title;
    
    deleteEvent();
}

function closeModal() {
    eventTitleInput.value = '';
    eventTimeInput.value = '07:00 - 07:50';
    eventRoomInput.value = '';
    if (eventDosenInput) eventDosenInput.value = '';
    repeatWeeklyCheckbox.checked = false; 

    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';

    clicked = null;
    clickedEventId = null;
    clickedRepeatId = null;
    clickedEventTitle = null;
    eventTitleInput.classList.remove('error');
}


async function saveEvent() {
    const title = eventTitleInput.value;
    const dosen = eventDosenInput.value;
    const time = eventTimeInput.value;
    const room = eventRoomInput.value;
    const repeatWeekly = repeatWeeklyCheckbox.checked;

    if (!title || !time || !clicked) {
        eventTitleInput.classList.add('error');
        alert("Nama Mata Kuliah, Waktu, dan Tanggal harus diisi.");
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'save_event',
                title: title,
                dosen: dosen,
                date: clicked,
                time: time,
                room: room,
                repeatWeekly: repeatWeekly
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert(result.message);
        } else {
            alert("Gagal menyimpan jadwal ke server: " + result.message); 
        }

    } catch (error) {
        console.error('Save Event Error:', error);
        alert('Gagal berkomunikasi dengan server.');
    }

    closeModal();
    load();
}


async function deleteEvent() {
    if (!clickedEventId && !clickedRepeatId) {
        alert("ID jadwal tidak valid.");
        return;
    }

    let confirmationMessage;
    if (clickedRepeatId) {
        confirmationMessage = `Apakah Anda yakin ingin menghapus SEMUA jadwal '${clickedEventTitle}' yang berulang?`;
    } else {
        confirmationMessage = `Apakah Anda yakin ingin menghapus jadwal '${clickedEventTitle}'?`;
    }

    if (!confirm(confirmationMessage)) {
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'delete_event',
                id: clickedEventId,
                repeatId: clickedRepeatId
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert(result.message);
        } else {
            alert("Gagal menghapus jadwal: " + result.message);
        }
        
    } catch (error) {
        console.error('Delete Event Error:', error);
        alert('Gagal berkomunikasi dengan server.');
    }
    
    closeModal();
    load();
}


function initButtons() {
    document.getElementById("nextButton").addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById("backButton").addEventListener('click', () => {
        nav--;
        load();
    });
    
    document.getElementById("saveButton").addEventListener('click', saveEvent);
    document.getElementById("cancelButton").addEventListener('click', closeModal);
    document.getElementById("deleteButton").addEventListener('click', deleteEvent); 
    document.getElementById("closeButton").addEventListener('click', closeModal); 

    document.getElementById("addSubjectBtn").addEventListener("click", function () {
        let jumlah = prompt("Masukkan jumlah mata kuliah:");

        if (jumlah === null) return;  
        jumlah = parseInt(jumlah);

        if (isNaN(jumlah) || jumlah < 0) {
            alert("Input tidak valid!");
            return;
        }

        document.getElementById("subjectCount").textContent = jumlah;
    });
}

initButtons();
load();