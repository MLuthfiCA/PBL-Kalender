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

// ambil input nama dosen
const eventDosenInput = document.querySelector('input[placeholder="Nama Dosen"]');

const weekdays = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

//FUNGSI LOAD KALENDER

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
        eventDiv.innerText = `${eventForDay.title}`;

        // tampilkan nama dosen kecil di bawah judul event
        if (eventForDay.dosen) {
          const dosenDiv = document.createElement('div');
          dosenDiv.classList.add('event-dosen');
          dosenDiv.style.fontSize = "11px";
          dosenDiv.style.color = "#444";
          dosenDiv.innerText = `Dosen: ${eventForDay.dosen}`;
          eventDiv.appendChild(dosenDiv);
        }

        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);
  }

  renderActivityAndTodayBoxes();
}

//FUNGSI AKTIVITAS & JADWAL HARI INI

function renderActivityAndTodayBoxes() {
  const now = new Date();
  const oneWeekBefore = new Date();
  const oneWeekAfter = new Date();
  oneWeekBefore.setDate(now.getDate() - 7);
  oneWeekAfter.setDate(now.getDate() + 7);

  const activityBox = document.getElementById("activityList");
  const todayBox = document.getElementById("todaySchedule");
  if (!activityBox || !todayBox) return; // mencegah error kalau elemen belum ada

  activityBox.innerHTML = "";
  todayBox.innerHTML = "";

  // Filter event berdasarkan tanggal
  const eventsInRange = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= oneWeekBefore && eventDate <= oneWeekAfter;
  });

  const todayStr = now.toISOString().split("T")[0];
  const eventsToday = events.filter(e => e.date === todayStr);

  //Aktivitas Mingguan
  eventsInRange.forEach(e => {
    const eventDate = new Date(e.date);
    const diffDays = Math.floor((eventDate - now) / (1000 * 60 * 60 * 24));

    let status = "";
    let color = "";

    if (diffDays < 0) {
      status = "Tertunda";
      color = "#f4b266";
    } else {
      status = "Akan Datang";
      color = "#4a90e2";
    }

    const eventDiv = document.createElement("div");
    eventDiv.classList.add("tugas");
    eventDiv.style.display = "flex";
    eventDiv.style.justifyContent = "space-between";
    eventDiv.style.alignItems = "center";
    eventDiv.style.marginBottom = "8px";

    eventDiv.innerHTML = `
      <div>
        <h4>${e.title}</h4>
        <p>Dosen: ${e.dosen || '-'} | Ruangan: ${e.room || '-'} | ${e.time || '-'}</p>
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

  if (eventsInRange.length === 0) {
    activityBox.innerHTML = `<p style="color:#666;">Tidak ada aktivitas minggu ini</p>`;
  }

  //Jadwal Hari Ini
  eventsToday.forEach(e => {
    const div = document.createElement("div");
    div.classList.add("jadwal");
    div.innerHTML = `
      <h4>${e.title}</h4>
      <p>Ruang ${e.room || '-'} — ${e.time || '-'}</p>
      <p>Dosen: ${e.dosen || '-'}</p>
    `;
    todayBox.appendChild(div);
  });

  if (eventsToday.length === 0) {
    todayBox.innerHTML = `<p style="color:#666;">Tidak ada jadwal hari ini</p>`;
  }
}

//MODAL DAN EVENT HANDLER
function openModal(date) {
  clicked = date;
  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    eventText.innerText = `${eventForDay.title} | ${eventForDay.time} | ${eventForDay.room}`;
    if (eventForDay.dosen) {
      eventText.innerText += ` | Dosen: ${eventForDay.dosen}`;
    }
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

//NAVIGASI BULAN DAN TOMBOL
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
