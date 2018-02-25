import assert from 'assert'
import sinon from 'sinon'
import keyboard from '../../../app/components/Keyboard.js'

describe('keyboard', function () {
  var keyboardInstance

  beforeEach(() => {
    keyboardInstance = keyboard({volumeSelector: '.test-selector'})
    keyboardInstance.initialize()
  })

  test('should listen for keydown events', function () {
    sinon.spy(keyboardInstance, 'keydown')
    var keyDownEvent = jQuery.Event('keydown')
    keyDownEvent.keyCode = 65
    $(document).trigger(keyDownEvent)

    assert(keyboardInstance.keydown.calledOnce)
  })

  test('should listen for keyup events', function () {
    spyOn(keyboardInstance, 'keyup')
    var keyUpEvent = jQuery.Event('keyup')
    keyUpEvent.keyCode = 65
    $(document).trigger(keyUpEvent)

    expect(keyboardInstance.keyup).toHaveBeenCalled()
  })

  test('should set a default volume on creation', function () {
    expect(keyboardInstance.volume).toEqual(0.25)
  })

  test('should accept a volume on creation', function () {
    keyboardInstance = keyboard({volume: 0.25})
    expect(keyboardInstance.volume).toEqual(0.25)
  })

  test('should accept a volume selector on creation', function () {
    keyboardInstance = keyboard({volumeSelector: '.test-selector'})
    expect(keyboardInstance.volumeSelector).toEqual('.test-selector')
  })

  test('should update the volume', function () {
    var firstVolume = keyboardInstance.volume

    keyboardInstance.updateVolume(65)

    var secondVolume = keyboardInstance.volume
    assert.ok(secondVolume < firstVolume)
  })
})
