import '../include-element/include-element.js'
import '../animated-dialog/animated-dialog-element.js'
import '../page-fade/page-fade.js'

export default class NavHeaderElement extends HTMLElement {
    /**
     * Element's template.
     * @type {HTMLTemplateElement}
     */
    static templateElement

    /**
     * Whether the element is ready.
     * @type {boolean}
     */
    #ready = false

    /**
     * Constructor.
     */
    constructor () {
        super()

        /** Element Shadow DOM @type {ShadowRoot} */
        const shadow = this.attachShadow({ mode: 'open' })

        // Apply external styles to the shadow DOM
        const linkElem = document.createElement('link')
        linkElem.setAttribute('rel', 'stylesheet')
        linkElem.setAttribute('href', 'nav-header/nav-header.css')

        // Attach the created element to the shadow DOM
        shadow.appendChild(linkElem)

        // Apply Template html to shadow DOM
        const clone = document.importNode(NavHeaderElement.templateElement.content, true)

        // Remove the back button if on the home page.
        if (['/index.html', '/', '/lunarcloud.github.io/'].includes(location.pathname)) {
            const backEl = clone.getElementById('return-to-root')
            backEl.parentNode.removeChild(backEl)
        }

        /** About Modal @type {AnimatedDialog} */
        const testDialog = clone.getElementById('about-dialog')
        clone.getElementById('open-about-dialog').addEventListener('click', () => testDialog.showModal())
        testDialog.querySelector('button').addEventListener('click', () => testDialog.close())

        shadow.appendChild(clone)
        setTimeout(() => {
            this.#ready = true
            this.dispatchEvent(new CustomEvent('ready'))
        }, 500)
    }
}

const templateResponse = await fetch('nav-header/nav-header.html')
NavHeaderElement.templateElement = new DOMParser()
    .parseFromString(await templateResponse.text(), 'text/html')
    .querySelector('template')

// Register element
customElements.define('nav-header', NavHeaderElement)