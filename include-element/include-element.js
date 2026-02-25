export default class IncludeElement extends HTMLElement {
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
    this.#loadSource()
  }

  async #loadSource () {
    const source = this.getAttribute('src')
    const dataResponse = await fetch(source)
    const content = new DOMParser()
      .parseFromString(await dataResponse.text(), 'text/html')
      .querySelector('body')

    this.insertAdjacentHTML('afterend', content.innerHTML)

    setTimeout(() => {
      this.#ready = true
      this.dispatchEvent(new CustomEvent('ready'))
      this.remove()
    }, 10)
  }

  /**
   * @callback  ReadyAction
   */

  /**
   * Register an action to perform when the element is ready.
   * @param {ReadyAction} action function to perform.
   */
  onReady (action) {
    if (this.#ready) requestAnimationFrame(action)
    else this.addEventListener('ready', action)
  }
}

// Register element
customElements.define('include-element', IncludeElement)
