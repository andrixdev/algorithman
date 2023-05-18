// 2023-05-09 Alex Andrix starts hacking this file for use with Muse 2 EEG headband
let EEG = {}
var eeg1 = 0, eeg2 = 0, eeg3 = 0, eeg4 = 0;
var drlref1 = 0, drlref2 = 0;
var ppg1 = 0, ppg2 = 0, ppg3 = 0;
let eegSum = 0

let handleMsg = (msg) => {
    // Addresses sent by Muse 2: /ppg (heart), /eeg, /acc, /gyro, /drlref (noise suppression)
    if (msg.address == "/eeg") {
        eeg1 = msg.args[0]; // TP 9 electrode
        eeg2 = msg.args[1]; // AF 7 electrode
        eeg3 = msg.args[2]; // AF 8 electrode
        eeg4 = msg.args[3]; // TP 10 electrode
    } else if (msg.address == "/drlref") {
        drlref1 = msg.args[0];
        drlref2 = msg.args[1];
    } else if (msg.address == "/ppg") {
        ppg1 = msg.args[0];
        ppg2 = msg.args[1];
        ppg3 = msg.args[2];
    } else if (msg.address == "/test") {
        console.log("TEST MESSAGE RECEIVED");
    }
}
let eegInterval = setInterval(() => {
	eegSum = eeg1 + eeg2 + eeg3 + eeg4
}, 100)

// Canvas plot
let c = document.getElementById('eeg-canvas')
let ctx = c.getContext('2d')
ctx.imageSmoothingEnabled = false
ctx.strokeStyle = 'hsl(200, 83%, 42%)'
ctx.lineWidth = 1.5
let quickClean = false
let w = 400
let h = 400
let cx = w / 2, cy = h / 2
let rad = 100
let angle = 0
let x0 = cx + rad * Math.cos(angle)
let y0 = cy + rad * Math.sin(angle)
ctx.moveTo(x0, y0)
let canvasFrame = () => {
	ctx.fillStyle = 'rgba(255, 255, 255, ' + (quickClean ? 0.2 : 0.04) + ')'
	ctx.fillRect(0, 0, w, h)
	ctx.beginPath()
	let x1 = cx + rad * Math.cos(angle)
	let y1 = cy + rad * Math.sin(angle)
	angle += 0.01
	rad = eegSum / 20
	let x2 = cx + rad * Math.cos(angle)
	let y2 = cy + rad * Math.sin(angle)
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.stroke()
	requestAnimationFrame(canvasFrame)
}
canvasFrame()

// Regularly full clean canvas
let canvasInterval = setInterval(() => {
	quickClean = true
	setTimeout(() => {
		quickClean = false
	}, 1500)
}, 60000)

let oscPort = new osc.WebSocketPort({
    url: "ws://localhost:8081"
});

oscPort.open();

oscPort.socket.onmessage = function (e) {
    console.log("message", e);
};

oscPort.on("message", handleMsg);
