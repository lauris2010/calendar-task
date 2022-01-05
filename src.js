let nav = 0;
let clickedDay = null;
let events = JSON.parse(sessionStorage.getItem('events')) || [];

const calendar = document.getElementById('calendar');
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

        daySquare.addEventListener('click', () => console.log('click'));
    
        calendar.appendChild(daySquare);
    }
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++
        load()
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--
        load()
    });
}

load()
initButtons()
