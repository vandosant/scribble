import context from './Context'

let drawVisual
let analyser = context.createAnalyser()

function visualize () {
  let canvas
  let dest

  function init (containerId, nodes) {
    canvas = document.getElementById(containerId)
    dest = context.createMediaStreamDestination()
    const source = context.createMediaStreamSource(dest.stream)
    const canvasCtx = canvas.getContext('2d')
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    source.connect(analyser)
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].connect(dest)
    }

    analyser.fftSize = 2048
    const bufferLength = analyser.frequencyBinCount // half the FFT value
    const dataArray = new Uint8Array(bufferLength) // create an array to store the data

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

    function draw () {
      drawVisual = window.requestAnimationFrame(draw)

      analyser.getByteTimeDomainData(dataArray) // get waveform data and put it into the array created above

      canvasCtx.fillStyle = 'rgb(238, 238, 238)' // draw wave with canvas
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = 'rgb(69, 58, 56)'

      canvasCtx.beginPath()
      const sliceWidth = WIDTH * 1.0 / bufferLength
      let x = 0

      for (var i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = v * HEIGHT / 2

        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else {
          canvasCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2)
      canvasCtx.stroke()
    }

    draw()
  }

  function connect (node) {
    node.connect(dest)
  }

  return {
    init,
    connect
  }
}

export default visualize
