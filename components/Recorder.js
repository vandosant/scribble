function gUM() {
  return new Promise(function (res, rej) {
    if (!navigator.getUserMedia) {
      return rej('getUserMedia not supported');
    }
    navigator.getUserMedia({audio: true}, res, rej);
  })
}

export default function (options) {
  navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

  return gUM()
    .then(function (stream) {
      var mediaRecorder = new MediaRecorder(stream);
      document.querySelector(options['record']).onclick = function handleRecord() {
        mediaRecorder.start();
        console.log('now recordering');
      }
      document.querySelector(options['stop']).onclick = function handleStop() {
        mediaRecorder.stop();
        console.log('not recordering');
      }
    })
    .catch(function (err) {
      console.error(err);
  })
};
