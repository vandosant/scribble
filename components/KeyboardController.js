function keyboardController(keyboard) {
  const handleOctaveIncreased = () => {
    multiplyFrequency(2.0);
  };

  const handleOctaveDecreased = () => {
    multiplyFrequency(0.5);
  };

  const multiplyFrequency = (multiplier) => {
    for (var key in keyboard.keys) {
      keyboard.keys[key].freq = keyboard.keys[key].freq * multiplier;
    }
  };

  return {
    handleOctaveIncreased,
    handleOctaveDecreased,
  };
}

export default keyboardController;
