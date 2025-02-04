let workTime = 25 * 60;
let restTime = 5 * 60;
let timeLeft = workTime;
let currentMode = 'work';
let timerId = null;
let isRunning = false;
let currentTask = '';

function updateTitle(minutes, seconds) {
    document.title = `(${minutes}:${seconds}) Pomodoro Timer`;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    updateTitle(minutes, seconds);
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            clearInterval(timerId);
            isRunning = false;
            alert('Time is up!');
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    isRunning = false;
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

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    timeLeft = currentMode === 'work' ? workTime : restTime;
    updateDisplay();
}

updateDisplay();
document.getElementById('task-input').addEventListener('keypress', handleTaskInput); 