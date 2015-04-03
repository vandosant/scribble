function Keyboard() {}

Keyboard.prototype.keydown = function keydown(keyChar) {
  if (keysDown.indexOf(keyChar.which) === -1) {
    var char = String.fromCharCode(keyChar.which);
    var key = keys[char];
    if (key) {
      oscillators[key.index].updateNote(key.freq);
      oscillators[key.index].updateVolume(currentVolume);
      keysDown.push(keyChar.which);
      $("#key-" + char).addClass("keyon");
    }
  }
}

Keyboard.prototype.listen = function() {
  var that = this;
  $(document).keydown(function(e) {
    that.keydown(e);
  })
}
