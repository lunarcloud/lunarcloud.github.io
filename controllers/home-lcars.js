import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'
import '../lib/model-viewer.min.js'
import BgAudioManager from './bg-audio-page.js'

/**
 * Button Effects Function
 * @param {string}        eventName   name of the event
 * @param {Element}       element     target element
 * @param {boolean}       muted       whether the page audio is muted
 */
function buttonEffects (eventName, element, muted) {
  // Audio
  if (muted) { return }
  const audioEl = eventName === 'click' ? okAudio : cancelAudio
  audioEl.currentTime = 0
  audioEl.play()
}

/**
 * Background Audio & Mute Manager
 * @type {BgAudioManager}
 */
const audioManager = new BgAudioManager()

// Hook up hover buttons
// @ts-ignore
/** @type {HTMLAudioElement} */ const okAudio = document.getElementById('beep-ok-audio')
// @ts-ignore
/** @type {HTMLAudioElement} */ const cancelAudio = document.getElementById('beep-cancel-audio')

if (okAudio instanceof HTMLAudioElement === false || cancelAudio instanceof HTMLAudioElement === false) { throw new Error('This page is wrong') }

audioManager.setupElements('a[hover]', buttonEffects, undefined, buttonEffects)
