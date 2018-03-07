import context from './Context'
import oscillator from './Oscillator'

function oscillatorController ({ initialFrequency = 261.63, initialVolume = 0, oscillators = [] } = {}) {
  var updateWave = function (id, wave) {
    oscillators.forEach(function (osc) {
      osc.updateWave(id, wave)
    })
  }

  var initialize = function () {
    for (var i = 0; i < 13; i++) {
      var osc = oscillator(context, initialFrequency, initialVolume)
      oscillators.push(osc)
    }
    oscillators.forEach(function (osc) {
      osc.connect()
    })
  }

  var setMode = function (options = []) {
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
