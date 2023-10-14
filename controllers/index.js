import '../include-element/include-element.js'
import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'

export default class StandardHomePageController {
    /**
     * Constructor.
     */
    constructor () {
        const targetEl = document.querySelector('.nag-target')
        const nagArrowEl = document.querySelector('.nag-arrow')

        document.addEventListener('scroll', () => this.nagIfTargetOffscreen(nagArrowEl, targetEl))
        window.addEventListener('resize', () => this.nagIfTargetOffscreen(nagArrowEl, targetEl))
        this.nagIfTargetOffscreen(nagArrowEl, targetEl)
    }

    /**
     * Activate nag-arrow if target is offscreen
     * @param {Element} nagArrowEl element that can nag
     * @param {Element} targetEl element to be nagging about
     */
    nagIfTargetOffscreen (nagArrowEl, targetEl) {
        if (this.isProperVisible(targetEl))
            nagArrowEl.classList.remove('bounce')
        else
            nagArrowEl.classList.add('bounce')
    }

    percentDownPage (el) {
        return el.getBoundingClientRect().top / document.documentElement.clientHeight
    }

    scrolledToBottom () {
        const fullHeight = document.documentElement.scrollHeight
        const height = document.documentElement.getBoundingClientRect().height
        const topPos = document.documentElement.getBoundingClientRect().top

        return (fullHeight + topPos) - height <= 5 // px from bottom
    }

    isProperVisible (el) {
        const percentTop = this.percentDownPage(el)

        if (this.scrolledToBottom() && percentTop < 1)
            return true

        return percentTop >= 0 && percentTop < 0.50
    }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new StandardHomePageController()
