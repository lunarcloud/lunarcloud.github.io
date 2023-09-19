import '../include-element/include-element.js'
import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'


export default class HomeAlaHomestarPageController {
    /**
     * Constructor.
     */
    constructor() {
        /** Background @type {HTMLAudioElement} */
        const bgAudio = document.getElementById('bg-fire')
        bgAudio.volume = 0.5
        const autoPlayFn = () => {
            if (bgAudio.paused)
                bgAudio.play()
        }
        document.addEventListener('click', autoPlayFn, { once: true })
        document.addEventListener('mouseover', autoPlayFn, { once: true })
        document.addEventListener('touchstart', autoPlayFn, { once: true })

        const mainImg = document.querySelector('main > img')
        const navBtns = document.querySelectorAll('a[hover-style]')
        for (const btn of navBtns) {
            btn.addEventListener('mouseover', () => {
                const hoverStyle = btn.getAttribute('hover-style')
                mainImg.classList.add(hoverStyle)
            })
            btn.addEventListener('mouseout', () => { mainImg.className = '' })
        }
    }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new HomeAlaHomestarPageController()