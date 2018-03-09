export default function DrumController ({
  drums,
  containerId,
  emitter,
  tempo,
  volume
} = {}) {
  let MAX_BEATS = 15
  let container = document.getElementById(containerId)

  emitter.on('beat', ({ beat }) => {
    var activeDrumNodes = document.getElementsByClassName('drum-button-active')
    if (activeDrumNodes.length > 0) {
      for (var i = 0; i < activeDrumNodes.length; i++) {
        activeDrumNodes[i].classList.remove('drum-button-active')
      }
    }
    drums.forEach(function (drum) {
      if (beat === 1) {
        drum.beats[MAX_BEATS].el.classList.remove('drum-button-active')
      } else {
        drum.beats[beat - 1].el.classList.remove('drum-button-active')
      }
      drum.beats[beat - 1].el.classList.add('drum-button-active')
      if (drum.beats[beat - 1].selected === true) {
        drum[drum.identifier].machine.hit()
      }
    })
  })

  function render () {
    let typeContainer = document.createElement('div')
    typeContainer.setAttribute('class', 'drum-container')
    typeContainer.setAttribute('id', 'drum-types')
    container.appendChild(typeContainer)
    drums.forEach(function (drum, key) {
      drum.beats = []
      let buttonContainer = document.createElement('div')
      buttonContainer.setAttribute('class', 'drum-container')
      buttonContainer.setAttribute('id', 'drum-' + key)
      for (var i = 0; i < 16; i++) {
        let beatEl = document.createElement('div')
        beatEl.setAttribute('class', 'drum-button')
        beatEl.textContent = (i + 1).toString()

        drum.beats.push({
          selected: false,
          el: beatEl
        })

        buttonContainer.appendChild(beatEl)
        if (i === 7) {
          buttonContainer.appendChild(document.createElement('br'))
        }
      }
      container.appendChild(buttonContainer)

      var typeButton = document.createElement('div')
      typeButton.setAttribute('class', 'drum-type')
      typeButton.setAttribute('id', drum.identifier)
      typeButton.textContent = drum.identifier
      typeContainer.appendChild(typeButton)
    })
  }

  function parseTempo (tempo) {
    return (60 * 1000) / tempo
  }

  function start (statusButtonId) {
    var statusButton = document.getElementById(statusButtonId)
    var statusDiv = document.createElement('div')
    statusDiv.setAttribute('id', 'pause')
    statusButton.setAttribute('active', 'true')
    while (statusButton.firstChild) {
      statusButton.removeChild(statusButton.firstChild)
    }
    statusButton.appendChild(statusDiv)
  }

  function stop (statusButtonId) {
    clearInterval(DrumController.interval)
    var statusButton = document.getElementById(statusButtonId)
    var statusDiv = document.createElement('div')
    statusDiv.id = 'play'
    statusButton.classList.remove('active')
    statusButton.classList.add('inactive')
    while (statusButton.firstChild) {
      statusButton.removeChild(statusButton.firstChild)
    }
    statusButton.appendChild(statusDiv)
  }

  function toggleDrumBeat (e) {
    const index = parseInt(e.target.innerText) - 1
    const id = e.target.parentNode.getAttribute('id')
    const type = id.split('-')[1]
    if (!e.target.classList.contains('drum-button-selected')) {
      e.target.classList.add('drum-button-selected')
      drums[type].beats[index].selected = true
    } else {
      e.target.classList.remove('drum-button-selected')
      drums[type].beats[index].selected = false
    }
  }

  function selectDrum (e) {
    var id = e.target.id
    var drumTypes = document.getElementsByClassName('drum-type')
    for (var i = 0; i < drumTypes.length; i++) {
      drumTypes[i].classList.remove('drum-button-selected')
    }
    e.target.classList.add('drum-button-selected')

    drums.forEach(function (drum, key) {
      var drumEl = document.getElementById('drum-' + key)
      if (drum.identifier === id) {
        drumEl.setAttribute('visibility', 'visible')
        drumEl.setAttribute('height', '')
        drumEl.hidden = false
      } else {
        drumEl.setAttribute('visibility', 'hidden')
        drumEl.hidden = true
        drumEl.setAttribute('height', '0')
      }
    })
  }

  function setTempo (newTempo, statusSelectorId) {
    var statusButton = document.getElementById(statusSelectorId)
    if (statusButton.getAttribute('active') === 'true') {
      start.call(this, 'drum-status')
    }
  }

  function setVolume (volumeModifier) {
    var context = this
    for (var i = 0; i < drums.length; i++) {
      context.drums[i][drums[i].identifier].machine.gainVal = context.startVolume * volumeModifier
    }
  }

  function listen ({
    tempoId,
    drumBeatClass,
    drumTypeClass,
    statusSelectorId,
    drumVolumeSelector
  }) {
    var context = this
    var tempoEl = document.getElementById(tempoId)
    tempoEl.addEventListener('change', function __handler__ () {
      setTempo.call(context, parseInt(this.value), statusSelectorId)
    })

    var drumBeats = document.getElementsByClassName(drumBeatClass)
    for (var i = 0; i < drumBeats.length; i++) {
      drumBeats[i].addEventListener('click', toggleDrumBeat)
    }

    var drumTypes = document.getElementsByClassName(drumTypeClass)
    for (var j = 0; j < drumTypes.length; j++) {
      drumTypes[j].addEventListener('click', selectDrum)
    }

    var statusButton = document.getElementById(statusSelectorId)
    statusButton.addEventListener('click', function __handler__ () {
      var el = this
      if (el.getAttribute('active') === 'true') {
        el.setAttribute('active', 'false')
        stop(statusSelectorId)
      } else {
        start.call(context, statusSelectorId)
      }
    })

    var drumVolumeEl = document.getElementById(drumVolumeSelector)
    drumVolumeEl.addEventListener('change', function __handler__ () {
      setVolume.call(context, this.value / 100)
    })
  }

  return {
    drums,
    container,
    tempo,
    startVolume: volume,
    render,
    parseTempo,
    start,
    stop,
    selectDrum,
    setTempo,
    setVolume,
    listen
  }
}
