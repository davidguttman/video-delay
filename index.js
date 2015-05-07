var raf = require('raf')
var getusermedia = require('getusermedia')
var attachMediaStream = require('attachmediastream')

var userDelay = window.location.hash.replace(/^#\/?/, '')
if (!userDelay) {
  window.location = window.location.href + '#/10'
  window.location.reload()
}

var imgBuffer = []
var delayFinished = false
var delayTime = 1000 * userDelay

var video = document.createElement('video')
document.body.appendChild(video)
video.style.position = 'absolute'
video.style.top = 0
video.style.left = 0
video.style.height = '100%'
video.style.opacity = 0.5

var canvas = document.createElement('canvas')
canvas.width = 640
canvas.height = 480
canvas.style.position = 'absolute'
canvas.style.top = 0
canvas.style.left = 0
canvas.style.height = '100%'
canvas.style.opacity = 0.5
document.body.appendChild(canvas)

var bufferCanvas = document.createElement('canvas')
bufferCanvas.width = 640
bufferCanvas.height = 480

var ctx = canvas.getContext('2d')
var ctxBuffer = bufferCanvas.getContext('2d')

var timeStart
var timeReady

getusermedia({video: true, audio: false}, function(err, stream) {
  if (err) return console.error(err)

  attachMediaStream(stream, video)
  videoLoop()

  timeStart = Date.now()
  timeReady = timeStart + delayTime

  var timer = document.createElement('div')
  timer.style.position = 'absolute'
  timer.style.top = '40%'
  timer.style.fontSize = '300%'
  timer.style.color = 'white'
  timer.style.fontFamily = 'helvetica'
  timer.style.textAlign = 'center'
  timer.style.width = '100%'

  document.body.appendChild(timer)

  var interval = setInterval(function() {
    var now = Date.now()
    if (now >= timeReady) {
      delayFinished = true
      timer.parentElement.removeChild(timer)
      clearInterval(interval)
    } else {
      var s = Math.ceil((timeReady - now)/1000)
      timer.innerHTML = 'Video in ' + s + ' seconds'
    }
  }, 1000)
})

function videoLoop () {
  raf(videoLoop)

  ctxBuffer.drawImage(video, 0, 0)
  imgBuffer.push(ctxBuffer.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height))

  if (delayFinished) {
    ctx.putImageData(imgBuffer.shift(), 0, 0)
  }

}

window.addEventListener('hashchange', window.location.reload.bind(window.location))
