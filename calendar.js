let currentYear = 2026;

const norwegianMonths = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

const weekdayHeaders = ['Uke', 'M', 'T', 'O', 'T', 'F', 'L', 'S'];

const holidayDescriptions = {
    'nyttaarsdag': 'Nyttårsdag er fyrste dagen i det nye året. Dagen vert nytta til å ynskja kvarandre godt nytt år og til å kvila etter nyttårsfeiringa. For mange er det ein dag for ettertanke og gode forsett for året som kjem.',
    'skjaertorsdag': 'Skjærtorsdag er torsdagen fyre påske og minnest om den siste kveldsmaten Jesus åt saman med læresveinane sine. Namnet kjem av det gammalnorske ordet «skíra», som tyder å reinsa eller gjera rein. På denne dagen innstifta Jesus nattverden.',
    'langfredag': 'Langfredag er fredagen fyre påske og er den mest alvorlege dagen i kyrkjeåret. Dagen minnest om krossfestingi og dauden til Jesus Kristus. Namnet kjem truleg av at dagen kjennest «lang» på grunn av faste og stille ettertanke.',
    'paaskedag1': 'Fyrste påskedag er den viktigaste høgtidsdagen i den kristne kyrkja. Dagen feirar oppstoda til Jesus Kristus frå dei daude. Påske er ei rørsleg høgtid som fell på den fyrste sundagen etter fyrste fullmåne etter vårjamdøger.',
    'paaskedag2': 'Andre påskedag er dagen etter fyrste påskedag og er framleis ein del av påskefeiringa. I kyrkja les ein om korleis læresveinane møtte den oppstadne Jesus på vegen til Emmaus. Dagen er offentleg fridag i Noreg.',
    'arbeidardag': 'Arbeidaranes dag, òg kalla fyrste mai, er den internasjonale arbeidardagen. Dagen vart fyrst feira i 1890 og er ein dag for arbeidarrørsla til å markera kampen for rettane til arbeidarane. I Noreg er dagen prega av tog og talar.',
    'himmelfart': 'Kristi himmelfartsdag fell førti dagar etter påske og minnest om at Jesus for opp til himmelen. Etter Apostelgjerningane vart Jesus lyft opp medan læresveinane såg på, og ei sky tok han bort frå augo deira.',
    'grunnlovsdag': 'Grunnlovsdagen er den norske nasjonaldagen og feirar grunnlovi som vart vedteki på Eidsvoll den 17. mai 1814. Dagen vert feira med barnetog, bunader, flagg og talar. Det er den største nasjonale festdagen i Noreg.',
    'pinsedag1': 'Fyrste pinsedag fell femti dagar etter påske og feirar at Den heilage ande kom over læresveinane. Pinsa vert rekna som kyrkja sin fødselsdag, då læresveinane byrja å forkynna evangeliet på mange ulike tungemål.',
    'pinsedag2': 'Andre pinsedag er dagen etter fyrste pinsedag og er ein del av pinsefeiringa. Dagen er offentleg fridag i Noreg, og mange nyttar dagen til friluftsliv og samvær med familie og vener.',
    'juledag1': 'Fyrste juledag feirar fødselen til Jesus Kristus i Betlehem. Jula er den nest viktigaste høgtidi i kyrkjeåret etter påska. I Noreg er dagen prega av kyrkjegang, julemat og samvær med dei næraste.',
    'juledag2': 'Andre juledag, òg kalla Stefanusdagen, minnest om den fyrste kristne martyren, Stefanus. Dagen er ein del av julefeiringa og er offentleg fridag. Mange nyttar dagen til å vitja slekt og vener.'
};

function calculateEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month, day);
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getHolidays(year) {
    const easter = calculateEaster(year);

    return [
        { date: new Date(year, 0, 1), name: 'Nyttårsdag', key: 'nyttaarsdag' },
        { date: addDays(easter, -3), name: 'Skjærtorsdag', key: 'skjaertorsdag' },
        { date: addDays(easter, -2), name: 'Langfredag', key: 'langfredag' },
        { date: easter, name: 'Fyrste påskedag', key: 'paaskedag1' },
        { date: addDays(easter, 1), name: 'Andre påskedag', key: 'paaskedag2' },
        { date: new Date(year, 4, 1), name: 'Arbeidaranes dag', key: 'arbeidardag' },
        { date: addDays(easter, 39), name: 'Kristi himmelfartsdag', key: 'himmelfart' },
        { date: new Date(year, 4, 17), name: 'Grunnlovsdagen', key: 'grunnlovsdag' },
        { date: addDays(easter, 49), name: 'Fyrste pinsedag', key: 'pinsedag1' },
        { date: addDays(easter, 50), name: 'Andre pinsedag', key: 'pinsedag2' },
        { date: new Date(year, 11, 25), name: 'Fyrste juledag', key: 'juledag1' },
        { date: new Date(year, 11, 26), name: 'Andre juledag', key: 'juledag2' }
    ];
}

function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplayDate(date) {
    const day = date.getDate();
    const month = norwegianMonths[date.getMonth()].toLowerCase();
    return `${day}. ${month}`;
}

function isHoliday(year, month, day, holidays) {
    const dateStr = formatDate(year, month, day);
    return holidays.some(h => formatDate(h.date.getFullYear(), h.date.getMonth(), h.date.getDate()) === dateStr);
}

function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function createMonth(year, month, holidays) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month';

    const monthName = document.createElement('div');
    monthName.className = 'month-name';
    monthName.textContent = norwegianMonths[month];
    monthDiv.appendChild(monthName);

    const table = document.createElement('table');
    table.className = 'month-table';

    const headerRow = document.createElement('tr');
    weekdayHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    let currentDay = 1;
    let weekRow = document.createElement('tr');

    const weekNumCell = document.createElement('td');
    weekNumCell.textContent = getISOWeek(firstDay);
    weekRow.appendChild(weekNumCell);

    for (let i = 0; i < startDayOfWeek; i++) {
        weekRow.appendChild(document.createElement('td'));
    }

    for (let dayOfWeek = startDayOfWeek; currentDay <= totalDays; dayOfWeek++) {
        if (dayOfWeek === 7) {
            table.appendChild(weekRow);
            weekRow = document.createElement('tr');

            const weekCell = document.createElement('td');
            weekCell.textContent = getISOWeek(new Date(year, month, currentDay));
            weekRow.appendChild(weekCell);

            dayOfWeek = 0;
        }

        const dayCell = document.createElement('td');
        dayCell.textContent = currentDay;

        const isSunday = dayOfWeek === 6;
        const isHol = isHoliday(year, month, currentDay, holidays);

        if (isSunday || isHol) {
            dayCell.className = isSunday ? 'sunday' : 'holiday';
        }

        weekRow.appendChild(dayCell);
        currentDay++;
    }

    const remainingCells = 7 - (weekRow.children.length - 1);
    for (let i = 0; i < remainingCells && remainingCells < 7; i++) {
        weekRow.appendChild(document.createElement('td'));
    }

    if (weekRow.children.length > 1) {
        table.appendChild(weekRow);
    }

    monthDiv.appendChild(table);
    return monthDiv;
}

function renderHolidayList(holidays) {
    const holidayList = document.getElementById('holidayList');
    holidayList.innerHTML = '';

    const sortedHolidays = [...holidays].sort((a, b) => a.date - b.date);

    sortedHolidays.forEach(holiday => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="holiday-date">${formatDisplayDate(holiday.date)}</span>
            <span class="holiday-name">${holiday.name}</span>
            <p class="holiday-description">${holidayDescriptions[holiday.key]}</p>
        `;
        holidayList.appendChild(li);
    });
}

function renderCalendar(year) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const holidays = getHolidays(year);

    for (let month = 0; month < 12; month++) {
        calendar.appendChild(createMonth(year, month, holidays));
    }

    renderHolidayList(holidays);
    document.getElementById('yearDisplay').textContent = year;
    document.title = `Kalender ${year}`;
}

function init() {
    document.getElementById('prevYear').addEventListener('click', () => {
        currentYear--;
        renderCalendar(currentYear);
    });

    document.getElementById('nextYear').addEventListener('click', () => {
        currentYear++;
        renderCalendar(currentYear);
    });

    renderCalendar(currentYear);
}

document.addEventListener('DOMContentLoaded', init);
