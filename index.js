const timezones = [
    { city: "Chicago", timezone: "America/Chicago" },
    { city: "Mumbai", timezone: "Asia/Kolkata" },
    { city: "Moscow", timezone: "Europe/Moscow" },
    { city: "Tokyo", timezone: "Asia/Tokyo" }
];
  
let userTimezones = [...timezones];
let currentClockTimezone = userTimezones[0];
  
const timezoneSelect = document.getElementById('timezone-select');
const timeList = document.getElementById('time-list');
const addBtn = document.getElementById('add-location-btn');
  
// Clock Elements
const clockView = document.getElementById('clock-view');
const listView = document.getElementById('list-view');
const tabClock = document.getElementById('tab-clock');
const tabList = document.getElementById('tab-list');

const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');
const clockTime = document.getElementById('clock-time');
const clockCity = document.getElementById('clock-city');
const clockCountry = document.getElementById('clock-country');
  
// View Toggle
tabClock.addEventListener('click', () => {
    tabClock.classList.add('active');
    tabList.classList.remove('active');
    clockView.classList.add('active');
    listView.classList.remove('active');
});
  
tabList.addEventListener('click', () => {
    tabList.classList.add('active');
    tabClock.classList.remove('active');
    listView.classList.add('active');
    clockView.classList.remove('active');
});
  
// Populate Dropdown
async function populateDropdown() {
    try {
        const res = await fetch('https://worldtimeapi.org/api/timezone');
        const zones = await res.json();
        zones.forEach(zone => {
            const option = document.createElement('option');
            option.value = zone;
            option.textContent = zone;
            timezoneSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading timezones:', error);
    }
}
  
// Fetch and update clock
async function updateClock() {
    if (!currentClockTimezone) return;
  
    try {
        const res = await fetch(`https://worldtimeapi.org/api/timezone/${currentClockTimezone.timezone}`);
        const data = await res.json();
        const now = new Date(data.datetime);
    
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
    
        hourHand.style.transform = `rotate(${(hours % 12) * 30 + minutes / 2}deg)`;
        minuteHand.style.transform = `rotate(${minutes * 6}deg)`;
        secondHand.style.transform = `rotate(${seconds * 6}deg)`;
    
        clockTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        clockCity.textContent = currentClockTimezone.city;
        clockCountry.textContent = currentClockTimezone.timezone.split('/')[0];
    } catch (error) {
        console.error('Clock update failed:', error);
    }
}
  
// Fetch list view
async function renderList() {
    timeList.innerHTML = '';
    for (const tz of userTimezones) {
        try {
        const res = await fetch(`https://worldtimeapi.org/api/timezone/${tz.timezone}`);
        const data = await res.json();
        const time = new Date(data.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
        const div = document.createElement('div');
        div.className = 'time-item';
        div.innerHTML = `
          <div class="time-info">
            <div class="location">${tz.city}</div>
            <div class="time">${time}</div>
          </div>
        `;
  
        div.addEventListener('click', () => {
          currentClockTimezone = tz;
          updateClock();
          tabClock.click();
        });
  
        timeList.appendChild(div);
        } catch (e) {
            console.error(`Error loading ${tz.city}`);
        }
    }
}
  
// Add new timezone
addBtn.addEventListener('click', () => {
    const value = timezoneSelect.value;
    if (!value || userTimezones.some(tz => tz.timezone === value)) return;

    const city = value.split('/').pop().replace(/_/g, ' ');
    userTimezones.push({ city, timezone: value });
    renderList();
});

populateDropdown();
renderList();
updateClock();
setInterval(updateClock, 1000);
  