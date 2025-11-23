let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

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

function load() {
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

      const eventForDay = events.find(e => e.date === dayString);
      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        
        eventDiv.innerHTML = `<strong>${eventForDay.title}</strong>`;

        // Menambahkan Nama Dosen di bawah judul event di kotak tanggal
        if (eventForDay.dosen && eventForDay.dosen.trim() !== "") {
          const dosenDiv = document.createElement('div');
          dosenDiv.classList.add('event-dosen');
          dosenDiv.innerText = `${eventForDay.dosen}`;
          eventDiv.appendChild(dosenDiv);
        }

        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }
    
    // Highlight hari ini
    if (dayString === new Date().toISOString().split("T")[0] && nav === 0) {
        daySquare.id = 'currentDay';
    }

    calendar.appendChild(daySquare);
  }

  renderActivityAndTodayBoxes();
}

// fungsi aktivitas dan jadwal hari ini
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

    // aktivitas mingguan
    eventsInRange.forEach((e, index) => {
        const eventDate = new Date(e.date);
        const diffDays = Math.floor((eventDate - now) / (1000 * 60 * 60 * 24));

        let status = (diffDays < 0) ? "Tertunda" : "Akan Datang";
        let color = (diffDays < 0) ? "#f4b266" : "#4a90e2";
        
        const dosenName = (e.dosen && e.dosen.trim() !== "") ? e.dosen : 'Tidak Ada Data';

        const eventDiv = document.createElement("div");
        eventDiv.classList.add("tugas");
        
        eventDiv.setAttribute('data-event-title', e.title ? e.title.toLowerCase() : '');
        eventDiv.setAttribute('data-event-dosen', dosenName.toLowerCase());
        
        eventDiv.style.display = "flex";
        eventDiv.style.justifyContent = "space-between";
        eventDiv.style.alignItems = "center";
        eventDiv.style.marginBottom = "8px";

        eventDiv.innerHTML = `
            <div>
                <h4>${e.title}</h4>
                <p>Dosen: ${dosenName} | Ruangan: ${e.room || '-'} | ${e.time || '-'}</p>
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

    // jadwal hari ini
    eventsToday.forEach((e, index) => {
        const div = document.createElement("div");
        const dosenName = (e.dosen && e.dosen.trim() !== "") ? e.dosen : 'Tidak Ada Data';
        
        div.classList.add("jadwal");
        
        div.setAttribute('data-event-title', e.title ? e.title.toLowerCase() : '');
        div.setAttribute('data-event-dosen', dosenName.toLowerCase());
        
        div.innerHTML = `
            <h4>${e.title}</h4>
            <p>Dosen: ${dosenName} | Ruang ${e.room || '-'} — ${e.time || '-'}</p>
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
  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {

    const dosenName = (eventForDay.dosen && eventForDay.dosen.trim() !== "") ? eventForDay.dosen : 'Tidak Ada Data';
    

    eventText.innerHTML = `
        <strong>${eventForDay.title}</strong>
        <br>Waktu: ${eventForDay.time}
        <br>Ruangan: ${eventForDay.room || '-'}
        <br>Dosen: ${dosenName}
    `;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }
  backDrop.style.display = 'block';
}

function closeModal() {
  eventTitleInput.value = '';
  eventTimeInput.value = '';
  eventRoomInput.value = '';
  if (eventDosenInput) eventDosenInput.value = '';
  repeatWeeklyCheckbox.checked = false;

  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    const baseEvent = {
      title: eventTitleInput.value,
      date: clicked,
      time: eventTimeInput.value,
      room: eventRoomInput.value,
      dosen: eventDosenInput ? eventDosenInput.value : "" 
    };

    const repeatWeekly = repeatWeeklyCheckbox.checked;

    if (repeatWeekly) {
      const startDate = new Date(clicked);
      for (let i = 0; i < 12; i++) {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + i * 7);
        const formattedDate = nextDate.toISOString().split("T")[0];
        events.push({ ...baseEvent, date: formattedDate, repeatId: clicked });
      }
    } else {
      events.push(baseEvent);
    }

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
    renderActivityAndTodayBoxes();
  } else {
    alert('Harap isi semua field!');
  }
}

function deleteEvent() {
  const eventForDay = events.find(e => e.date === clicked);
  if (!eventForDay) return;

  if (eventForDay.repeatId) {
    const confirmAll = confirm("Hapus semua jadwal berulang ini?\nPilih OK untuk semua, Batal untuk hanya minggu ini.");
    if (confirmAll) {
      events = events.filter(e => e.repeatId !== eventForDay.repeatId);
    } else {
      events = events.filter(e => e.date !== clicked);
    }
  } else {
    if (confirm("Yakin ingin menghapus jadwal ini?")) {
      events = events.filter(e => e.date !== clicked);
    }
  }

  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
  renderActivityAndTodayBoxes();
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
                targetHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
                firstMatchFound = true;
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
document.getElementById('cancelButton').addEventListener('click', closeModal);
document.getElementById('deleteButton').addEventListener('click', deleteEvent);
document.getElementById('closeButton').addEventListener('click', closeModal);


load();
setTimeout(renderActivityAndTodayBoxes, 100);
