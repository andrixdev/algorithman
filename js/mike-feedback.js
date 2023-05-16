navigator.getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	
let isFeedbackActive = false
var aCtx;
var analyser;
var microphone;
var gain = .4

if (navigator.getUserMedia && isFeedbackActive) {
	navigator.getUserMedia(
		{audio: true}, 
		function(stream) {
			aCtx = new AudioContext();
			microphone = aCtx.createMediaStreamSource(stream);
			var destination=aCtx.destination;
			var gainNode = new GainNode(aCtx);
			gainNode.gain.value = gain;
			microphone.connect(gainNode);
			gainNode.connect(destination);
		},
		function() { console.log("Error in getting user media.")}
	)
}