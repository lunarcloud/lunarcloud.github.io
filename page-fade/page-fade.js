document.body.toggleAttribute('unloading', false)

if (document.referrer) {
    document.body.toggleAttribute('same-page', (new URL(document.referrer)).pathname === window.location.pathname)
}

// Let the CSS know when to fade the page in
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        document.body.toggleAttribute('loaded', true)
    }
})

if (document.readyState === 'complete') {
    document.body.toggleAttribute('loaded', true)
}

// Define the Anchor variant that lets us fade out
export class FadeOutAnchorElement extends HTMLAnchorElement {
    fadingOut = false
    samePage = false

    /**
     * Constructor.
     */
    constructor () {
        super()
        if (this.hasAttribute('download')) {
            console.warn('FadeOutAnchorElement is a download! Fading will not be available.', this)
            return
        }

        this.addEventListener('click', e => this.fadePageOut(e))

        // the pathname doesn't correctly read at construction, but does one frame later
        requestAnimationFrame(() => {
            this.samePage = this.pathname === window.location.pathname
            this.toggleAttribute('same-page', this.samePage)
        })
    }

    /**
     * Fade out the page.
     * @param {Event} event event that triggers the fadeout.
     * @returns {boolean} whether we were already fading out when called.
     */
    fadePageOut (event) {
        if (this.fadingOut) return true
        this.fadingOut = true

        document.body.toggleAttribute('loaded', false)
        document.body.toggleAttribute('unloading', true)
        document.body.toggleAttribute('same-page', this.samePage)

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.#fadingOutFinish()
        } else {
            document.body.addEventListener('animationend', () => this.#fadingOutFinish(), { once: true })
            setTimeout(() => this.#fadingOutFinish(), 1000) // in case the animation took too long
        }
        event.preventDefault()

        return false
    }

    /**
     * Cleanup after a fadeout animation.
     */
    #fadingOutFinish () {
        const pageFader = this

        if (!pageFader.fadingOut)
            return

        // This is needed to reset the fade for when user returns via 'back' navigation.
        window.addEventListener('beforeunload', () => {
            document.body.toggleAttribute('loaded', true)
            document.body.toggleAttribute('unloading', false)
            document.body.toggleAttribute('same-page', false)
            pageFader.fadingOut = false
        })

        // done as a final "fadednavigate" means it'll be subject to prevented propogation, and actually happen last
        // particularly, helpful when reduced-motion means no extra time due to animations
        this.addEventListener('fadednavigate', () => {
            // actual click must happen last in function, all code ceases to exist after navigation
            requestAnimationFrame(() => this.click())
        }, { once: true })

        this.dispatchEvent(new CustomEvent('fadednavigate', { detail: { } }))
    }
}

// Register element
customElements.define('fadeout-anchor', FadeOutAnchorElement, { extends: 'a' })

export default FadeOutAnchorElement
