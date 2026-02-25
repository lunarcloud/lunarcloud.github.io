import '../include-element/include-element.js'
import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'
import BgAudioManager from './bg-audio-page.js'

export default class HomeAlaHomestarPageController {
  /**
   * Background Audio & Mute Manager
   * @type {BgAudioManager}
   */
  audioManager = new BgAudioManager()

  /**
   * Constructor.
   */
  constructor () {
    // Hook up hover buttons
    const mainImg = document.querySelector('main > img')
    const hoverFn = (/** @type {string} */_, /** @type {Element} */ el, /** @type {boolean} */muted) => {
      // Visual
      const hoverStyle = el.getAttribute('hover-style')
      mainImg.classList.add(hoverStyle)

      // Audio
      if (muted) { return }
      const hoverAudio = el.querySelector('audio')
      hoverAudio.currentTime = 0
      hoverAudio.play()
    }
    const resetFn = () => {
      // Reset visual update
      mainImg.className = ''
    }

    this.audioManager.setupElements('a[hover-style]', hoverFn, resetFn, undefined)
  }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new HomeAlaHomestarPageController()
