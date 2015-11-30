var recordingVideo=false;
var recordingAudio=false;
$(document).ready(function(){
	if (hasGetUserMedia()) {
      // Good to go!
    } else {
      alert('getUserMedia() is not supported in your browser');
    }

    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia  = navigator.getUserMedia || 
                             navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia || 
                               navigator.msGetUserMedia;

    var video = document.querySelector('video');
    var streamRecorder;
    var webcamstream;
    
    if (navigator.getUserMedia) {
      navigator.webkitGetUserMedia({audio: true, video: true}, function(stream) {
		console.log(2);
        video.src = window.URL.createObjectURL(stream);
        webcamstream = stream;
        streamrecorder = webcamstream.record();
      }, onVideoFail);
    } else {
        alert ('failed');
    }

});

function onVideoFail(e) {
    console.log('webcam fail!', e);
  };

function hasGetUserMedia() {
  // Note: Opera is unprefixed.
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}



function startRecording() {
	if(!recordingVideo){
		$("#recording").css("opacity" , '1')
	}
	else
		$("#recording").css("opacity" , '0')
    // streamRecorder = webcamstream.record();
    setTimeout(stopRecording, 10000);
    recordingVideo=!recordingVideo;
}
function stopRecording() {
    streamRecorder.getRecordedData(postVideoToServer);
}
function postVideoToServer(videoblob) {


    var data = {};
    data.video = videoblob;
    data.metadata = 'test metadata';
    data.action = "upload_video";
    //jQuery.post("http://www.kongraju.in/uploadvideo.php", data, onUploadSuccess);
}
function onUploadSuccess() {
    alert ('video uploaded');
}

function answeru(){
	$('#messages').append('<div id="message"><div id="me"><p>'.concat($("#answer").val()));

	$("#eom").css('display' , 'inline');
		$("#eom").focus();
		setTimeout(function() { $("#eom").css("display" , 'none') }, 100);

}

$("#mic").click(function(){
	if(recordingAudio){
		$("#answer").attr("placeholder", "Audio Recorded");
	}
    $("#answer").attr("placeholder", "Recording");
    recordingAudio = !recordingAudio;
});