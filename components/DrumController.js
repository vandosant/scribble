export default function DrumController ({
  drums,
  containerId,
  emitter,
  tempo,
  volume
} = {}) {
  let container = document.getElementById(containerId)

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
    parseTempo,
    start,
    stop,
    setTempo,
    setVolume,
    listen
  }
}
