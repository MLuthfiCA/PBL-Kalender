const API_URL = '../PHP/api_jadwal.php';

let nav = 0;
let clicked = null;
let events = []; 
let clickedEventId = null; 
let clickedRepeatId = null;
let clickedEventTitle = null;
let isEditMode = false;

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

// Current logged-in user (injected via PHP hidden input). Falls back to 'guest'.
// Functions to load/save subject_count from/to server
async function loadSubjectCountFromServer() {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'get_subject_count' })
        });
        const json = await res.json();
        if (json.status === 'success') {
            const el = document.getElementById('subjectCount');
            if (el) el.textContent = String(json.subject_count || 0);
        } else {
            console.warn('get_subject_count returned error', json);
        }
    } catch (e) {
        console.warn('Gagal memuat subject_count dari server', e);
    }
}

async function saveSubjectCountToServer(count) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'set_subject_count', subject_count: Number(count) })
        });
        const json = await res.json();
        if (json.status === 'success') {
            const el = document.getElementById('subjectCount');
            if (el) el.textContent = String(json.subject_count || 0);
        } else {
            alert('Gagal menyimpan ke server: ' + (json.message || '')); 
            console.warn('set_subject_count error', json);
        }
    } catch (e) {
        console.error('Save subject count error', e);
        alert('Gagal menyimpan ke server.');
    }
}

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

    // feature 2 menampilkan jadwal pada kalender
    const paddingDays = firstDayOfMonth.getDay();

    monthDisplay.innerText = `${dt.toLocaleDateString('id-ID', { month: 'long' })} ${year}`;
    calendar.innerHTML = '';

    for (let i = 0; i < paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        if (i >= paddingDays) {
            const dayNum = i - paddingDays + 1;
            const dayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            daySquare.innerText = dayNum;

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

            const todayStr = new Date().toISOString().split("T")[0];
            if (dayString === todayStr && nav === 0) {
                daySquare.id = 'currentDay';
            }

        } else {
            daySquare.classList.add('padding');
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
            <div style="display:flex; gap:10px; flex-grow:1;">
                <div>
                    <h4>${e.title}</h4>
                    <p>Dosen: ${dosenName} | Ruangan: ${e.room || '-'} | ${e.time || '-'}${notesText}</p>
                    <p>Tanggal: ${e.date}</p>
                </div>
            </div>
            <div style="display:flex; gap:8px; align-items:center; flex-shrink:0;">
                <button onclick="openEditModal(${e.id}, '${e.date}', '${e.title.replace(/'/g, "\\'")}', '${dosenName.replace(/'/g, "\\'")}', '${e.time}', '${(e.room || '').replace(/'/g, "\\'")}'${e.repeatId ? `, '${e.repeatId}'` : ''})" style="background-color:#0074a6; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:12px;">✎ Edit</button>
                <span class="status" style="
                    background-color: ${color};
                    color: white;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                ">${status}</span>
            </div>
        `;

        activityBox.appendChild(eventDiv);
    });

    if (activityBox.querySelectorAll('.tugas').length === 0) {
         activityBox.innerHTML += `<p style="color:#666; padding-top: 10px;">Tidak ada jadwal/tugas terdekat yang ditemukan.</p>`;
    } 

    // Update activity count visible in the top-right "Aktivitas" box
    try {
        const activityCountEl = document.getElementById('activityCount');
        if (activityCountEl) {
            activityCountEl.textContent = String(eventsInRange.length);
        }
    } catch (e) {
        console.warn('Gagal memperbarui activity count:', e);
    }

    // render Jadwal Hari Ini
        // render Jadwal Hari Ini (REAL TIME WIB)
    const localNow = new Date();
    const wibOffset = 7 * 60 * 60 * 1000; // offset 7 jam ke depan
    const wibTime = new Date(localNow.getTime() + (localNow.getTimezoneOffset() * 60000) + wibOffset);

// format tanggal lokal (YYYY-MM-DD)
const todayStrWIB = `${wibTime.getFullYear()}-${String(wibTime.getMonth() + 1).padStart(2, '0')}-${String(wibTime.getDate()).padStart(2, '0')}`;
const eventsTodayWIB = events.filter(e => {
    const eventDate = new Date(e.date);
    const eventStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
    return eventStr === todayStrWIB;
});

// tampilkan jadwal hari ini sesuai WIB
todayBox.innerHTML = '<h3>Jadwal Hari Ini</h3><p class="sub">Jadwal Kuliah Hari Ini (Real-Time WIB)</p>';

eventsTodayWIB.forEach((e) => {
    const div = document.createElement("div");
    const dosenName = (e.dosen && e.dosen.trim() !== "") ? e.dosen : 'Tidak Ada Data';
    const notesText = '';

    div.classList.add("jadwal");
    div.setAttribute('data-event-title', e.title ? e.title.toLowerCase() : '');
    div.setAttribute('data-event-dosen', dosenName.toLowerCase());

    // tampilkan juga jam real-time
    const nowTime = wibTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    div.innerHTML = `
        <h4>${e.title}</h4>
        <p>Dosen: ${dosenName} | Ruang ${e.room || '-'} — ${e.time || '-'}${notesText}</p>
        <p style="font-size:12px;color:#555;">Waktu sekarang (WIB): ${nowTime}</p>
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

function openEditModal(eventId, eventDate, eventTitle, eventDosen, eventTime, eventRoom, repeatId) {
    isEditMode = true;
    clicked = eventDate;
    clickedEventId = eventId;
    clickedRepeatId = repeatId || null;
    
    eventTitleInput.value = eventTitle;
    eventDosenInput.value = eventDosen;
    eventTimeInput.value = eventTime;
    eventRoomInput.value = eventRoom || '';
    repeatWeeklyCheckbox.checked = false;
    repeatWeeklyCheckbox.disabled = false;
    
    document.querySelector('#newEventModal h2').textContent = 'Edit Jadwal';
    document.getElementById('saveButton').textContent = 'Update';
    
    newEventModal.style.display = 'block';
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
    repeatWeeklyCheckbox.disabled = false;

    document.querySelector('#newEventModal h2').textContent = 'Tambah Jadwal';
    document.getElementById('saveButton').textContent = 'Simpan';
    
    isEditMode = false;

    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';

    clicked = null;
    clickedEventId = null;
    clickedRepeatId = null;
    clickedEventTitle = null;
    eventTitleInput.classList.remove('error');
}

async function updateEvent(title, dosen, time, room) {
    try {
        const response = await fetch('../PHP/api_jadwal.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'update_event',
                id: clickedEventId,
                title: title,
                dosen: dosen,
                time: time,
                room: room,
                repeatId: clickedRepeatId,
                repeatWeekly: repeatWeeklyCheckbox.checked
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Jadwal berhasil diubah!');
            closeModal();
            load();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating event:', error);
        alert('Gagal mengubah jadwal. Coba lagi.');
    }
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

    if (isEditMode) {
        await updateEvent(title, dosen, time, room);
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

        // Simpan ke server dan update UI
        saveSubjectCountToServer(jumlah);
    });
    // Load subject count dari server saat inisialisasi
    loadSubjectCountFromServer();
}

initButtons();
load();
