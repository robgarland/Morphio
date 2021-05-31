(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;

  const aro_p = document.querySelector("#arousal");
  const val_p = document.querySelector("#valence");
  
  var arousal = 0
  var valence = 0
  var angle = 0


  function startup() {
	video = document.getElementById('video');
	
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
	.then(function(stream) {
	  video.srcObject = stream;
	  video.play();
	})
	.catch(function(err) {
	  console.log("An error occurred: " + err);
	});

	video.addEventListener('canplay', function(ev){
	  if (!streaming) {
		height = video.videoHeight / (video.videoWidth/width);
	  
		// Firefox currently has a bug where the height can't be read from
		// the video, so we will make assumptions if this happens.
	  
		if (isNaN(height)) {
		  height = width / (16/9);
		}
	  
		video.setAttribute('width', width);
		video.setAttribute('height', height);
		streaming = true;
	  }
	}, false);
	
	const customSource = CY.createSource.fromVideoElement(video);
	
	CY.loader()
	.source(customSource)
      .licenseKey("f03e9029cabdb5709886d5a4ce136b9130fe94c903fd")
      .addModule(CY.modules().FACE_AROUSAL_VALENCE.name)
      .load()
      .then(({ start, stop }) => start());
	
	window.addEventListener(CY.modules().FACE_AROUSAL_VALENCE.eventName, (evt) => {
	  aro_div.innerHTML = 'Arousal: ' + evt.detail.output.calibrated.arousal;
      arousal = evt.detail.output.calibrated.arousal
      val_div.innerHTML = 'Valence: ' + evt.detail.output.calibrated.valence;
	  valence = evt.detail.output.calibrated.valence
	});

  }

  // Fill the photo with an indication that none has been
  // captured.

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
  
})();