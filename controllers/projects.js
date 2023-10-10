import '../nav-header/nav-header-element.js'
import ProjectDisplayElement from '../project-display/project-display-element.js'
import FadeOutAnchorElement from '../page-fade/page-fade.js'
import IncludeElement from '../include-element/include-element.js'

export default class ProjectsPageController {
    /** @type {HTMLElement} */
    allProjectsEl

    /** @type {Array<ProjectDisplayElement>} */
    projectEls

    /** @type {boolean} */
    pageIsFiltered = false

    /** @type {Array<string>} */
    pageFilters = []

    /** @type {HTMLButtonElement} */
    filterClearBtn

    /** @type {FadeOutAnchorElement} */
    filterClearBtnA

    /**
     * Constructor.
     */
    constructor () {
        this.allProjectsEl = document.getElementById('all-projects')

        // Apply filters from the URL params
        this.pageFilters = new URLSearchParams(location.search)
            ?.get('filter')?.split(',').filter(i => /\S/.test(i)) ?? []

        // Setup filter clear button
        this.filterClearBtn = document.getElementById('filter-clear')
        this.filterClearBtnA = document.getElementById('filter-clear-a')
        if (this.pageFilters.length === 0) {
            this.filterClearBtn.toggleAttribute('disabled', true)
            document.getElementById('project-tags-label').toggleAttribute('hidden', true)
        } else {
            this.filterClearBtn.addEventListener('click', () => this.clearFilters())
        }

        // Setup the list of current filters at clickable items
        const filtersListEl = document.getElementById('filters-list').querySelector('ul.project-tags')
        for (const tag of this.pageFilters) {
            if (tag.trim() === '') return // ignore empties

            const listItemEl = document.createElement('li')
            listItemEl.toggleAttribute('active', this.pageFilters.includes(tag))

            const anchorEl = document.createElement('a', { is: 'fadeout-anchor' })
            anchorEl.textContent = tag
            anchorEl.addEventListener('fadednavigate', () => {
                const active = listItemEl.toggleAttribute('active')
                this.updateFilter(tag, active)
                return false
            }, { passive: false })

            listItemEl.appendChild(anchorEl)
            filtersListEl.appendChild(listItemEl)
        }

        // Setup projects once loaded
        /** @type {IncludeElement} */
        const includeProjectsEl = document.querySelector('#all-projects include-element')
        includeProjectsEl.onReady(() => this.#initSortAndFilter())
    }

    /**
     * Do the initial sort & filter on projects.
     */
    #initSortAndFilter () {
        // Get projects from their elements
        this.projectEls = Array.prototype.slice.call(
            this.allProjectsEl.querySelectorAll('project-display'), 0
        )

        // Sort the projects by newest
        this.projectEls = this.projectEls.sort(ProjectDisplayElement.compareDate).reverse()

        // Add the sorted & filtered projects to the page
        for (const projEl of this.projectEls) {
            this.allProjectsEl.appendChild(projEl)
            const hasFilterTags = this.pageFilters.length === 0 || this.pageFilters.every(i => projEl.tags.includes(i))
            projEl.toggleAttribute('hidden', !hasFilterTags)
            projEl.addEventListener('projectfilterselected',
                event => this.updateFilter(event.detail.tag, event.detail.active)
            )
        }
    }

    /**
     * Update the state of a filter.
     * @param {string} tagName name of the label/tag to update
     * @param {boolean} active whether it should be active
     */
    updateFilter (tagName, active) {
        if (active) {
            this.pageFilters.push(tagName)
        } else {
            this.pageFilters.splice(this.pageFilters.indexOf(tagName), 1)
        }

        const search = new URLSearchParams(location.search)
        if (this.pageFilters.length === 0) {
            search.delete('filter')
        } else {
            search.set('filter', this.pageFilters)
        }
        location.search = search.toString().replaceAll('%2C', ',')
    }

    /**
     * Remove all filtering.
     */
    clearFilters () {
        const search = new URLSearchParams(location.search)
        search.delete('filter')
        this.filterClearBtnA.href = `?${search}`
        this.filterClearBtnA.click()
    }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new ProjectsPageController()
