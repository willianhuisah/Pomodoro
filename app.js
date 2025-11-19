// Variables de estado
let timer; // Para almacenar el intervalo
let isRunning = false;
let isWorkTime = true;
let cycles = 0;
let timeRemaining;

// Referencias a elementos del DOM
const timeDisplay = document.getElementById('time-display');
const phaseDisplay = document.getElementById('current-phase');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const cyclesCompleted = document.getElementById('cycles-completed');
const workInput = document.getElementById('work-duration');
const shortBreakInput = document.getElementById('short-break-duration');
const longBreakInput = document.getElementById('long-break-duration');

// Función principal para inicializar el tiempo según la fase
function initializeTimer() {
    let minutes;
    if (isWorkTime) {
        minutes = parseInt(workInput.value) || 25;
        phaseDisplay.textContent = "¡Es hora de Concentrarse!";
        timeDisplay.style.color = '#007bff';
    } else {
        // Decide si es descanso corto o largo (cada 4 ciclos)
        if (cycles % 4 === 0 && cycles !== 0) {
            minutes = parseInt(longBreakInput.value) || 15;
            phaseDisplay.textContent = "¡Descanso Largo! Tómate un respiro real. 🏖️";
        } else {
            minutes = parseInt(shortBreakInput.value) || 5;
            phaseDisplay.textContent = "¡Descanso Corto! Estira las piernas. 🤸";
        }
        timeDisplay.style.color = '#28a745'; // Color de descanso
    }
    timeRemaining = minutes * 60;
    updateDisplay();
}

// Función para actualizar la visualización del tiempo
function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    // Formato MM:SS
    timeDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Lógica de cuenta regresiva
function countdown() {
    if (timeRemaining <= 0) {
        clearInterval(timer);
        handlePhaseEnd(); // Maneja el cambio de fase
        return;
    }
    timeRemaining--;
    updateDisplay();
}

// Maneja el fin de un ciclo (trabajo o descanso)
function handlePhaseEnd() {
    // Si terminó el tiempo de trabajo
    if (isWorkTime) {
        cycles++; // Incrementa el contador de ciclos
        cyclesCompleted.textContent = Math.floor(cycles / 2); // Muestra solo los ciclos de trabajo completados
        // Aquí podrías agregar un mensaje de bienestar o un sonido de notificación
    }
    
    // Cambia la fase (trabajo <-> descanso)
    isWorkTime = !isWorkTime;
    
    // Reinicia el estado del botón y el temporizador para la nueva fase
    isRunning = false;
    startPauseBtn.textContent = 'Iniciar';
    initializeTimer();
}

// Lógica para iniciar/pausar
function toggleTimer() {
    if (isRunning) {
        // Pausar
        clearInterval(timer);
        startPauseBtn.textContent = 'Reanudar';
        isRunning = false;
    } else {
        // Iniciar
        timer = setInterval(countdown, 1000);
        startPauseBtn.textContent = 'Pausar';
        isRunning = true;
    }
}

// Lógica para reiniciar
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkTime = true; // Siempre volvemos a la fase de trabajo
    cycles = 0;
    cyclesCompleted.textContent = '0';
    startPauseBtn.textContent = 'Iniciar';
    initializeTimer();
}

// Event Listeners (Controladores de Eventos)
startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

// Asegurar que al cambiar los inputs se actualice la pantalla
workInput.addEventListener('change', initializeTimer);
shortBreakInput.addEventListener('change', initializeTimer);
longBreakInput.addEventListener('change', initializeTimer);

// Inicializar la aplicación al cargar
initializeTimer();