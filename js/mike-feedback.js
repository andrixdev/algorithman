navigator.getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    
var aCtx;
var analyser;
var microphone;

if (navigator.getUserMedia) {
  navigator.getUserMedia(
    {audio: true}, 
    function(stream) {
      aCtx = new AudioContext();
      microphone = aCtx.createMediaStreamSource(stream);
      var destination=aCtx.destination;
	  var gain = new GainNode(aCtx);
	  gain.gain.value = .2;
	  console.log(microphone);
      microphone.connect(gain);
      gain.connect(destination);
    },
    function(){ console.log("Error 003.")}
  );
}