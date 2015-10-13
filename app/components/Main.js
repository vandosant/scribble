require('expose?$!expose?jQuery!jquery');
var context = require("./Context");
var keyboard = require("./Keyboard");
var oscillatorController = require("./OscillatorController");
var DrumController = require("./DrumController");
var drumMachine = require("./DrumMachine");
var oscillator = require("./Oscillator");
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
  drumController.selectDrum('bass');
  drumController.start('drum-status');
  drumController.listen('#tempo', '.drum-button', '.drum-type', 'drum-status', '.drum-volume');
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
})
