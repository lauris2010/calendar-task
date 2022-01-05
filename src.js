let nav = 0;
let clickedDay = null;
let clickedEvent = null;
let events = JSON.parse(sessionStorage.getItem('events')) || [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const descriptionTitleInput = document.getElementById('descriptionTitleArea');
const startTime = document.getElementById('startTimeInput');
const selectType = document.getElementById('selectType');
const endTime = document.getElementById('endTimeInput');
const markDay = document.getElementsByClassName('day');
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const typeMap = {
    call: 'Call',
    meeting: 'Meeting',
    outOfOffice: 'Out of office'
};

function openModal(e, date, eventForDay) {
    e.stopPropagation();
    clickedDay = date;

    backDrop.style = 'block';

    if (!eventForDay) {
        newEventModal.style.display = 'block';
        return;
    }

    clickedEvent = eventForDay;

    document.getElementById('eventText').innerText = eventForDay.title;
    document.getElementById('descriptionAreaText').innerText = eventForDay.description;
    document.getElementById('startTimeText').innerText = eventForDay.start;
    document.getElementById('endTimeText').innerText = eventForDay.end;
    document.getElementById('typeText').innerText = typeMap[eventForDay.type];
    document.getElementById('dateText').innerText = eventForDay.date;

    deleteEventModal.style.display = 'block';
}

function handleDaySquareClick(e, daySquare) {
    clearModal();

    const days = document.getElementsByClassName('day');

    Array.from(days).forEach(day => {
        day.classList.remove('active');
    });

    daySquare.classList.add('active');
}

function displayEvents(dayString, daySquare) {
    const eventsForDay = events.filter(e => e.date === dayString);

    if (!eventsForDay.length) {
        return;
    }

    eventsForDay.forEach(eventForDay => {
        const eventDiv = document.createElement('div');

        eventDiv.classList.add('event');
        eventDiv.classList.add(eventForDay.type)
        eventDiv.innerText = eventForDay.title;
        eventDiv.addEventListener('click', (e) => openModal(e, dayString, eventForDay));

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
        daySquare.addEventListener('click', (e) => handleDaySquareClick(e, daySquare))

        if (i <= paddingDays) {
            daySquare.classList.add('padding');
            calendar.appendChild(daySquare);
            continue
        } 
        
        daySquare.innerText = i - paddingDays;
        
        if (i - paddingDays === day && nav === 0) {
            daySquare.id = 'currentDay';
        }

        daySquare.addEventListener('click', (e) => openModal(e, dayString));
        displayEvents(dayString, daySquare);

        calendar.appendChild(daySquare);
    }
}

function clearModal() {
    eventTitleInput.classList.remove('error')
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none'
    eventTitleInput.value= '';
    descriptionTitleInput.value = ''
    deleteEventModal.style.display = 'none'
    startTime.value = ''
    endTime.value = ''
    selectType.value = 'call'
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
            description: descriptionTitleInput.value,
            type: selectType.value,
            start: startTime.value,
            end: endTime.value,
        });

        sessionStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        console.log('event not saved');
    }
}

function deleteEvent() {
    events = events.filter(e => !(e.start === clickedEvent.start && e.end === clickedEvent.end))

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
