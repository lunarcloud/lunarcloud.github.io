import '../include-element/include-element.js'
import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'
import BgAudioManager from './bg-audio-page.js'

export default class HomeFantasyPageController {
    /**
     * Background Audio & Mute Manager
     * @type {BgAudioManager}
     */
    audioManager = new BgAudioManager()
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new HomeFantasyPageController()