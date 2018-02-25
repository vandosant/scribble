function getUserMedia () {
  return new Promise(function (resolve, reject) {
    if (!navigator.getUserMedia) {
      console.error('getUserMedia not supported')
      return reject(new Error('getUserMedia not supported'))
    }
    navigator.getUserMedia({ audio: true }, resolve, reject)
  })
}

export default function (options) {
  navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
  let mediaRecorder
  let chunks = []

  return getUserMedia()
    .then(function (stream) {
      mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.ondataavailable = function (e) {
        console.log('new data')
        chunks.push(e.data)
      }

      mediaRecorder.onstop = function (e) {
        console.log('data available after MediaRecorder.stop() called.')
        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' })
        chunks = []
        var audioURL = URL.createObjectURL(blob)
        console.log(audioURL)
      }
      return {
        handleStop: function () {
          mediaRecorder.stop()
        },
        handleStart: function () {
          mediaRecorder.start()
        }
      }
    })
    .catch(function (err) {
      console.error(err)
    })
};
