import FadeOutAnchorElement from '../page-fade/page-fade.js'

export default class BgAudioManager {
    /**
     * Whether the page audio is enabled.
     * @type {boolean}
     */
    muted = true

    /**
     * Background Audio
     * @type {HTMLAudioElement}
     */
    bgAudio

    /**
     * Constructor.
     */
    constructor () {
        this.bgAudio = document.getElementById('bg-audio')
        this.bgAudio.pause() // prevents weirdness with navigation
        document.addEventListener('visibilitychange', () => this.pageVisibilityChanged())

        document.getElementById('unmute-btn')
            .addEventListener('click', () => this.unmuteFn(), { once: true, passive: true })
        document.getElementById('unmute-btn')
            .addEventListener('touchend', () => this.unmuteFn(), { once: true, passive: true })
    }

    /**
     * Unmute.
     */
    unmuteFn () {
        this.muted = false
        this.bgAudio.play()

        document.getElementById('unmute-btn').style.display = 'none'
    }

    /**
     * Handle page visibility change.
     */
    pageVisibilityChanged () {
        if (this.muted)
            return

        if (document.visibilityState === 'visible')
            this.bgAudio.play()
        else
            this.bgAudio.pause()
    }

    /**
     * Setup elements which may need to play sounds.
     * @param {Array<Element> | string} elements elements to handle events for.
     * @param {Function} onHover Element hovering handler.
     * @param {Function} onLeave Element un-hovering handler.
     * @param {Function} onClick Element clicking handler.
     */
    setupElements (elements, onHover, onLeave, onClick) {
        if (typeof elements === 'string')
            elements = document.querySelectorAll(elements)

        for (const el of elements) {
            if (onHover) {
                el.addEventListener('mouseover', () => onHover('mouseover', el, this.muted), {
                    passive: true
                })
                el.addEventListener('touchstart', () => onHover('touchstart', el, this.muted), {
                    passive: true
                })
            }
            if (onLeave) {
                el.addEventListener('mouseout', () => onLeave('mouseout', el, this.muted), {
                    passive: true
                })
                el.addEventListener('touchend', () => onLeave('touchend', el, this.muted), {
                    passive: true
                })
            }
            if (onClick)
                el.addEventListener('click', () => onClick('click', el, this.muted), {
                    once: el instanceof FadeOutAnchorElement,
                    passive: true
                })
        }
    }

    /**
     * Play a non-looping sound (if not muted)
     * @param {Element | string} element    element to handle events for.
     */
    playOnce (element) {
        if (typeof element === 'string')
            element = document.querySelector(element)

        // make noise
        if (!this.muted && element instanceof HTMLAudioElement) {
            element.currentTime = 0
            element.play()
        }
    }
}
