require('expose?$!expose?jQuery!jquery');
import context from "./Context";
import keyboardModel from "./Keyboard";
import keyboardController from "./keyboardController";
import oscillatorController from "./OscillatorController";
import DrumController from "./DrumController";
import drumMachine from "./DrumMachine";
import oscillator from "./Oscillator";
import visualizer from "./Visualizer";

var drumVol = 1.3;
var drums = [
  {
    identifier: 'bass',
    'bass': {
    'machine': drumMachine({context: context, frequency: 47, wave: 'sine', gainVal: drumVol, sustain: 0.03})
    }
  },
  {
    identifier: 'tom1',
    'tom1': {
    'machine': drumMachine({context: context, frequency: 64, wave: 'sine', gainVal: drumVol, sustain: 0.05})
    }
  },
  {
    identifier: 'tom2',
    'tom2': {
    'machine': drumMachine({context: context, frequency: 160, wave: 'sine', gainVal: drumVol, sustain: 0.05})
    }
  },
  {
    identifier: 'snare',
    'snare': {
    'machine': drumMachine({context: context, frequency: 188, wave: 'sine', gainVal: drumVol, sustain: 0.07})
    }
  },
  {
    identifier: 'pad',
    'pad': {
    'machine': drumMachine({context: context, frequency: 261.63, wave: 'triangle', gainVal: drumVol, sustain: 0.02})
    }
  }
];
var drumController = DrumController(drums, 'drums', 180, drumVol);
$('#drums').ready(function() {
  drumController.render();
  var bassElement = document.getElementById('bass');
  drumController.selectDrum(bassElement);
  drumController.start('drum-status');
  drumController.listen('tempo', 'drum-button', 'drum-type', 'drum-status', 'drum-volume');
});

var oscillatorCtrl = oscillatorController({
  oscillators: [],
  initialVolume: 0,
  initialFrequency: 261.63,
  oscillatorSelector: '.oscillator-wave'
});
oscillatorCtrl.initialize();

$('.oscillator-container').ready(function() {
  $('.oscillator-mode').change(function () {
    var modes = {
      standard: ['sine', 'sine', 'triangle'],
      raspy: ['sine', 'square', 'sawtooth'],
      organ: ['sine', 'sine', 'sine'],
      game: ['square', 'sine', 'triangle']
    };
    var mode = $(this).val();
    oscillatorCtrl.update(modes[mode]);
    $('.oscillator-wave').each(function (oscSelector) {
      $(this).val(modes[mode][oscSelector])
    });
  });
  $('.oscillator-wave').change(function () {
    var id = Number(this.id);
    var wave = $(this).val();
    oscillatorCtrl.updateWave(id, wave);
  });
});

$(document).ready(function() {
  var keyboard = keyboardModel({volumeSelector: "keyboard-volume", oscillators: oscillatorCtrl.oscillators});
  keyboard.initialize();

  var keyboardCtrl = keyboardController(keyboard);
  keyboardCtrl.octaves.listen({octaveUpId: "octave-up", octaveDownId: "octave-down"});

  var nodes = [];
  for (var i = 0; i < oscillatorCtrl.oscillators.length; i++) {
    nodes.push(oscillatorCtrl.oscillators[i].gainNode1)
  }
  visualizer('top', nodes)
});
