import { FadeOutAnchorElement } from '../page-fade/page-fade.js' // eslint-disable-line no-unused-vars

const pageFilters = new URLSearchParams(location.search)?.get('filter')?.split(',') ?? []

export default class ProjectDisplayElement extends HTMLElement {
    /**
     * Element's template.
     * @type {HTMLTemplateElement}
     */
    static templateElement

    /**
     * List of relevant metadata tags.
     * @type {Array<string>}
     */
    tags = []

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

        // Only need this because a-frame overwrites this
        const createElement = (tagName, options) => Document.prototype.createElement.call(document, tagName, options)

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
            anchorEl.addEventListener('fadednavigate', () => {
                const active = listItemEl.toggleAttribute('active')
                this.dispatchEvent(new CustomEvent('projectfilterselected', { detail: { tag, active } }))
            }, { passive: false })

            listItemEl.appendChild(anchorEl)
            clone.querySelector('ul.tags').appendChild(listItemEl)
        })

        // Set Thumbnail
        const thumbStyle = clone.querySelector('.thumbnail').style
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
        const linksEl = clone.querySelector('.links')
        if (this.hasAttribute('link-main')) {
            linksEl.querySelector('.main a').href = this.getAttribute('link-main')
            linksEl.querySelector('.main').classList.remove('hidden')
            linksEl.classList.remove('hidden')
        }
        if (this.hasAttribute('link-repo')) {
            linksEl.querySelector('.repo a').href = this.getAttribute('link-repo')
            linksEl.querySelector('.repo').classList.remove('hidden')
            linksEl.classList.remove('hidden')
        }
        if (this.hasAttribute('link-announcement')) {
            linksEl.querySelector('.announcement a').href = this.getAttribute('link-announcement')
            linksEl.querySelector('.announcement').classList.remove('hidden')
            linksEl.classList.remove('hidden')
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
            if (this.hasAttribute('name-no-hyphen-char')) { nameEl.setAttribute('word-break-no-hyphen', true) }
        } else {
            console.warn('project-display element does not have a name!', this)
        }

        shadow.appendChild(clone)
        setTimeout(() => {
            this.#ready = true
            this.dispatchEvent(new CustomEvent('ready'))
        }, 1)
    }

    /**
     * Register an action to perform when the element is ready.
     * @param {Function} action function to perform.
     */
    onReady (action) {
        if (this.#ready) requestAnimationFrame(action)
        else this.addEventListener('ready', action)
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

        const firstA = projectA.attributes.first?.value ?? ''
        const firstB = projectB.attributes.first?.value ?? ''

        if (ongoingA && ongoingB)
            return firstA.localeCompare(firstB)

        const releasedA = projectA.attributes.released?.value ?? ''
        const minA = [releasedA, firstA].sort()[0]

        const releasedB = projectB.attributes.released?.value ?? ''
        const minB = [releasedB, firstB].sort()[0]

        return minA.localeCompare(minB)
    }

    /**
     * Create a comparison function with the given attribute.
     * @param   {string}    attributeName   name of the attribute to compare on.
     * @returns {Function}                  comparator function.
     */
    static generateCompare (attributeName) {
        return (projectA, projectB) => {
            const attrA = projectA.attributes[attributeName]?.value ?? ''
            const attrB = projectB.attributes[attributeName]?.value ?? ''
            return attrA.localeCompare(attrB)
        }
    }
}

ProjectDisplayElement.templateElement = new DOMParser()
    .parseFromString(await (await fetch('./project-display/project-display.html')).text(), 'text/html')
    .querySelector('template')

// Register element
customElements.define('project-display', ProjectDisplayElement)
