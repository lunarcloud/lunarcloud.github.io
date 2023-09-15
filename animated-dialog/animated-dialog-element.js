export default class AnimatedDialogElement extends HTMLDialogElement {
    closing = false

    constructor () {
        super()

        // If we've already added the styling, great!
        if (document.querySelector("link[href='animated-dialog/animated-dialog.cssa']") != null) { return }

        // Otherwise add styling to the DOM
        const linkElem = document.createElement('link')
        linkElem.setAttribute('rel', 'stylesheet')
        linkElem.setAttribute('href', 'animated-dialog/animated-dialog.css')
        document.head.appendChild(linkElem)
    }

    close () {
        if (this.closing) return
        this.closing = true

        this.toggleAttribute('dismissing', true)

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { this.#closeFinish() } else { this.addEventListener('animationend', this.#closeFinish, { once: true }) }
    }

    #closeFinish () {
        super.close()
        this.toggleAttribute('dismissing', false)
        this.closing = false
    }
}

// Register element
customElements.define('anim-dialog', AnimatedDialogElement, { extends: 'dialog' })