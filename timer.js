let workTime = 25 * 60;
let restTime = 5 * 60;
let timeLeft = workTime;
let currentMode = 'work';
let timerId = null;
let isRunning = false;
let currentTask = '';
let sessionStartTime = null;
let workHistory = [];

function updateTitle(minutes, seconds) {
    document.title = `(${minutes}:${seconds}) Pomodoro Timer`;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    updateTitle(minutes, seconds);
}

function updateButtonVisibility(state) {
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    startBtn.className = state === 'initial' ? 'visible' : 'hidden';
    pauseBtn.className = state === 'running' ? 'visible' : 'hidden';
    resetBtn.className = state === 'paused' ? 'visible' : 'hidden';
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    sessionStartTime = new Date();
    updateButtonVisibility('running');
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            clearInterval(timerId);
            isRunning = false;
            if (currentMode === 'work') {
                addHistoryEntry(true);
            }
            updateButtonVisibility('initial');
            alert('Time is up!');
        }
    }, 1000);
}

function pauseTimer() {
    if (isRunning && currentMode === 'work') {
        addHistoryEntry(false);
    }
    clearInterval(timerId);
    isRunning = false;
    updateButtonVisibility('paused');
}

function handleTaskInput(event) {
    if (event.key === 'Enter' && event.target.value.trim()) {
        currentTask = event.target.value.trim();
        document.getElementById('task-prompt').textContent = `You are working on: ${currentTask}`;
        document.getElementById('task-input').classList.add('hidden');
        startTimer();
    }
}

function handleModeToggle(checkbox) {
    const mode = checkbox.checked ? 'rest' : 'work';
    currentMode = mode;
    clearInterval(timerId);
    isRunning = false;
    updateButtonVisibility('initial');
    
    if (mode === 'work') {
        document.getElementById('task-prompt').textContent = 'What are you going to work on?';
        document.getElementById('task-input').value = '';
        document.getElementById('task-input').classList.remove('hidden');
    } else {
        document.getElementById('task-prompt').textContent = 'Time to rest!';
        document.getElementById('task-input').classList.add('hidden');
    }
    
    timeLeft = mode === 'work' ? workTime : restTime;
    updateDisplay();
}

function addHistoryEntry(completed) {
    if (currentMode !== 'work' || !sessionStartTime) return;
    
    const endTime = new Date();
    const minutesWorked = Math.floor((workTime - timeLeft) / 60);
    
    const entry = {
        date: endTime.toLocaleDateString(),
        time: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        task: currentTask || 'Unnamed Task',
        completed: completed,
        minutesWorked: minutesWorked
    };
    
    workHistory.unshift(entry);
    updateHistoryTable();
    saveHistory();
}

function updateHistoryTable() {
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = '';
    
    workHistory.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.time}</td>
            <td>${entry.task}</td>
            <td class="${entry.completed ? 'status-complete' : 'status-incomplete'}">
                ${entry.completed ? 'Complete' : `${entry.minutesWorked} min`}
            </td>
            <td>
                <button class="delete-entry" onclick="deleteEntry(${index})">&times;</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function saveHistory() {
    localStorage.setItem('pomodoroHistory', JSON.stringify(workHistory));
}

function loadHistory() {
    const saved = localStorage.getItem('pomodoroHistory');
    if (saved) {
        workHistory = JSON.parse(saved);
        updateHistoryTable();
    }
}

function resetTimer() {
    if (isRunning && currentMode === 'work') {
        addHistoryEntry(false);
    }
    clearInterval(timerId);
    isRunning = false;
    timeLeft = currentMode === 'work' ? workTime : restTime;
    updateDisplay();
    updateButtonVisibility('initial');
}

function clearHistory() {
    if (confirm('Are you sure you want to clear your work history? This cannot be undone.')) {
        workHistory = [];
        updateHistoryTable();
        saveHistory();
    }
}

function deleteEntry(index) {
    workHistory.splice(index, 1);
    updateHistoryTable();
    saveHistory();
}

updateDisplay();
loadHistory();
updateButtonVisibility('initial');
document.getElementById('task-input').addEventListener('keypress', handleTaskInput); 