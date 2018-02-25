import keyboardModel from '../../../app/components/Keyboard.js'
import keyboardController from '../../../app/components/KeyboardController.js'
import oscillatorController from '../../../app/components/OscillatorController.js'

describe('keyboardController', function () {
  var keyboardCtrl
  var keyboard

  beforeEach(function () {
    var oscillatorCtrl = oscillatorController({
      oscillators: [],
      initialVolume: 0,
      initialFrequency: 261.63,
      oscillatorSelector: '.oscillator-wave'
    })
    oscillatorCtrl.initialize()

    var keyboard = keyboardModel({volumeSelector: 'keyboard-volume', oscillators: oscillatorCtrl.oscillators})
    keyboard.initialize()
  })

  it('should initialize', function () {
    keyboardController(keyboard)
  })

  describe('volumeSelector', function () {
    it('should be undefined by default', function () {
      keyboardCtrl = keyboardController(keyboard)
      expect(keyboardCtrl.volumeSelector).toEqual(undefined)
    })
  })
})
