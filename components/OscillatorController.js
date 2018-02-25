import context from './Context'
import oscillator from './Oscillator'

function oscillatorController (options) {
  var oscillators = options['oscillators'] || []
  var oscillatorSelector = options['oscillatorSelector'] || '.oscillator-wave'
  var initialFrequency = options['initialFrequency'] || 261.63
  var initialVolume = options['initialVolume'] || 0

  var createOscillators = function () {
    for (var i = 0; i < 13; i++) {
      var osc = oscillator(context, initialFrequency, initialVolume)
      oscillators.push(osc)
    }
  }

  var connectOscillators = function () {
    oscillators.forEach(function (osc) {
      osc.connect()
    })
  }

  var updateWave = function (id, wave) {
    oscillators.forEach(function (osc) {
      osc.updateWave(id, wave)
    })
  }

  var initialize = function () {
    createOscillators()
    connectOscillators()
  }

  var setMode = function (options = []) {
    var id = 1
    for (let i = 0; i < options.length; i++) {
      for (let j = 0; j < oscillators.length; j++) {
        oscillators[j].updateWave(i + 1, options[i])
      }
    }
  }

  return {
    initialize,
    setMode,
    updateWave,
    oscillators
  }
}

export default oscillatorController
