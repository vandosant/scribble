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
    selectedBeats: [1],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 47,
      sustain: 0.03
    })
  },
  {
    identifier: 'tom1',
    active: false,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 64,
      sustain: 0.05
    })
  },
  {
    identifier: 'tom2',
    active: false,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 160,
      sustain: 0.05
    })
  },
  {
    identifier: 'snare',
    active: false,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 188,
      sustain: 0.07
    })
  },
  {
    identifier: 'pad',
    active: false,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 261.63,
      wave: 'triangle',
      sustain: 0.02
    })
  }
]

const drumState = {
  tempo: INITIAL_TEMPO,
  volume: DRUM_VOL,
  containerId: 'drums',
  drums,
  emitter
}

document.addEventListener('keydown', (event) => {
  init()
})
document.addEventListener('click', (event) => {
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
    display (state) {
      this.drums.innerHTML = ''
      this.drumButtonContainer.innerHTML = ''

      state.drums.forEach(drum => {
        const active = drum.identifier === state.drumType
        if (active) {
          let buttonContainer = document.createElement('div')
          buttonContainer.classList.add('drum-container')
          buttonContainer.setAttribute('id', 'drum-' + drum.identifier)
          let beats = []
          for (var i = 0; i < state.maxBeat; i++) {
            let beatEl = document.createElement('div')
            beatEl.classList.add('drum-button')
            beatEl.textContent = (i + 1).toString()
            if (drum.selectedBeats.includes(i + 1)) {
              beatEl.classList.add('drum-button-selected')
            }
            if (state.beat === i + 1) {
              beatEl.classList.add('drum-button-active')
            }
            beats = beats.concat(beatEl)
          }
          beats.forEach((beat, index) => {
            buttonContainer.appendChild(beat)
            if (index === 7) {
              buttonContainer.appendChild(document.createElement('br'))
            }
          })
          this.drums.appendChild(buttonContainer)
        }
      })
    },
    selected: function (state) {
      this.drumType.innerHTML = ''
      this.drumType.classList.add('drum-container')
      state.drums.forEach(drum => {
        let typeButton = document.createElement('div')
        typeButton.classList.add('drum-type')
        if (drum.identifier === state.drumType) {
          typeButton.classList.add('drum-button-selected')
        }
        typeButton.setAttribute('id', drum.identifier)
        typeButton.textContent = drum.identifier
        this.drumType.appendChild(typeButton)
      })
    },
    init: function (state) {
      this.drumType.classList.add('drum-container')
      state.drums.forEach(drum => {
        let typeButton = document.createElement('div')
        typeButton.classList.add('drum-type')
        typeButton.setAttribute('id', drum.identifier)
        typeButton.textContent = drum.identifier
        if (drum.identifier === state.drumType) {
          typeButton.classList.add('drum-button-selected')
        }
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
      this.representation(model)
      this.nextAction(model)
    },
    representation: function (model) {
      let representation = {}
      if (this.ticking(model)) {
        representation = {
          beat: model.beat,
          nextBeat: model.nextBeat,
          maxBeat: model.maxBeat,
          tempo: model.tempo,
          drums: model.drums,
          drumType: model.drumType
        }
        view.display(representation)
      }
      if (this.selecting(model)) {
        representation = {
          drums: model.drums,
          drumType: model.selectedDrumType
        }
        view.selected(representation)
      }
    },
    nextAction: function (model) {
      if (this.ticking(model)) {
        actions.updateBeat({
          beat: model.nextBeat
        }, model.present)
      }
      if (this.selecting(model)) {
        actions.updateDrumType({
          drumType: model.selectedDrumType
        })
      }
    },
    ticking: function (model) {
      return model.started && !model.stopped && (model.beat !== model.nextBeat)
    },
    selecting: function (model) {
      return model.drumType !== model.selectedDrumType
    }
  }
})()

var model = (function (state) {
  return {
    state,
    started: true,
    stopped: false,
    beat: 1,
    nextBeat: 1,
    tempo: INITIAL_TEMPO,
    drumType: 'bass',
    selectedDrumType: 'bass',
    drums,
    maxBeat: 16,
    present (data = {}) {
      if (data.beat) {
        this.beat = data.beat
      }
      if (data.nextBeat) {
        this.nextBeat = data.nextBeat
      }
      if (data.selectedDrumType) {
        this.selectedDrumType = data.selectedDrumType
      }
      if (data.drumType) {
        this.drumType = data.drumType
      }
      this.state.render(model)
    }
  }
})(state)

view.init(model)

var actions = {
  tick: function (data = {}, present) {
    data.beat = data.beat || 1
    data.nextBeat = data.beat + 1
    if (data.nextBeat > 16) {
      data.nextBeat = 1
    }
    model.present({ nextBeat: data.nextBeat })
  },
  updateBeat: function (data = {}, present) {
    data.beat = data.beat || data.nextBeat
    model.present(data)
  },
  updateDrumType: function (data = {}, present) {
    data.drumType = data.drumType || data.selectedDrumType
    model.present(data)
  },
  hitDrumIfSelected: function (data = {}) {
    if (data.drum.selectedBeats.includes(data.beat)) {
      data.drum.instance.hit()
    }
  },
  selectDrumType: function (data = {}) {
    model.present({ selectedDrumType: data.identifier })
  }
}

setInterval(function () {
  actions.tick({ beat: model.beat })
  model.drums.forEach(drum => actions.hitDrumIfSelected({
    beat: model.beat,
    drum
  }))
}, (60 * 1000) / INITIAL_TEMPO)

const mouseClick = function (e) {
  e.preventDefault()
  if (e.target.classList.contains('drum-type')) {
    const drumType = e.target.innerText
    actions.selectDrumType({ identifier: drumType })
  }
}

document.addEventListener('click', mouseClick, false)
