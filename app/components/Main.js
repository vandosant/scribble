require('expose-loader?$!expose-loader?jQuery!jquery');
import context from './Context';
import keyboardModel from './Keyboard';
import keyboardController from './keyboardController';
import oscillatorController from './OscillatorController';
import DrumController from './DrumController';
import drumMachine from './DrumMachine';
import oscillator from './Oscillator';
import visualizer from './Visualizer';
import recorder from './Recorder';

recorder({record: '#record', stop: '#stop', play: '#play'})
.then(function(stream) {
  console.log('stream available')
})
.catch(function(err) {
  console.error('Error:', err);
});
var drumVol = 1.3;
var viz = visualizer();
var drums = [
  {
    identifier: 'bass',
    'bass': {
      'machine': drumMachine({context: context, frequency: 47, wave: 'sine', gainVal: drumVol, sustain: 0.03, viz: viz})
    }
  },
  {
    identifier: 'tom1',
    'tom1': {
      'machine': drumMachine({context: context, frequency: 64, wave: 'sine', gainVal: drumVol, sustain: 0.05, viz: viz})
    }
  },
  {
    identifier: 'tom2',
    'tom2': {
      'machine': drumMachine({
        context: context,
        frequency: 160,
        wave: 'sine',
        gainVal: drumVol,
        sustain: 0.05,
        viz: viz
      })
    }
  },
  {
    identifier: 'snare',
    'snare': {
      'machine': drumMachine({
        context: context,
        frequency: 188,
        wave: 'sine',
        gainVal: drumVol,
        sustain: 0.07,
        viz: viz
      })
    }
  },
  {
    identifier: 'pad',
    'pad': {
      'machine': drumMachine({
        context: context,
        frequency: 261.63,
        wave: 'triangle',
        gainVal: drumVol,
        sustain: 0.02,
        viz: viz
      })
    }
  }
];
var drumController = DrumController(drums, 'drums', 180, drumVol);
document.addEventListener('DOMContentLoaded', function () {
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

document.addEventListener('DOMContentLoaded', function () {
  const oscillatorMode = document.querySelector('.oscillator-mode')
  oscillatorMode.addEventListener('change', function (event) {
    event.preventDefault();
    var modes = {
      standard: ['sine', 'sine', 'triangle'],
      raspy: ['sine', 'square', 'sawtooth'],
      organ: ['sine', 'sine', 'sine'],
      game: ['square', 'sine', 'triangle']
    };
    const mode = event.target.value;
    oscillatorCtrl.update(modes[mode]);
    const oscillatorWaves = document.querySelector('.oscillator-wave');
    for (let i = 0; i < oscillatorWaves.length; i++) {
      oscillatorMode.value = modes[mode][oscillatorWaves[i]]
    }
  });
  const oscillatorWaves = document.querySelector('.oscillator-wave');
  oscillatorMode.addEventListener('change', function (event) {
    debugger
    event.preventDefault();
    var id = Number(this.id);
    var wave = event.element.value;
    oscillatorCtrl.updateWave(id, wave);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var keyboard = keyboardModel({volumeSelector: 'keyboard-volume', oscillators: oscillatorCtrl.oscillators});
  keyboard.initialize();

  var keyboardCtrl = keyboardController(keyboard);
  keyboardCtrl.octaves.listen({octaveUpId: 'octave-up', octaveDownId: 'octave-down'});

  var nodes = [];
  for (var i = 0; i < oscillatorCtrl.oscillators.length; i++) {
    nodes.push(oscillatorCtrl.oscillators[i].gainNode1)
  }
  viz.init('top', nodes);

})
