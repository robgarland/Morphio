
//global set-up for start app
const app_h = document.getElementById("appstart-heading");
const app_p = document.getElementById("appstart-paragraph");
const contentarea = document.querySelector("#contentarea");
const videoarea = document.querySelector("#videoarea");
const appstartarea = document.querySelector("#appstartarea");
const video = document.getElementById("video");
video.setAttribute('muted', '');
video.setAttribute('playsinline', '');
video.style.width = '320';
video.style.height = '180';
const constraints = {audio:false,video: { width: 320, height: 180 }};
const aro_p = document.getElementById("arousal");
const val_p = document.getElementById("valence");
var shape = document.querySelector("#shape");
var arousal = 0;
var valence = 0;
var angle = 0;
var rgba = "";
var preset = "";

function startApp() {
	contentarea.style.display = "block";
	appstartarea.style.display = "none";

	window.addEventListener(CY.modules().FACE_AROUSAL_VALENCE.eventName, (evt) => {
	  aro_p.innerHTML = 'Arousal: ' + evt.detail.output.calibrated.arousal;
	  arousal = evt.detail.output.calibrated.arousal;
	  val_p.innerHTML = 'Valence: ' + evt.detail.output.calibrated.valence;
	  valence = evt.detail.output.calibrated.valence;
	  angle = calcAng(arousal,valence);
	  rgba = calcRGBA(angle);
	  modifyShape(rgba);
	});
	
	setTimeout(goToComplete, 15000);
};

function calcAng(arousal,valence) {
	var hyp = Math.sqrt(arousal**2 + valence**2);
	
	if (valence >= 0) {
		ang = Math.asin(arousal/hyp)*(180/Math.PI);
	} else if (valence < 0 && arousal < 0) {
		ang = -180 - Math.asin(arousal/hyp)*(180/Math.PI);
	} else {
		ang = 180 - Math.asin(arousal/hyp)*(180/Math.PI);
	};
	return ang;
};

function calcRGBA(ang) {
	var r = 0;
	var g = 0;
	var b = 0;
	var a = 1;
	
	if (ang > 150) {
		r = (-255/60)*ang + 892.5;
	} else if (ang < -150) {
		r = (-255/60)*ang - 637.5;
	} else if (-30 < ang && ang < 30) {
		r = (255/60)*ang + 127.5;
	} else if (30 <= ang && ang <= 150) {
		r = 255;
	} else {
		r = 0;
	};
	
	if (30 < ang && ang < 90) {
		g = (-255/60)*ang + 382.5;
	} else if (-150 < ang && ang < -90) {
		g = (255/60)*ang +  637.5;
	} else if (-90 <= ang && ang <= 30) {
		g = 255;
	} else {
		g = 0;
	};
	
	if (ang >= 150 || ang <= -90) {
		b = 255;
	} else if (-90 < ang && ang < -30) {
		b = (-255/60)*ang - 127.5;
	} else if (90 < ang && ang < 150) {
		b = (255/60)*ang - 382.5;
	} else {
		b = 0;
	};
	
	return "rgba("+r+","+g+","+b+","+a+")"
};

function modifyShape(color) {
	shape.style.background = "linear-gradient(45deg, rgba(255,255,255,1) 0%,"+color+"100%)";
};

function goToPresets() {
	welcome = document.querySelector("#welcome");
	presets = document.querySelector("#presets");
	welcome.style.display = "none";
	presets.style.display = "block";
};

function selectPreset(preset_id) {
	introductions = document.querySelector("#introductions");
	presenting = document.querySelector("#presenting");
	discussions = document.querySelector("#discussions");
	reactions = document.querySelector("#reactions");
	
	if (preset_id == "introductions") {
		preset = "introductions";
		introductions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255, 82, 107, 1))";
		presenting.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
		discussions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
		reactions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
	} else if (preset_id == "presenting") {
		preset = "presenting";
		introductions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
		presenting.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255, 82, 107, 1))";
		discussions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
		reactions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
	} else if (preset_id == "discussions") {
		preset = "discussions";
		introductions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
		presenting.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
		discussions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255, 82, 107, 1))";
		reactions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
	} else {
		preset = "reactions";
		introductions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
		presenting.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
		discussions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255,255,255,0.45))";
		reactions.style.background = "linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.55),rgba(255, 82, 107, 1))";
	};
}

function goToApp() {
	presets = document.querySelector("#presets");
	app = document.querySelector("#app");
	errmsg = document.getElementById("preset-error-msg")
	
	
	if (preset != ""){
		presets.style.display = "none";
		app.style.display = "block";
		if (preset == "introductions"){
			app_h.innerHTML = 'Introductions';
			app_p.innerHTML = 'Look at the morph and introduce yourself.<br><br>The morph will react to how it perceives your introduction. <br><br>The morph will grow, the closer it perceives the introduction to our target. The morph will shrink the further away from the target you are.<br><br>Remember:<br>- Aim for pleasantness<br>- Energise your tone of voice.<br><br>Example Speech:<br>"Hi, My name is Blobby, lovely to meet you! I am excited to speak with you all!"<br><br>Target Facial Expression: Delight<br>Target Vocal Tone: Happy ';
		} else if (preset == "presenting") {
			app_h.innerHTML = 'Presenting';
			app_p.innerHTML = 'Look at the morph and simulate presenting a subject you specialise in.<br><br>The morph will grow, the closer it perceives the presentation to our target. The morph will shrink the further away from the target you are.<br><br>Remember:<br>- Be confident<br>- You are trying to build trust.<br><br>Example Speech:<br>"The key point to remember is that using these projections, we will be in a significantly better place."<br><br>Target Facial Expression: Feel Well<br>Target Vocal Tone: Neutral ';
		} else if (preset == "discussions") {
			app_h.innerHTML = 'Discussions';
			app_p.innerHTML = 'Look at the morph and try to test your understanding of a subject you would like to question.<br><br>The morph will grow, the closer it perceives the question to our target. The morph will shrink the further away from the target you are.<br><br>Remember:<br>- Relax<br>- Try to reduce over exaggerating specific words.<br><br>Example Speech:<br>"Am I right in thinking that you believe cows can jump over the moon?"<br><br>Target Facial Expression: Relaxed<br>Target Vocal Tone: Neutral';
		} else {
			app_h.innerHTML = 'Reactions';
			app_p.innerHTML = 'When reacting it is key to make sure your tone of voice and facial expressions are telling the same story. <br><br>The morph will grow, the closer it perceives the reaction to your target. The morph will shrink the further away from the target you are.<br><br>Select a pairing to practise:';
		};
		videoarea.style.display = "block";
	
		CY.loader()
			.licenseKey("f03e9029cabdb5709886d5a4ce136b9130fe94c903fd")
			.addModule(CY.modules().FACE_AROUSAL_VALENCE.name)
			.source(CY.createSource.fromCamera({constraints, video}))
			.load()
			.then(({ start, stop }) => start());
	} else {
		errmsg.style.display = "inline-block";
	};
};
		
function goToComplete() {		
	app = document.querySelector("#app");
	complete = document.querySelector("#complete");
	app.style.display = "none";
	complete.style.display = "block";
};

function goToFinish() {		
	finish = document.querySelector("#finish");
	complete = document.querySelector("#complete");
	complete.style.display = "none";
	finish.style.display = "block";
};

function goToRetry() {		
	app = document.querySelector("#app");
	complete = document.querySelector("#complete");
	complete.style.display = "none";
	app.style.display = "block";
	setTimeout(goToComplete, 15000);
};

function backToPresets() {
	complete = document.querySelector("#complete");
	presets = document.querySelector("#presets");
	complete.style.display = "none";
	presets.style.display = "block";
};

//END OF CODE