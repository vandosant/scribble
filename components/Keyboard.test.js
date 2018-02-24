import $ from 'jquery'
import assert from 'assert'
import sinon from 'sinon'
import keyboard from './Keyboard.js'

describe('keyboard', function () {
  let keyboardInstance

  beforeEach(() => {
    keyboardInstance = keyboard({volumeSelector: '.test-selector'})
    keyboardInstance.initialize()
  })

  test('should set a default volume on creation', function () {
    assert.equal(keyboardInstance.volume, 0.25)
  })

  test('should accept a volume on creation', function () {
    keyboardInstance = keyboard({volume: 0.25})
    assert.equal(keyboardInstance.volume, 0.25)
  })

  test('should accept a volume selector on creation', function () {
    keyboardInstance = keyboard({volumeSelector: '.test-selector'})
    assert.equal(keyboardInstance.volumeSelector, '.test-selector')
  })

  test('should update the volume', function () {
    const firstVolume = keyboardInstance.volume

    keyboardInstance.updateVolume(65)

    const secondVolume = keyboardInstance.volume
    assert.notEqual(firstVolume, secondVolume)
  })
})
