import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'
import BgAudioManager from './bg-audio-page.js'

/**
 * Hover Function
 * @param {string}        eventName   name of the event
 * @param {Element}       element     target element
 * @param {boolean}       muted       whether the page audio is muted
 */
function hoverFn (eventName, element, muted) {
  // Visual
  const hoverStyle = element.getAttribute('hover-style')
  mainImg.classList.add(hoverStyle)

  // Audio
  if (muted) { return }
  const hoverAudio = element.querySelector('audio')
  hoverAudio.currentTime = 0
  hoverAudio.play()
}

/**
 *
 */
function resetFn () {
  // Reset visual update
  mainImg.className = ''
}

/**
 * Background Audio & Mute Manager
 * @type {BgAudioManager}
 */
const audioManager = new BgAudioManager()

// Hook up hover buttons
const mainImg = document.querySelector('main > img')
audioManager.setupElements('a[hover-style]', hoverFn, resetFn, undefined)
