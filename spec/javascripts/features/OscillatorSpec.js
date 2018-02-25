import oscillator from '../../../app/components/Oscillator.js'
import round from '../helpers/Helpers.js'

describe('oscillator', function () {
  var contextClass = (window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext)
  var context = new contextClass()
  var oscillatorInstance
  var initialFrequency = 261.63
  var initialVolume = 0.2

  beforeEach(function () {
    oscillatorInstance = oscillator(context, initialFrequency, initialVolume)
  })

  it('should have a frequency', function () {
    expect(oscillatorInstance.frequency).toEqual(initialFrequency)
  })

  it('should have a volume', function () {
    expect(oscillatorInstance.volume).toEqual(initialVolume)
  })

  it('should have a context', function () {
    expect(oscillatorInstance.context).toEqual(context)
  })

  it('should have 3 oscillators each with a type and a frequency when connected', function () {
    oscillatorInstance.connect()

    expect(oscillatorInstance.osc1.type).toEqual('sine')
    expect(oscillatorInstance.osc2.type).toEqual('sine')
    expect(oscillatorInstance.osc3.type).toEqual('triangle')

    expect(oscillatorInstance.osc1.frequency.value).toBeCloseTo(initialFrequency)
    expect(oscillatorInstance.osc2.frequency.value).toBeCloseTo(initialFrequency / 2)
    expect(oscillatorInstance.osc3.frequency.value).toBeCloseTo(initialFrequency / 2)
  })

  it('should have 3 gain nodes each with a value when connected', function () {
    oscillatorInstance.connect()

    expect(oscillatorInstance.gainNode1.gain.value).toBeCloseTo(0.2)
    expect(oscillatorInstance.gainNode2.gain.value).toBeCloseTo(0.2)
    expect(round(oscillatorInstance.gainNode3.gain.value, 1)).toEqual(0.2)
  })

  it('should allow its note to be updated', function () {
    oscillatorInstance.connect()

    var newNote = 440.00
    oscillatorInstance.updateNote(newNote)

    expect(oscillatorInstance.osc1.frequency.value).toEqual(newNote)
    expect(oscillatorInstance.osc2.frequency.value).toEqual(newNote / 2)
    expect(oscillatorInstance.osc3.frequency.value).toEqual(newNote / 2)
  })

  it('should allow its volume to be updated', function () {
    oscillatorInstance.connect()

    var newVolume = 0.5
    oscillatorInstance.updateVolume(newVolume)

    expect(oscillatorInstance.gainNode1.gain.value).toBeCloseTo(newVolume)
    expect(oscillatorInstance.gainNode2.gain.value).toBeCloseTo(newVolume)
    expect(oscillatorInstance.gainNode3.gain.value).toBeCloseTo(newVolume * 0.8)
  })
})
