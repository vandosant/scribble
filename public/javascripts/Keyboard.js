function keyboard(obj) {
  var volumeSelector, volume, keysDown, keys;

  keysDown = [];
  volumeSelector = obj.volumeSelector || undefined;
  volume = obj.volume || 0.25;
  keys = {
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
  };

  var keydown = function keydown(keyChar) {
    var that = this;
    if (keysDown.indexOf(keyChar.which) === -1) {
      var char = String.fromCharCode(keyChar.which);
      var key = keys[char];
      if (key) {
        oscillators[key.index].updateNote(key.freq);
        oscillators[key.index].updateVolume(that.volume);
        keysDown.push(keyChar.which);
        $("#key-" + char).addClass("keyon");
      }
    }
  };

  var keyup = function (keyChar) {
    var char = String.fromCharCode(keyChar.which);
    var key = keys[char];
    var keyIndex = keysDown.indexOf(keyChar.which);
    if (keyIndex >= 0) {
      oscillators[key.index].updateVolume(0);
      delete keysDown[keyIndex];
      $("#key-" + char).removeClass("keyon");
    }
  };

  var updateVolume = function (rangeVal) {
    this.volume = (rangeVal / 100) * 0.25;
  };

  var initialize = function () {
    var that = this;
    $(document).keydown(function (e) {
      that.keydown(e);
    });

    $(document).keyup(function (e) {
      that.keyup(e);
    });

    $(that.volumeSelector).change(function () {
      that.updateVolume(this.value);
    });

  };

  return {
    initialize: initialize,
    keydown: keydown,
    keyup: keyup,
    updateVolume: updateVolume,
    volume: volume,
    volumeSelector: volumeSelector
  }
}