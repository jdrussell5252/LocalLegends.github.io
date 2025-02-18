const container = document.querySelector(".chart-container");

let scrollAmount = 0;
const scrollMax = container?.scrollWidth - container?.clientWidth;

function autoScroll() {
    if (scrollAmount >= scrollMax) {
        scrollAmount = 0;
    } else {
        scrollAmount += 2; // Adjust speed
    }
    container?.scrollTo({ left: scrollAmount, behavior: "smooth" });
}

setInterval(autoScroll, 50);

// Calendar functionality
let currentYear = 2025;
let currentMonth = 1; // February 2025 (Months are 0-based)

document.addEventListener('DOMContentLoaded', () => {
    updateCalendar(currentYear, currentMonth);
});

// Update the calendar display for a given year and month
function updateCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    const currentMonthLabel = document.getElementById('currentMonth');
    calendar.innerHTML = '';

    // Set the current month label
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthLabel.textContent = `${monthNames[month]} ${year}`;

    // Generate events dynamically
    const events = {};

    // Hardcoded events for February 2025
    if (year === 2025 && month === 1) {
        events['2025-02-15'] = [
            { artist: 'Local Band A', location: 'The Music Spot' },
            { artist: 'DJ Night', location: 'City Square' }
        ];
        events['2025-02-20'] = [
            { artist: 'Jazz Ensemble', location: 'Riverfront Stage' }
        ];
        events['2025-02-25'] = [
            { artist: 'Rock Night', location: 'Arena' }
        ];
    }

    // Generate sample events for other months (without overwriting February)
    for (let day = 5; day <= 20; day += 5) {
        const eventDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Only add placeholder events if no existing events for that date
        if (!events[eventDate]) {
            events[eventDate] = [
                { artist: `Artist ${day}`, location: `Venue ${day}` }
            ];
        }
    }

    // Add days of the week headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const header = document.createElement('div');
        header.classList.add('calendar-day', 'calendar-header');
        header.textContent = day;
        calendar.appendChild(header);
    });

    // Calculate the first day of the month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'empty');
        calendar.appendChild(emptyCell);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.textContent = day;

        // Check if this day has events
        if (events[date]) {
            dayCell.classList.add('event-day');
            dayCell.title = events[date]
                .map(event => `${event.artist} - ${event.location}`)
                .join('\n');

            // Add green dot for event indicator
            const dot = document.createElement('div');
            dot.classList.add('event-dot');
            dayCell.appendChild(dot);
        }

        // Add click event for showing events
        dayCell.addEventListener('click', () => openEventModal(date, events));
        calendar.appendChild(dayCell);
    }

    // Disable "Previous Month" if before February 2025
    const prevButton = document.getElementById('prevMonth');
    prevButton.disabled = (year === 2025 && month === 1);
}

// Open event modal for the selected date
function openEventModal(date, events) {
    const modal = document.getElementById('eventModal');
    const dateHeader = document.getElementById('eventDate');
    const details = document.getElementById('eventDetails');

    dateHeader.textContent = `Events on ${date}`;
    const eventList = events[date] || [];
    details.innerHTML = eventList.length
        ? eventList.map(event => `<p><strong>${event.artist}</strong> at ${event.location}</p>`).join('')
        : '<p>No events scheduled for this date.</p>';

    modal.style.display = 'block';
}

// Close the event modal
function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
}

// Close modal when clicking outside it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('eventModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Change month function
function changeMonth(direction) {
    // Increment/decrement month
    currentMonth += direction;

    // Adjust year if necessary
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    // Prevent going earlier than February 2025
    if (currentYear < 2025 || (currentYear === 2025 && currentMonth < 1)) {
        currentYear = 2025;
        currentMonth = 1;
    }

    updateCalendar(currentYear, currentMonth);
}
