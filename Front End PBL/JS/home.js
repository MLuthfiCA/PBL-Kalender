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

// BARU: Variabel untuk input Catatan
const eventNotesInput = document.getElementById("eventNotes");

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
        alert("Gagal memuat jadwal dari server. Silakan cek koneksi Anda.");
        events = [];
    }
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

    activityBox.innerHTML = '<h3>Aktivitas Minggu Ini</h3><p class="sub">Tugas dan Jadwal yang Akan Datang</p>';
    todayBox.innerHTML = '<h3>Jadwal Hari Ini</h3><p class="sub">Jadwal Kuliah dan Praktikum Hari Ini</p>';

    const eventsInRange = events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= oneWeekBefore && eventDate <= oneWeekAfter;
    });

    const todayStr = now.toISOString().split("T")[0];
    const eventsToday = events.filter(e => e.date === todayStr);

    eventsInRange.forEach((e, index) => {
        const eventDate = new Date(e.date);
        const diffDays = Math.floor((eventDate - new Date(todayStr)) / (1000 * 60 * 60 * 24));

        let status = (diffDays < 0) ? "Tertunda" : "Akan Datang";
        let color = (diffDays < 0) ? "#f4b266" : "#4a90e2";
        
        const dosenName = (e.dosen && e.dosen.trim() !== "") ? e.dosen : 'Tidak Ada Data';
        // BARU: Tampilkan Catatan di box aktivitas
        const notesText = (e.notes && e.notes.trim() !== "") ? ` | Catatan: ${e.notes}` : ''; 

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
                <strong>${index + 1}.</strong>
                <div>
                <h4>${e.title}</h4>
                <p>Dosen: ${dosenName} | Ruangan: ${e.room || '-'} | ${e.time || '-'}${notesText}</p>
                <p>Tenggat: ${e.date}</p>
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

    if (activityBox.querySelectorAll('.tugas').length <= 0) {
        activityBox.innerHTML += `<p style="color:#666;">Tidak ada aktivitas minggu ini</p>`;
    }
    document.getElementById("addSubjectBtn").addEventListener("click", function () {
    let jumlah = prompt("Masukkan jumlah mata kuliah:");

    if (jumlah === null) return;  
    jumlah = parseInt(jumlah);

    if (isNaN(jumlah) || jumlah < 0) {
        alert("Input tidak valid!");
        return;
    }

    // update tampilan
    document.getElementById("subjectCount").textContent = jumlah;
});


    // jadwal hari ini
    eventsToday.forEach((e, index) => {
        const div = document.createElement("div");
        const dosenName = (e.dosen && e.dosen.trim() !== "") ? e.dosen : 'Tidak Ada Data';
        // BARU: Tampilkan Catatan di box jadwal hari ini
        const notesText = (e.notes && e.notes.trim() !== "") ? ` | Catatan: ${e.notes}` : ''; 
        
        div.classList.add("jadwal");
        
        div.setAttribute('data-event-title', e.title ? e.title.toLowerCase() : '');
        div.setAttribute('data-event-dosen', dosenName.toLowerCase());
        
        div.innerHTML = `
            <h4>${e.title}</h4>
            <p>Dosen: ${dosenName} | Ruang ${e.room || '-'} — ${e.time || '-'}${notesText}</p>
        `;
        todayBox.appendChild(div);
    });

    if (todayBox.querySelectorAll('.jadwal').length <= 0) {
        todayBox.innerHTML += `<p style="color:#666;">Tidak ada jadwal hari ini</p>`;
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
            
            // BARU: Tampilkan Catatan
            const notesText = (eventForDay.notes && eventForDay.notes.trim() !== "") 
                ? `<br>Catatan: ${eventForDay.notes}` 
                : '';
            
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
    eventTimeInput.value = '';
    eventRoomInput.value = '';
    if (eventDosenInput) eventDosenInput.value = '';
    
    // BARU: Bersihkan input Catatan
    if (eventNotesInput) eventNotesInput.value = ''; 
    
    repeatWeeklyCheckbox.checked = false;

    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    clicked = null;
    
    clickedEventId = null;
    clickedRepeatId = null;
    clickedEventTitle = null;
    
    load();
}

async function saveEvent() {
    if (eventTitleInput.value) {
        
        // BARU: Ambil nilai catatan
        const notes = eventNotesInput ? eventNotesInput.value : "";
        
        const baseEventData = {
            title: eventTitleInput.value,
            date: clicked,
            time: eventTimeInput.value,
            room: eventRoomInput.value,
            dosen: eventDosenInput ? eventDosenInput.value : "",
            notes: notes, // BARU: Kirim catatan ke API
            action: 'save_event' 
        };

        const repeatWeekly = repeatWeeklyCheckbox.checked;
        const eventsToSave = [];
        
        const repeatId = repeatWeekly ? Date.now().toString() : null;

        if (repeatWeekly) {
            const startDate = new Date(clicked);
            for (let i = 0; i < 12; i++) { // Ulangi 12 minggu
                const nextDate = new Date(startDate);
                nextDate.setDate(startDate.getDate() + i * 7);
                const formattedDate = nextDate.toISOString().split("T")[0];
                
                eventsToSave.push({ 
                    ...baseEventData, 
                    date: formattedDate, 
                    repeatId: repeatId 
                });
            }
        } else {
            eventsToSave.push(baseEventData);
        }

        let successCount = 0;
        let failCount = 0;

        for (const eventData of eventsToSave) {
            try {
                const bodyParams = new URLSearchParams(eventData);
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: bodyParams
                });

                const result = await response.json();

                if (result.status === 'success') {
                    successCount++;
                } else {
                    console.error("Gagal simpan:", result.message);
                    failCount++;
                }
            } catch (error) {
                console.error("Error jaringan/fetch:", error);
                failCount++;
            }
        }

        if (failCount > 0) {
            alert(`Penyimpanan selesai. ${successCount} jadwal berhasil disimpan, ${failCount} gagal. Lihat konsol untuk detail.`);
        } else {
            alert(`Jadwal berhasil disimpan!`);
        }
        

        closeModal();

    } else {
        alert('Harap isi Judul (Mata Kuliah)!');
    }
}


async function deleteEvent() {
    const idToDelete = clickedEventId;
    const repeatId = clickedRepeatId;
    const eventTitle = clickedEventTitle;
    
    if (!idToDelete) return; 

    let deleteType = 'single';
    let confirmed = true;

    if (repeatId) {
        const confirmMessage = `Jadwal "${eventTitle}" adalah bagian dari seri berulang.\nTekan OK untuk menghapus SEMUA jadwal berulang.\nTekan Batal untuk hanya menghapus jadwal ini.`;
        confirmed = confirm(confirmMessage);
    } 

    if (repeatId && confirmed) {
        deleteType = 'all_repeat'; 
    } else if (repeatId && !confirmed) {
        deleteType = 'single'; 
    } 

    try {
        const bodyParams = new URLSearchParams({
            action: 'delete_event',
            id: idToDelete, 
            repeatId: repeatId,
            delete_type: deleteType
        });
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: bodyParams
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            alert(result.message);
        } else {
            throw new Error(result.message || 'Gagal menghapus jadwal.');
        }

    } catch (error) {
        console.error("Error menghapus jadwal:", error);
        alert(`Gagal menghapus jadwal: ${error.message}`);
    }

    closeModal();
}

// fungsi search and filter
function filterBoxes() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('filterSelect').value; 
    const allItems = document.querySelectorAll('#activityList .tugas, #todaySchedule .jadwal');
    const targetHeader = document.querySelector('.main-content h2');

    let firstMatchFound = false;

    allItems.forEach(item => {
        const title = item.getAttribute('data-event-title') || '';
        const dosen = item.getAttribute('data-event-dosen') || '';
        
        let isMatch = false;
        let textToSearch = '';

        if (filterType === 'dosen') {
            textToSearch = dosen;
        } else if (filterType === 'title') {
            textToSearch = title;
        } else { 
            textToSearch = `${title} ${dosen}`;
        }

        if (textToSearch.includes(searchValue)) {
            isMatch = true;
        }
        
        if (isMatch) {
            item.classList.remove('hidden-item');
            if (searchValue.length > 0 && !firstMatchFound) {
        
            }
        } else {
            item.classList.add('hidden-item');
        }
    });
}


document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
});

document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
});

document.getElementById('saveButton').addEventListener('click', saveEvent);
document.getElementById('closeButton').addEventListener('click', closeModal); 


const cancelButton = document.getElementById('cancelButton');
if (cancelButton) {
    cancelButton.addEventListener('click', closeModal);
}

document.getElementById('modalBackDrop').addEventListener('click', closeModal);

load(); 
setTimeout(filterBoxes, 100);
