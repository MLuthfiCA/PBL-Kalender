let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");

const eventTitleInput = document.querySelector('input[placeholder="Nama Mata Kuliah"]');
const eventDosenInput = document.querySelector('input[placeholder="Nama Dosen"]');
const eventTimeInput = document.getElementById("eventTime");
const eventRoomInput = document.getElementById("eventRoom");
const eventText = document.getElementById("eventText");
const monthDisplay = document.getElementById("monthDisplay");

const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function openModal(date) {
  clicked = date;
  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    eventText.innerText = `${eventForDay.title} | ${eventForDay.time} | ${eventForDay.room}`;
    if (eventForDay.dosen) {
      eventText.innerText += ` | Dosen: ${eventForDay.dosen}`;
    }

    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }
  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const paddingDays = weekdays.indexOf(
    dateString.split(", ")[0].slice(0, 3)
  );

  monthDisplay.innerText = `${dt.toLocaleDateString("id-ID", {
    month: "long",
  })} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${year}-${(month + 1)
      .toString()
      .padStart(2, "0")}-${(i - paddingDays).toString().padStart(2, "0")}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      const eventForDay = events.find((e) => e.date === dayString);
      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = `${eventForDay.title}`;

        // tampilkan dosen kecil di bawah nama mata kuliah
        if (eventForDay.dosen) {
          const dosenDiv = document.createElement("div");
          dosenDiv.classList.add("event-dosen");
          dosenDiv.style.fontSize = "11px";
          dosenDiv.style.color = "#444";
          dosenDiv.innerText = `Dosen: ${eventForDay.dosen}`;
          eventDiv.appendChild(dosenDiv);
        }

        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  eventTitleInput.value = "";
  eventDosenInput.value = "";
  eventTimeInput.value = "";
  eventRoomInput.value = "";

  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  clicked = null;
  load();
}

function saveEvent() {
  if (
    eventTitleInput.value.trim() === "" ||
    eventDosenInput.value.trim() === "" ||
    eventTimeInput.value.trim() === "" ||
    eventRoomInput.value.trim() === ""
  ) {
    alert("Harap isi semua field sebelum menyimpan!");
    return;
  }

  events.push({
    date: clicked,
    title: eventTitleInput.value,
    dosen: eventDosenInput.value,
    time: eventTimeInput.value,
    room: eventRoomInput.value,
  });

  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

document.getElementById("nextButton").addEventListener("click", () => {
  nav++;
  load();
});

document.getElementById("backButton").addEventListener("click", () => {
  nav--;
  load();
});

document.getElementById("saveButton").addEventListener("click", saveEvent);
document.getElementById("cancelButton").addEventListener("click", closeModal);
document.getElementById("deleteButton").addEventListener("click", deleteEvent);
document.getElementById("closeButton").addEventListener("click", closeModal);

load();
