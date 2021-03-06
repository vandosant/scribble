import context, { init } from './Context'
import keyboardModel from './Keyboard'
import keyboardController from './keyboardController'
import oscillatorController from './OscillatorController'
import drumMachine from './DrumMachine'
import visualizer from './Visualizer'
import '../styles/application.scss'

const INITIAL_TEMPO = 180

const viz = visualizer()
const drumDefaults = {
  context,
  wave: 'sine',
  gainVal: 1.0,
  viz
}

var drums = [
  {
    identifier: 'bass',
    active: true,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 47,
      sustain: 100
    })
  },
  {
    identifier: 'tom1',
    active: false,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 84,
      sustain: 70
    })
  },
  {
    identifier: 'tom2',
    active: false,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 160,
      sustain: 70
    })
  },
  {
    identifier: 'snare',
    active: false,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 188,
      sustain: 25
    })
  },
  {
    identifier: 'pad1',
    active: false,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 261.63,
      wave: 'triangle',
      sustain: 15
    })
  },
  {
    identifier: 'pad2',
    active: false,
    selectedBeats: [],
    instance: drumMachine({
      ...drumDefaults,
      frequency: 192,
      wave: 'square',
      sustain: 10
    })
  }
]

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

const view = {
  tick: function (state) {
    const drums = document.getElementById('drums')
    const drumButtonContainer = document.createElement('div')
    drums.innerHTML = ''
    drumButtonContainer.innerHTML = ''

    state.drums.forEach(drum => {
      const active = drum.identifier === state.drumType
      if (active) {
        let buttonContainer = document.createElement('div')
        buttonContainer.classList.add('drum-container')
        let beats = []
        for (var i = 0; i < state.maxBeat; i++) {
          let beatEl = document.createElement('div')
          beatEl.classList.add('drum-button')
          beatEl.textContent = (i + 1).toString()
          if (drum.selectedBeats.includes(i + 1)) {
            beatEl.classList.add('drum-button-selected')
          }
          if (state.nextBeat === i + 1) {
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
        drums.appendChild(buttonContainer)
      }
    })
  },
  selected: function (state) {
    const drumType = document.getElementById('drum-types')
    drumType.innerHTML = ''
    drumType.classList.add('drum-container')

    state.drums.forEach(drum => {
      let typeButton = document.createElement('div')
      typeButton.classList.add('drum-type')
      if (drum.identifier === state.drumType) {
        typeButton.classList.add('drum-button-selected')
      }
      typeButton.setAttribute('id', drum.identifier)
      typeButton.textContent = drum.identifier
      drumType.appendChild(typeButton)
    })
  },
  stopped: function (state) {
    const statusButton = document.getElementById('drum-status')
    statusButton.innerHtml = ''
    const statusDiv = document.createElement('div')
    statusDiv.setAttribute('id', 'play')
    while (statusButton.firstChild) {
      statusButton.removeChild(statusButton.firstChild)
    }
    statusButton.appendChild(statusDiv)
  },
  started: function (state) {
    const statusButton = document.getElementById('drum-status')
    const statusDiv = document.createElement('div')
    statusDiv.setAttribute('id', 'pause')
    while (statusButton.firstChild) {
      statusButton.removeChild(statusButton.firstChild)
    }
    statusButton.appendChild(statusDiv)
  },
  init: function (state) {
    const drumType = document.getElementById('drum-types')
    drumType.classList.add('drum-container')

    state.drums.forEach(drum => {
      let typeButton = document.createElement('div')
      typeButton.classList.add('drum-type')
      typeButton.setAttribute('id', drum.identifier)
      typeButton.textContent = drum.identifier
      if (drum.identifier === state.drumType) {
        typeButton.classList.add('drum-button-selected')
      }
      drumType.appendChild(typeButton)
    })

    this.started(state)
  }
}

const state = {
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
      view.tick(representation)
    }
    if (this.selecting(model)) {
      representation = {
        drums: model.drums,
        drumType: model.selectedDrumType
      }
      view.selected(representation)
    }
    if (this.stopping(model)) {
      view.stopped(representation)
    }
    if (this.starting(model)) {
      view.started(representation)
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
  },
  stopping: function (model) {
    return model.started && model.stopped
  },
  starting: function (model) {
    return model.started && !model.stopped && !this.ticking(model)
  }
}

const initialState = {
  started: true,
  stopped: false,
  beat: 1,
  nextBeat: 1,
  tempo: INITIAL_TEMPO,
  drumType: 'bass',
  selectedDrumType: 'bass',
  drums,
  maxBeat: 16
}

var model = (function (state) {
  return {
    state,
    ...initialState,
    present (data = {}) {
      if (data.beat) {
        this.beat = data.beat
      }
      if (data.nextBeat) {
        this.nextBeat = data.nextBeat
      }
      if (data.selectedDrumBeat) {
        const selectedDrumIndex = this.drums.findIndex(drum => drum.identifier === this.drumType)
        const selectedDrum = this.drums[selectedDrumIndex]
        let selectedBeats
        if (selectedDrum.selectedBeats.includes(data.selectedDrumBeat)) {
          selectedBeats = selectedDrum.selectedBeats.filter(beat => beat !== data.selectedDrumBeat)
        } else {
          selectedBeats = [].concat(selectedDrum.selectedBeats, data.selectedDrumBeat)
        }
        this.drums = [
          ...this.drums.slice(0, selectedDrumIndex), {
            ...selectedDrum,
            selectedBeats
          },
          ...this.drums.slice(selectedDrumIndex + 1)
        ]
      }
      if (data.selectedDrumType) {
        this.selectedDrumType = data.selectedDrumType
      }
      if (data.drumType) {
        this.drumType = data.drumType
      }
      if (typeof data.stopped !== 'undefined') {
        this.stopped = data.stopped
      }
      if (typeof data.drumVolume !== 'undefined') {
        this.drums = this.drums.map(drum => ({
          ...drum,
          instance: {
            ...drum.instance,
            gainVal: data.drumVolume
          }
        }))
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
  },
  selectDrumBeat: function (data = {}) {
    model.present({ selectedDrumBeat: data.beat })
  },
  setDrumVolume: function (data = {}) {
    model.present({ drumVolume: data.volume })
  },
  stopDrum: function (data = {}) {
    model.present({ stopped: true })
  },
  startDrum: function (data = {}) {
    model.present({ stopped: false })
  }
}
let drum = {
  beatInterval: null,
  tempo: INITIAL_TEMPO,
  start: function () {
    clearInterval(this.beatInterval)
    this.beatInterval = setInterval(function () {
      actions.tick({ beat: model.beat })
      model.drums.forEach(drum => actions.hitDrumIfSelected({
        beat: model.beat,
        drum
      }))
    }, (60 * 1000) / this.tempo)
  },
  stop: function () {
    clearInterval(this.beatInterval)
  }
}

drum.start()

const handleClick = function (e) {
  if (e.target.classList.contains('drum-type')) {
    const drumType = e.target.innerText
    actions.selectDrumType({ identifier: drumType })
  }
  if (e.target.classList.contains('drum-button')) {
    actions.selectDrumBeat({ beat: parseInt(e.target.innerText, 10) })
  }
  if (e.target.id === 'pause') {
    actions.stopDrum()
    drum.stop()
  }
  if (e.target.id === 'play') {
    actions.startDrum()
    drum.start()
  }
}

const handleChange = function (e) {
  if (e.target.id === 'drum-volume') {
    actions.setDrumVolume({ volume: e.target.value / 100 })
  }
  if (e.target.id === 'tempo') {
    drum.tempo = parseInt(e.target.value, 10)
    drum.stop()
    drum.start()
  }
}

document.addEventListener('click', handleClick)
document.addEventListener('change', handleChange)
