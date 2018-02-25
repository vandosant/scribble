import $ from 'jquery'
let contextClass

const context = (function () {
  contextClass = (window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext)

  if (contextClass && contextClass.state === 'running') {
  } else if (contextClass) {
    return new contextClass()
  } else {
    $(document).append('<div class="errors">Sorry, your browser is not supported.</div>')
    return undefined
  }
}())

export const init = () => {
  if (context.state !== 'running') {
    context.resume()
  }
}

export default context
