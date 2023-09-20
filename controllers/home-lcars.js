import '../include-element/include-element.js'
import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'
import FadeOutAnchorElement from '../page-fade/page-fade.js'

export default class HomeAlaHomestarPageController {
    /**
     * Constructor.
     */
    constructor () {
        /** Background @type {HTMLAudioElement} */
        const bgAudio = document.getElementById('warp-core-audio')
        const autoPlayFn = () => {
            if (bgAudio.paused)
                bgAudio.play()
        }
        document.addEventListener('click', autoPlayFn, { once: true })
        document.addEventListener('mouseover', autoPlayFn, { once: true })
        document.addEventListener('touchstart', autoPlayFn, { once: true })

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible')
                bgAudio.play()
            else
                bgAudio.pause()
        })

        const okAudio = document.getElementById('beep-ok-audio')
        const cancelAudio = document.getElementById('beep-cancel-audio')

        const navBtns = document.querySelectorAll('a[hover]')
        for (const btn of navBtns) {
            const hoverFn = (ok) => ok ? okAudio.play() : cancelAudio.play()
            btn.addEventListener('mouseover', () => hoverFn(false))
            btn.addEventListener('click', () => hoverFn(true), { once: btn instanceof FadeOutAnchorElement})
            btn.addEventListener('touchstart', () => hoverFn(false))
        }
    }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new HomeAlaHomestarPageController()