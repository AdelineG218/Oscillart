// getting input
const input = document.getElementById("input");

// web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// Oscillator node elements
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

// canvas variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = ctx.canvas.width;
const height = ctx.canvas.height;
let counter = 0;
let interval = null;
let x = 0;
let y = height/2;
let freq = 0;

// audio node initialization
oscillator.start();
gainNode.gain.value = 0;

// notes map
let noteMap = new Map();
let noteNames = ["C", "D", "E", "F", "G", "A", "B"];
let noteFreqs = [261.6, 293.7, 329.2, 392, 440, 493.9];
for (let i = 0; i < noteNames.length; i++) {
    noteMap.set(noteNames[i], noteFreqs[i]);
}


// functions
function frequency(pitch) {
    console.log("frequency() called");
    freq = pitch/10000;
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime+1);
}

function line() {
    console.log("line() called");
    const amp = 40;
    y = height/2 + (amp * Math.sin(x*2*Math.PI*freq));
    console.log("x: " + x + "; y: " + y);
    console.log(amp + " " + freq);
    ctx.lineTo(x,y);
    x++;
    counter++;
    if (counter >= 50) {
        clearInterval(interval);
    }
}

function drawWave() {
    console.log("drawWave() called");
    counter = 0;
    ctx.clearRect(0, 0, width, height);
    x = 0;
    y = height/2;
    ctx.moveTo(x, y);
    ctx.beginPath();
    line();
    interval = setInterval(line, 20);
}

function handle() {
    console.log("handle() called");
    audioCtx.resume();
    gainNode.gain.value = 0;
    const pitch = noteMap.get(input.value);
    frequency(pitch);
    drawWave();
}