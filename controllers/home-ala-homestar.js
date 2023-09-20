import '../include-element/include-element.js'
import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'

export default class HomeAlaHomestarPageController {
    /**
     * Constructor.
     */
    constructor () {
        /** Background @type {HTMLAudioElement} */
        const bgAudio = document.getElementById('bg-fire')
        const autoPlayFn = () => {
            if (bgAudio.paused)
                bgAudio.play()
        }
        document.addEventListener('click', autoPlayFn, { once: true, passive: true })
        document.addEventListener('mouseover', autoPlayFn, { once: true, passive: true })
        document.addEventListener('touchstart', autoPlayFn, { once: true, passive: true })

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible')
                bgAudio.play()
            else
                bgAudio.pause()
        })

        const mainImg = document.querySelector('main > img')
        const navBtns = document.querySelectorAll('a[hover-style]')
        for (const btn of navBtns) {
            const hoverFn = () => {
                const hoverAudio = btn.querySelector('audio')
                const hoverStyle = btn.getAttribute('hover-style')
                mainImg.classList.add(hoverStyle)
                autoPlayFn()
                hoverAudio.currentTime = 0
                hoverAudio.play()
            }
            const resetFn = () => { mainImg.className = '' }
            btn.addEventListener('mouseover', hoverFn, { passive: true })
            btn.addEventListener('mouseout', resetFn, { passive: true })
            btn.addEventListener('touchstart', hoverFn, { passive: true })
            btn.addEventListener('touchend', resetFn, { passive: true })
        }
    }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new HomeAlaHomestarPageController()