import keyboard from "./Keyboard";

function keyboardController(keyboard) {
  var changeOctave = function (up) {
    var multiplier = 0.5;
    if (up) {
      multiplier = 2.0
    }
    return function () {
      for (var key in keyboard.keys) {
        keyboard.keys[key].freq = keyboard.keys[key].freq * multiplier;
      }
    }
  };

  var octaves = Object.create(null);
  octaves.listen = function (configObject) {
    document.getElementById(configObject.octaveUpId).addEventListener("click", changeOctave(true));
    document.getElementById(configObject.octaveDownId).addEventListener("click", changeOctave(false));
  };

  return {
    octaves
  };
}

export default keyboardController;
