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
    if (this.isProperVisible(targetEl)) { nagArrowEl.classList.remove('bounce') } else { nagArrowEl.classList.add('bounce') }
  }

  /**
   * Get a percent representing the scrolling progress to get to an element
   * @param {Element} el    element to calculate for
   * @returns {number}      percentage down the page to scroll to the element
   */
  percentDownPage (el) {
    return el.getBoundingClientRect().top / document.documentElement.clientHeight
  }

  /**
   * Determine if we have scrolled to the bottom
   * @returns {boolean}     whether we are at the bottom
   */
  scrolledToBottom () {
    const fullHeight = document.documentElement.scrollHeight
    const height = document.documentElement.getBoundingClientRect().height
    const topPos = document.documentElement.getBoundingClientRect().top

    return (fullHeight + topPos) - height <= 5 // px from bottom
  }

  /**
   * Determine if we actually visible on screen
   * @param {Element}   el      element to check
   * @returns {boolean}         whether the element is more visible than not
   */
  isProperVisible (el) {
    const percentTop = this.percentDownPage(el)

    if (this.scrolledToBottom() && percentTop < 1) { return true }

    return percentTop >= 0 && percentTop < 0.50
  }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new StandardHomePageController()
