var iframe = document.getElementById("piano_snippet_iframe");
(function() {
	var textbox = document.getElementById("searchText");
	var recording_url = document.getElementById("recording_url");
	var start_record_button = document.getElementById("record_button");
	var stop_record_button = document.getElementById("stop_record_button");
	var playback_button = document.getElementById("playback_button");

	var channels = {};
	var recordingBuffer = [];
	var is_recording = false;
	var delay_start = 0;

    window.addEventListener('message', receiveAudioData, false);
	function receiveAudioData(e) {
	    loadAudioData(JSON.parse(e.data));
	}

	function loadAudioData(data) {
		for (note in data) {
			channels[note] = new Audio("data:audio/ogg;base64," + data[note]);
		}
	}

	var keymap = {
		65: 'c',  // a
		87: 'cs', // w
		83: 'd',  // s
		69: 'eb', // e
		68: 'e',  // d
		70: 'f',  // f
		84: 'fs', // t
		71: 'g',  // g
		89: 'gs', // y
		72: 'a',  // h
		85: 'bb', // u
		74: 'b',  // j
	};

	function keyDownCallback(e) {
		if (e.keyCode in keymap) {
			var key_str = keymap[e.keyCode];
			playNote(key_str);
		}
	}

	function playNote(note) {
		var key = channels[note];
		key.pause();
		key.currentTime = 0;
		key.play();

		if (is_recording) {
			var cur_time = (new Date()).getTime();
			recordingBuffer.push(cur_time - delay_start);
			delay_start = cur_time;
			recordingBuffer.push(note);
		}
	}

	function startRecording() {
		is_recording = true;
		recordingBuffer = [];
		delay_start = (new Date()).getTime();
	}

	function stopRecording() {
		is_recording = false;
		recording_url.value = recordingBuffer.join(";");
	}

	function playbackCallback() {
		playbackRecording(recording_url.value.split(";"));
	}

	function playbackRecording(rec_actions) {
		if (rec_actions.length > 1) {
			var delay = rec_actions.shift();
			var note = rec_actions.shift();
			setTimeout(function() {
				playNote(note);
				playbackRecording(rec_actions);
			}, delay);
		}
	}

	textbox.onkeydown = keyDownCallback;
	start_record_button.onclick = startRecording;
	stop_record_button.onclick = stopRecording;
	playback_button.onclick = playbackCallback;
})();