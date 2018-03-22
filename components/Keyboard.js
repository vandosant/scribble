import $ from 'jquery'

const keys = {
  'A': {
    key: 65,
    index: 0,
    freq: 261.63
  },
  'W': {
    key: 87,
    index: 1,
    freq: 277.18
  },
  'S': {
    key: 83,
    index: 2,
    freq: 293.66
  },
  'E': {
    key: 69,
    index: 3,
    freq: 311.13
  },
  'D': {
    key: 68,
    index: 4,
    freq: 329.63
  },
  'F': {
    key: 70,
    index: 5,
    freq: 349.23
  },
  'T': {
    key: 84,
    index: 6,
    freq: 369.99
  },
  'G': {
    key: 71,
    index: 7,
    freq: 392.00
  },
  'Y': {
    key: 89,
    index: 8,
    freq: 415.30
  },
  'H': {
    key: 72,
    index: 9,
    freq: 440.00
  },
  'U': {
    key: 85,
    index: 10,
    freq: 466.16
  },
  'J': {
    key: 74,
    index: 11,
    freq: 493.88
  },
  'K': {
    key: 75,
    index: 12,
    freq: 523.25
  }
}

function keyboard (obj) {
  let volumeSelector
  let keysDown = []
  let volume = 0.25

  if (obj && obj.volume) {
    volume = obj.volume
  }

  if (obj && obj.volumeSelector) {
    volumeSelector = obj.volumeSelector
  }

  let oscillators = obj.oscillators

  const isKeyPressed = (keyChar) => keysDown.indexOf(keyChar.which) >= 0

  const keydown = function keydown (keyChar) {
    if (!isKeyPressed(keyChar)) {
      const char = String.fromCharCode(keyChar.which)
      const key = keys[char]
      if (key) {
        oscillators[key.index].updateNote(key.freq)
        oscillators[key.index].updateVolume(this.volume)
        keysDown = keysDown.concat(keyChar.which)
        $('#key-' + char).addClass('keyon')
      }
    }
  }

  const keyup = function (keyChar) {
    if (isKeyPressed(keyChar)) {
      const char = String.fromCharCode(keyChar.which)
      const key = keys[char]
      const keyIndex = keysDown.indexOf(keyChar.which)
      if (keyIndex >= 0) {
        oscillators[key.index].updateVolume(0)
        keysDown = [].concat(
          keysDown.slice(0, keyIndex),
          keysDown.slice(keyIndex + 1)
        )
        $('#key-' + char).removeClass('keyon')
      }
    }
  }

  var updateVolume = function (rangeVal) {
    this.volume = (rangeVal / 100) * 0.25
  }

  const initialize = function () {
    $(document).keydown(function (e) {
      this.keydown(e)
    }.bind(this))

    $(document).keyup(function (e) {
      this.keyup(e)
    }.bind(this))

    const volumeElement = document.getElementById(volumeSelector)
    if (volumeElement) {
      volumeElement.addEventListener('change', function (e) {
        this.updateVolume(e.target.value)
      }.bind(this))
    }

    // mute if hidden
    if (typeof document.addEventListener && typeof document.visibilityState) {
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          oscillators.forEach(function (o) {
            o.updateVolume(0)
          })
        }
      }, false)
    }
  }

  return {
    initialize,
    keys,
    keydown,
    keyup,
    updateVolume,
    volume,
    volumeSelector
  }
}

export default keyboard
