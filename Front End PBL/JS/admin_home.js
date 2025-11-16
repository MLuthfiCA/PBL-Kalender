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

//ambil input nama dosen
const eventDosenInput = document.querySelector('input[placeholder="Nama Dosen"]');

const weekdays = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function openModal(date) {
  clicked = date;
  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    eventText.innerText = `${eventForDay.title} | ${eventForDay.time} | ${eventForDay.room}`;
    
    //tampilkan dosen jika ada
    if (eventForDay.dosen) {
      eventText.innerText += ` | Dosen: ${eventForDay.dosen}`;
    }

    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }
  backDrop.style.display = 'block';
}

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

        // 🟩 tambahan — tampilkan nama dosen kecil di bawah judul event
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
}

function closeModal() {
  eventTitleInput.value = '';
  eventTimeInput.value = '';
  eventRoomInput.value = '';
  
  //kosongkan input dosen
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
      date: clicked,
      title: eventTitleInput.value,
      time: eventTimeInput.value,
      room: eventRoomInput.value,
      //simpan nama dosen
      dosen: eventDosenInput ? eventDosenInput.value : ""
    };
    const repeatWeekly = repeatWeeklyCheckbox.checked;

    if (repeatWeekly) {
      // Buat event berulang selama 3 bulan ke depan (12 minggu)
      const startDate = new Date(clicked);
      for (let i = 0; i < 12; i++) {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + i * 7); // tiap 7 hari
        const formattedDate = nextDate.toISOString().split("T")[0];

        events.push({
          ...baseEvent,
          date: formattedDate,
          repeatId: clicked, // penanda grup perulangan
        });
      }
    } else {
      // event biasa, tidak berulang
      events.push(baseEvent);
    }

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    alert('Harap isi semua field!');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  const eventForDay = events.find(e => e.date === clicked);

  if (!eventForDay) return;

  // Jika event memiliki repeatId, berarti dia termasuk jadwal berulang
  if (eventForDay.repeatId) {
    const confirmAll = confirm("Hapus semua jadwal berulang ini?\nPilih OK untuk semua, Batal untuk hanya minggu ini.");

    if (confirmAll) {
      // hapus semua event dengan repeatId yang sama
      events = events.filter(e => e.repeatId !== eventForDay.repeatId);
    } else {
      // hapus hanya minggu ini
      events = events.filter(e => e.date !== clicked);
    }
  } else {
    // event biasa
    if (confirm("Yakin ingin menghapus jadwal ini?")) {
      events = events.filter(e => e.date !== clicked);
    }
  }
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
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


// ================== ADMIN PANEL SCRIPT ==================
const studentForm = document.getElementById("addStudentForm");
const studentTable = document.getElementById("studentTable").querySelector("tbody");

let students = JSON.parse(localStorage.getItem("students")) || [];

function renderStudents() {
  studentTable.innerHTML = "";
  students.forEach((s, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.email}</td>
      <td>${s.active ? "Aktif" : "Nonaktif"}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editStudent(${index})">Edit</button>
        <button class="action-btn toggle-btn" onclick="toggleStatus(${index})">
          ${s.active ? "Nonaktifkan" : "Aktifkan"}
        </button>
        <button class="action-btn delete-btn" onclick="deleteStudent(${index})">Hapus</button>
      </td>
    `;
    studentTable.appendChild(row);
  });
}

studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("studentName").value;
  const email = document.getElementById("studentEmail").value;
  const password = document.getElementById("studentPassword").value;

  students.push({ name, email, password, active: true });
  localStorage.setItem("students", JSON.stringify(students));

  studentForm.reset();
  renderStudents();
});

function deleteStudent(index) {
  if (confirm("Yakin ingin menghapus akun ini?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
  }
}

function toggleStatus(index) {
  students[index].active = !students[index].active;
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
}

function editStudent(index) {
  const newName = prompt("Nama baru:", students[index].name);
  if (newName) students[index].name = newName;

  const newEmail = prompt("Email baru:", students[index].email);
  if (newEmail) students[index].email = newEmail;

  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
}

renderStudents();