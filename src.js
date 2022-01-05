let nav = 0;
let clickedDay = null;
let clickedEvent = null;
let events = JSON.parse(sessionStorage.getItem('events')) || [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function openModal(date, eventForDay) {
    clickedDay = date;
    
    backDrop.style = 'block';

    if (!eventForDay) {
        newEventModal.style.display = 'block';
        return;
    }

    clickedEvent = eventForDay;
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
}

function displayEvents(dayString, daySquare) {
    const eventsForDay = events.filter(e => e.date === dayString);

    if (!eventsForDay.length) {
        return;
    }

    eventsForDay.forEach(eventForDay => {
        const eventDiv = document.createElement('div');

        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        eventDiv.addEventListener('click', (e) => openModal(dayString, eventForDay));

        daySquare.appendChild(eventDiv);
    });
}

function load() {
    const currentDate = new Date();

    if (nav !== 0) {
        currentDate.setMonth(new Date().getMonth() + nav);
    }

    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOnMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month +1, 0).getDate();

    const dateString = firstDayOnMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText = `${currentDate.toLocaleDateString('en-us', {month: 'long'})} ${year}`;
    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const dayString = `${month + 1}/${i - paddingDays}/${year}`
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');
        

        if (i <= paddingDays) {
            daySquare.classList.add('padding');
            calendar.appendChild(daySquare);
            continue
        } 
        
        daySquare.innerText = i - paddingDays;
        
        if (i - paddingDays === day && nav === 0) {
            daySquare.id = 'currentDay';
        }

        daySquare.addEventListener('click', () => openModal(dayString));
        displayEvents(dayString, daySquare);

        calendar.appendChild(daySquare);
    }
}

function clearModal() {
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none'
    eventTitleInput.value= '';
    deleteEventModal.style.display = 'none'
    clickedDay = null
}

function closeModal() {
    clearModal()
    load()
}

function saveEvent () {
    if (eventTitleInput.value) {
        events.push({
            date: clickedDay,
            title: eventTitleInput.value,
        });

        sessionStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        console.log('event not saved');
    }
}

function deleteEvent() {
    events = events.filter(e => !(e.title === clickedEvent.title))

    if (window.confirm("Are you sure you want to delete this event?")) {
        sessionStorage.setItem('events', JSON.stringify(events));
        closeModal();
    }
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++
        load()
    })
    document.getElementById('backButton').addEventListener('click', () => {
        nav--
        load()
    })
    document.getElementById('saveButton').addEventListener('click', saveEvent)
    document.getElementById('cancelButton').addEventListener('click', closeModal)
    document.getElementById('deleteButton').addEventListener('click', deleteEvent)
    document.getElementById('closeButton').addEventListener('click', closeModal)
}

load()
initButtons()
