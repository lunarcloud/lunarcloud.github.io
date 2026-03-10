import '../nav-header/nav-header-element.js'
import { ProjectDisplayElement } from '../project-display/project-display-element.js'
import { FadeOutAnchorElement } from '../page-fade/page-fade.js'

/** @type {HTMLElement} */
const allProjectsEl = document.getElementById('all-projects')

/**
 * Apply filters from the URL params
 * @type {Array<string>}
 */
const pageFilters = new URLSearchParams(location.search)?.get('filter')?.split(',').filter(i => /\S/.test(i)) ?? []

/** @type {Array<ProjectDisplayElement>} */
let projectEls = []

/** @type {HTMLButtonElement} */
let filterClearBtn

/** @type {FadeOutAnchorElement} */
let filterClearBtnA


/**
 * Do the initial sort & filter on projects.
 */
function initSortAndFilter () {
  // Get projects from their elements
  projectEls = Array.prototype.slice.call(
    allProjectsEl.querySelectorAll('project-display'), 0
  )

  // Sort the projects by newest
  projectEls = projectEls.sort(ProjectDisplayElement.compareDate).reverse()

  let shownProjects = 0

  // Add the sorted & filtered projects to the page
  for (const projEl of projectEls) {
    allProjectsEl.appendChild(projEl)
    const hasFilterTags = pageFilters.length === 0 || pageFilters.every(i => projEl.tags.includes(i))
    projEl.toggleAttribute('hidden', !hasFilterTags)
    if (hasFilterTags) { shownProjects++ }
    projEl.addEventListener('projectfilterselected',
      // @ts-ignore
      event => updateFilter(event.detail.tag, event.detail.active)
    )
  }

  document.getElementById('projects-count').textContent =
            `(${shownProjects}${(shownProjects !== projectEls.length ? ` of ${projectEls.length}` : '')})`
}

/**
 * Update the state of a filter.
 * @param {string} tagName name of the label/tag to update
 * @param {boolean} active whether it should be active
 */
function updateFilter (tagName, active) {
  if (active) {
    pageFilters.push(tagName)
  } else {
    pageFilters.splice(pageFilters.indexOf(tagName), 1)
  }

  const search = new URLSearchParams(location.search)
  if (pageFilters.length === 0) {
    search.delete('filter')
  } else {
    search.set('filter', pageFilters.join(','))
  }
  location.search = search.toString().replaceAll('%2C', ',')
}

/**
 * Remove all filtering.
 */
function clearFilters () {
  const search = new URLSearchParams(location.search)
  search.delete('filter')
  filterClearBtnA.href = `?${search}`
  filterClearBtnA.click()
}

// Setup filter clear button
const filterClearEl = document.getElementById('filter-clear')
if (filterClearEl instanceof HTMLButtonElement) { filterClearBtn = filterClearEl } else { throw new Error('Couldn\'t find filter clear button') }

const filterClearAEl = document.getElementById('filter-clear-a')
if (filterClearAEl instanceof FadeOutAnchorElement) { filterClearBtnA = filterClearAEl } else { throw new Error('Couldn\'t find filter clear button') }

if (pageFilters.length === 0) {
  filterClearBtn.toggleAttribute('disabled', true)
  document.getElementById('no-filters-label').style.display = 'inline'
} else {
  filterClearBtn.addEventListener('click', () => clearFilters())
  document.getElementById('no-filters-label').style.display = 'none'
}

// Setup the list of current filters at clickable items
const filtersListEl = document.getElementById('filters-list').querySelector('ul.project-tags')
for (const tag of pageFilters) {
  if (tag.trim() === '') continue // ignore empties

  const listItemEl = document.createElement('li')
  listItemEl.toggleAttribute('active', pageFilters.includes(tag))

  const anchorEl = document.createElement('a', { is: 'fadeout-anchor' })
  anchorEl.textContent = tag
  anchorEl.addEventListener('fadednavigate', () => {
    const active = listItemEl.toggleAttribute('active')
    updateFilter(tag, active)
    return false
  }, { passive: false })

  listItemEl.appendChild(anchorEl)
  filtersListEl.appendChild(listItemEl)
}

// Setup projects once loaded
if (document.getElementById('all-projects').children.length > 1) {
  initSortAndFilter()
} else {
  setTimeout(() => initSortAndFilter(), 10)
}
