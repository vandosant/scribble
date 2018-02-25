import context, { init } from './Context'
import keyboardModel from './Keyboard'
import keyboardController from './keyboardController'
import oscillatorController from './OscillatorController'
import DrumController from './DrumController'
import drumMachine from './DrumMachine'
import visualizer from './Visualizer'
import recorder from './Recorder'
import '../styles/application.scss'

const start = document.querySelector('#record')
const stop = document.querySelector('#stop')
recorder()
  .then(({ handleStart, handleStop }) => {
    start.onclick = handleStart
    stop.onclick = handleStop
  })

var drumVol = 1.3
var viz = visualizer()
const drumDefaults = {
  context,
  wave: 'sine',
  gainVal: drumVol,
  viz
}
var drums = [
  {
    identifier: 'bass',
    bass: {
      machine: drumMachine({
        ...drumDefaults,
        frequency: 47,
        sustain: 0.03
      })
    }
  },
  {
    identifier: 'tom1',
    tom1: {
      machine: drumMachine({
        ...drumDefaults,
        frequency: 64,
        sustain: 0.05
      })
    }
  },
  {
    identifier: 'tom2',
    tom2: {
      machine: drumMachine({
        ...drumDefaults,
        frequency: 160,
        sustain: 0.05
      })
    }
  },
  {
    identifier: 'snare',
    snare: {
      machine: drumMachine({
        ...drumDefaults,
        frequency: 188,
        sustain: 0.07
      })
    }
  },
  {
    identifier: 'pad',
    pad: {
      machine: drumMachine({
        ...drumDefaults,
        frequency: 261.63,
        wave: 'triangle',
        sustain: 0.02
      })
    }
  }
]

const drumController = DrumController(drums, 'drums', 180, drumVol)
document.addEventListener('DOMContentLoaded', () => {
  drumController.render()
  drumController.selectDrum({ target: document.getElementById('bass') })
  drumController.start('drum-status')
  drumController.listen({
    tempoId: 'tempo',
    drumBeatClass: 'drum-button',
    drumTypeClass: 'drum-type',
    statusSelectorId: 'drum-status',
    drumVolumeSelector: 'drum-volume'
  })
})

document.addEventListener('keydown', (event) => {
  init()
})

var oscillatorCtrl = oscillatorController({
  oscillators: [],
  initialVolume: 0,
  initialFrequency: 261.63,
  oscillatorSelector: '.oscillator-wave'
})
oscillatorCtrl.initialize()

document.addEventListener('DOMContentLoaded', function () {
  const oscillatorMode = document.querySelector('.oscillator-mode')
  oscillatorMode.addEventListener('change', function _updatOscillatorMode (event) {
    event.preventDefault()
    var modes = {
      standard: ['sine', 'sine', 'triangle'],
      raspy: ['sine', 'square', 'sawtooth'],
      organ: ['sine', 'sine', 'sine'],
      game: ['square', 'sine', 'triangle']
    }
    const mode = event.target.value
    oscillatorCtrl.setMode(modes[mode])
    const oscillatorWaves = document.querySelectorAll('.oscillator-wave')
    for (let i = 0; i < oscillatorWaves.length; i++) {
      oscillatorWaves[i].value = modes[mode][i]
    }
  })

  const oscillatorWave = document.querySelector('.oscillator-wave')
  oscillatorWave.addEventListener('change', function _updateOscillatorWave (event) {
    event.preventDefault()
    var id = Number(this.id)
    oscillatorCtrl.updateWave(id, event.target.value)
  })
})

document.addEventListener('DOMContentLoaded', function () {
  var keyboard = keyboardModel({volumeSelector: 'keyboard-volume', oscillators: oscillatorCtrl.oscillators})
  keyboard.initialize()

  var keyboardCtrl = keyboardController(keyboard)
  document.getElementById('octave-up').addEventListener('click', keyboardCtrl.handleOctaveIncreased)
  document.getElementById('octave-down').addEventListener('click', keyboardCtrl.handleOctaveDecreased)

  var nodes = []
  for (var i = 0; i < oscillatorCtrl.oscillators.length; i++) {
    nodes.push(oscillatorCtrl.oscillators[i].gainNode1)
  }
  viz.init('top', nodes)
})
