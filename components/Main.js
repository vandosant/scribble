import EventEmitter from 'events'
import context, { init } from './Context'
import keyboardModel from './Keyboard'
import keyboardController from './keyboardController'
import oscillatorController from './OscillatorController'
import DrumController from './DrumController'
import drumMachine from './DrumMachine'
import visualizer from './Visualizer'
// import recorder from './Recorder'
import '../styles/application.scss'

const DRUM_VOL = 1.3
const INITIAL_TEMPO = 180

const emitter = new EventEmitter()

//const start = document.querySelector('#record')
//const stop = document.querySelector('#stop')
//recorder()
//  .then(({ handleStart, handleStop }) => {
//    start.onclick = handleStart
//    stop.onclick = handleStop
//  })

const viz = visualizer()
const drumDefaults = {
  context,
  wave: 'sine',
  gainVal: DRUM_VOL,
  viz
}

var drums = [
  {
    identifier: 'bass',
    active: true,
    selectedBeats: [1,3,5,14],
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
    active: false,
    selectedBeats: [],
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
    active: false,
    selectedBeats: [],
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
    active: false,
    selectedBeats: [],
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
    active: false,
    selectedBeats: [],
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

const drumState = {
  tempo: INITIAL_TEMPO,
  volume: DRUM_VOL,
  containerId: 'drums',
  drums,
  emitter
}

const drumController = DrumController(drumState)

document.addEventListener('keydown', (event) => {
  init()
})

const oscillatorCtrl = oscillatorController({
  oscillators: [],
  initialVolume: 0,
  initialFrequency: 261.63,
  oscillatorSelector: '.oscillator-wave'
})
oscillatorCtrl.initialize()

document.addEventListener('DOMContentLoaded', function () {
  // drums
  //drumController.render()
  //drumController.selectDrum({ target: document.getElementById('bass') })
  //drumController.start('drum-status')
  //drumController.listen({
  //  tempoId: 'tempo',
  //  drumBeatClass: 'drum-button',
  //  drumTypeClass: 'drum-type',
  //  statusSelectorId: 'drum-status',
  //  drumVolumeSelector: 'drum-volume'
  //})

  // keys
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

  const keyboard = keyboardModel({volumeSelector: 'keyboard-volume', oscillators: oscillatorCtrl.oscillators})
  keyboard.initialize()

  var keyboardCtrl = keyboardController(keyboard)
  document.getElementById('octave-up').addEventListener('click', keyboardCtrl.handleOctaveIncreased)
  document.getElementById('octave-down').addEventListener('click', keyboardCtrl.handleOctaveDecreased)

  // visualization
  const nodes = oscillatorCtrl.oscillators.map(o => o.gainNode1)
  viz.init('top', nodes)
})

var view = (function (drums, drumType, drumButtonContainer, drumsContainer) {
  return {
    drums,
    drumType,
    drumButtonContainer,
    drumsContainer,
    display (stateRepresentation) {
      this.drums.innerHTML = ''
      this.drumType.innerHTML = ''
      this.drumButtonContainer.innerHTML = ''
      this.drumType.setAttribute('class', 'drum-container')
      this.drums.appendChild(this.drumType)

      stateRepresentation.drums.forEach(drum => {
        const active = drum.active
        let buttonContainer = document.createElement('div')
        buttonContainer.classList.add('drum-container')
        buttonContainer.setAttribute('id', 'drum-' + drum.identifier)

        if (active) {
          for (var i = 0; i < stateRepresentation.maxBeat; i++) {
            let beatEl = document.createElement('div')
            beatEl.classList.add('drum-button')
            beatEl.textContent = (i + 1).toString()

            if (drum.selectedBeats[i + 1]) {
              beatEl.classList.add('drum-button-selected')
            }

            buttonContainer.appendChild(beatEl)
            if (i === 7) {
              buttonContainer.appendChild(document.createElement('br'))
            }
          }
        }

        this.drums.appendChild(buttonContainer)
        let typeButton = document.createElement('div')
        typeButton.classList.add('drum-type')
        if (active) {
          typeButton.classList.add('drum-button-selected')
        }
        typeButton.setAttribute('id', drum.identifier)
        typeButton.textContent = drum.identifier
        this.drumType.appendChild(typeButton)
      })
    }
  }
})(
  document.getElementById('drums'),
  document.getElementById('drum-types'),
  document.createElement('div'),
  document.getElementById('drums-container')
)

var state = (function () {
  return {
    render: function (model) {
      const stateRepresentation = {
        beat: model.beat,
        maxBeat: model.maxBeat,
        tempo: model.tempo,
        drums: model.drums
      }

      view.display(stateRepresentation)
    }
  }
})()

var model = (function (state) {
  return {
    state,
    beat: 1,
    tempo: INITIAL_TEMPO,
    drums,
    maxBeat: 16,
    present (data = {}) {
      this.state.render(model)
    }
  }
})(state)

setInterval(function () {
  if (model.state.beat > 16) {
    model.present(
      Object.assign(
        {},
        model.state,
        {
          beat: model.state.beat + 1
        }
      )
    )
  } else {
    model.present(
      Object.assign(
        {},
        model.state,
        {
          beat: model.state.beat + 1
        }
      )
    )
  }
}, (60 * 1000) / INITIAL_TEMPO)
