import { FadeOutAnchorElement } from '../page-fade/page-fade.js'

const pageFilters = new URLSearchParams(location.search)?.get('filter')?.split(',') ?? []

const templateHTML = await (await fetch('./project-display/project-display.html')).text()

export class ProjectDisplayElement extends HTMLElement {
  /**
   * Element's template.
   * @type {HTMLTemplateElement}
   */
  static templateElement = new DOMParser().parseFromString(templateHTML, 'text/html').querySelector('template')

  /**
   * List of relevant metadata tags.
   * @type {Array<string>}
   */
  tags = []

  /**
   * Constructor.
   */
  constructor () {
    super()

    // Only need this because a-frame overwrites this
    const createElement = (/** @type {string} */ tagName, /** @type {any} */ options) =>
      Document.prototype.createElement.call(document, tagName, options)

    const shadow = this.attachShadow({ mode: 'open' })

    // Apply external styles to the shadow DOM
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', 'project-display/project-display.css')

    // Attach the created element to the shadow DOM
    shadow.appendChild(linkElem)

    // Apply Template html to shadow DOM
    const clone = document.importNode(ProjectDisplayElement.templateElement.content, true)

    // Append Tags from attribute to list
    this.tags = this.getAttribute('tags').split(',')
    this.tags.sort((a, b) => a.length - b.length + a.localeCompare(b)) // shortest-first, then alphabetical
    this.tags.forEach(tag => {
      if (tag.trim() === '') return // ignore empties

      const listItemEl = createElement('li')
      listItemEl.toggleAttribute('active', pageFilters.includes(tag))

      /** @type {FadeOutAnchorElement} */
      const anchorEl = createElement('a', { is: 'fadeout-anchor' })

      anchorEl.textContent = tag
      anchorEl.href = `?filter=${tag}`
      anchorEl.title = `filter on '${tag}'`
      anchorEl.addEventListener('fadednavigate', () => {
        const active = listItemEl.toggleAttribute('active')
        this.dispatchEvent(new CustomEvent('projectfilterselected', { detail: { tag, active } }))
      }, { passive: false })

      listItemEl.appendChild(anchorEl)
      clone.querySelector('ul.tags').appendChild(listItemEl)
    })

    // Set Thumbnail
    /** @type {HTMLElement} */ const thumbnail = clone.querySelector('.thumbnail')
    const thumbStyle = thumbnail.style
    if (this.hasAttribute('thumbnail')) {
      thumbStyle.backgroundImage = `url(${this.getAttribute('thumbnail')})`
    }
    if (this.hasAttribute('thumbnail-size')) {
      thumbStyle.backgroundSize = this.getAttribute('thumbnail-size')
    }
    if (this.hasAttribute('thumbnail-x')) {
      thumbStyle.backgroundPositionX = this.getAttribute('thumbnail-x')
    }
    if (this.hasAttribute('thumbnail-repeat')) {
      thumbStyle.backgroundRepeat = this.getAttribute('thumbnail-repeat')
    }
    if (this.hasAttribute('thumbnail-bg-color-override')) {
      thumbStyle.backgroundColor = this.getAttribute('thumbnail-bg-color-override')
    }

    // Set Links
    /** @type {HTMLElement} */ const linksEl = clone.querySelector('.links')

    // For each possible type of link button...
    const linkTypes = ['main', 'repo', 'announcement', 'other']
    for (var name of linkTypes) {
        // If we don't list this type of link, skip
        if (!this.hasAttribute(`link-${name}`))
            continue

        // Find the list element (or skip)
        let listEl = linksEl.querySelector(`.${name}`)
        if (listEl instanceof HTMLElement === false)
            continue;

        // Find the anchor element (or skip)
        let anchorEl = listEl.querySelector('a')
        if (anchorEl instanceof HTMLAnchorElement === false)
            continue

        // set the anchor to the correct URL
        anchorEl.href = this.getAttribute(`link-${name}`) ?? ''

        // un-hide
        listEl.classList.remove('hidden')
        linksEl.classList.remove('hidden')

        if (this.hasAttribute(`link-${name}-text`)) {
            anchorEl.text = this.getAttribute(`link-${name}-text`) ?? ''
        }
    }

    // Set Dates
    if (this.hasAttribute('released')) {
      const dateTimeEl = clone.querySelector('.published time')
      const dateTimeVal = this.getAttribute('released')
      dateTimeEl.setAttribute('datetime', dateTimeVal)
      dateTimeEl.textContent = dateTimeVal
      clone.querySelector('.published').classList.remove('hidden')
    }
    if (this.hasAttribute('first')) {
      const dateTimeEl = clone.querySelector('.timeframe time.first')
      const dateTimeVal = this.getAttribute('first')
      dateTimeEl.setAttribute('datetime', dateTimeVal)
      dateTimeEl.textContent = dateTimeVal
      dateTimeEl.classList.remove('hidden')
      clone.querySelector('.timeframe').classList.remove('hidden')
    }
    if (this.hasAttribute('last')) {
      const dateTimeEl = clone.querySelector('.timeframe time.last')
      const dateTimeVal = this.getAttribute('last')
      dateTimeEl.setAttribute('datetime', dateTimeVal)
      dateTimeEl.textContent = dateTimeVal
      dateTimeEl.classList.remove('hidden')
      clone.querySelector('.timeframe').classList.remove('hidden')
    }

    // Set For (Company, Organization)
    if (this.hasAttribute('for')) {
      clone.querySelector('.for').textContent = this.getAttribute('for')
      clone.querySelector('.for').classList.remove('hidden')
    }

    // Set Team Role (can't use just "role" as that's ARIA role)
    if (this.hasAttribute('team-role')) {
      clone.querySelector('.team-role').textContent = this.getAttribute('team-role')
      clone.querySelector('.team-role').classList.remove('hidden')
    }

    // Set Rough Team-Size
    if (this.hasAttribute('size')) {
      clone.querySelector('.size').classList.remove('hidden')
      const sizeImg = clone.querySelector(`.size .${this.getAttribute('size')}`)
      sizeImg.classList.remove('hidden')
    }

    // Set Name (can't use 'title' because that'll make a tooltip)
    if (this.hasAttribute('name')) {
      const nameEl = clone.querySelector('.name')
      nameEl.textContent = this.getAttribute('name')
      if (this.hasAttribute('name-no-hyphen-char')) { nameEl.setAttribute('word-break-no-hyphen', 'true') }
    } else {
      console.warn('project-display element does not have a name!', this)
    }

    shadow.appendChild(clone)
  }

  /**
   * Return the newer of two dates
   * @param {string} value             one of the values
   * @param {string} other             the other value
   * @returns {string}  the later value
   */
  static #maxDate(value, other, returnMinimum = true) {
    return [value, other].sort()[1];
  }

  /**
   * Compare two project-displays by provided dates.
   * @param {ProjectDisplayElement} projectA  a project-display.
   * @param {ProjectDisplayElement} projectB  another project-display.
   * @returns {number}                        comparison result
   */
  static compareDate (projectA, projectB) {
    // Check if they're both ongoing
    const ongoingA = projectA.hasAttribute('first') && !projectA.hasAttribute('last')
    const ongoingB = projectB.hasAttribute('first') && !projectB.hasAttribute('last')

    if (ongoingA && !ongoingB)
         return 1

    if (!ongoingA && ongoingB)
        return -1

    const firstA = projectA.getAttribute('first') ?? ''
    const firstB = projectB.getAttribute('first') ?? ''

    if (ongoingA && ongoingB)
        return firstA.localeCompare(firstB)

    const lastA = projectA.getAttribute('last') ?? ''
    const lastB = projectB.getAttribute('last') ?? ''

    const releasedA = projectA.getAttribute('released') ?? ''
    const releasedB = projectB.getAttribute('released') ?? ''

    const minA = ProjectDisplayElement.#maxDate(releasedA, lastA)
    const minB = ProjectDisplayElement.#maxDate(releasedB, lastB)

    return minA.localeCompare(minB)
  }

  /**
   * @callback ProjectComparator
   * @param {{ attributes: { [x: string]: { value: string; }; }; }} projectA
   * @param {{ attributes: { [x: string]: { value: string; }; }; }} projectB
   * @returns {number}      -1, 0, 1 for less than, equal, greater than
   */

  /**
   * Create a comparison function with the given attribute.
   * @param   {string}    attributeName   name of the attribute to compare on.
   * @returns {ProjectComparator}         comparator function.
   */
  static generateCompare (attributeName) {
    return (projectA, projectB) => {
      const attrA = projectA.attributes[attributeName]?.value ?? ''
      const attrB = projectB.attributes[attributeName]?.value ?? ''
      return attrA.localeCompare(attrB)
    }
  }
}

// Register element
customElements.define('project-display', ProjectDisplayElement)
