import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'
import BgAudioManager from './bg-audio-page.js'
import { DetectedOS, GameInput } from '../lib/gameinputjs/src/gameinput.js'

const FocusableQuery = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, *[tabindex], *[contentEditable=true]'

/**
 * Background Audio & Mute Manager
 * @type {BgAudioManager}
 */
const audioManager = new BgAudioManager()

/**
 * Gamepad Handler
 * @type {GameInput}
 */
const gameInput = new GameInput({ debugStatements: true })

/**
 * Elements that can receive focus.
 * @type {Array<Array>}
 */
const focusableElements = []

/**
 * Where the current focus is.
 * @type {{row: number, column: number}}
 */
const currentFocus = {
  row: 0,
  column: -1
}

/**
 * Map of row to last focused column.
 * @type {Map<number, number>}
 */
const rowLastFocus = new Map()

// Cache audio references

/**
 * Audio that plays when an item is selected (focused)
 * @type {HTMLAudioElement}
 */
const selectAudio = document.querySelector('audio#select-audio')

/**
 * Audio that plays when an item is clicked (or equivalent)
 * @type {HTMLAudioElement}
 */
const okAudio = document.querySelector('audio#ok-audio')

/**
 * Audio that plays when cancel button is pushed
 * @type {HTMLAudioElement}
 */
const cancelAudio = document.querySelector('audio#cancel-audio')

/**
 * Audio that plays when menu button is pushed
 * @type {HTMLAudioElement}
 */
const chimeAudio = document.querySelector('audio#chime-audio')

/**
 * Get the grid start minus 1
 * @param {Element} el element
 * @returns {number} 0-based grid index
 */
function getGridRow (el) {
  if (!el) { throw new Error('No element provided!') }

  const gridRowVal = 'computedStyleMap' in el
    ? el.computedStyleMap().get('grid-row-start').toString()
    : window.getComputedStyle(el)['grid-row-start']

  return parseInt(gridRowVal) - 1
}

/**
 * Set focus to a particular element.
 * @param {number} row row
 * @param {number} column column
 */
function setFocus (row, column) {
  /** @type {HTMLElement} */
  const el = focusableElements[row][column]
  if (!el) { return }

  el.focus({ preventScroll: true })
}

/**
 * Focus change handler
 * @param {number} row        item row
 * @param {number} column     item column
 */
function focusChanged (row, column) {
  currentFocus.row = row
  currentFocus.column = column

  rowLastFocus.set(row, column)

  // make noise
  audioManager.playOnce(selectAudio)

  const el = focusableElements[row][column]
  if (!el) { return }

  if (row <= 1) {
    // If element is near the top, go to the top of the page
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  } else {
    // Otherwise scroll to the element
    el.scrollIntoView({ block: 'start', inline: 'start', behavior: 'smooth' })
  }
}

/**
 *
 * @param {string} direction the direction to navigate.
 */
function navigate (direction) {
  if (!document.hasFocus()) { return }

  document.body.classList.remove('paused')

  // console.debug(`navigate ${direction}`)

  if (currentFocus.row < 0 || currentFocus.column < 0) {
    setFocus(0, 0)
    return
  }

  switch (direction) {
    case 'up':
    {
      if (currentFocus.row > 0) {
        const row = currentFocus.row - 1
        const column = rowLastFocus.get(row) ?? 0
        setFocus(row, column)
      }
      break
    }
    case 'down':
    {
      if (currentFocus.row < focusableElements.length - 1) {
        const row = currentFocus.row + 1
        const column = rowLastFocus.get(row) ?? 0
        setFocus(row, column)
      }
      break
    }
    case 'left':
    {
      if (currentFocus.column > 0) { setFocus(currentFocus.row, currentFocus.column - 1) }
      break
    }
    case 'right':
    {
      if (currentFocus.column < focusableElements[currentFocus.row].length - 1) { setFocus(currentFocus.row, currentFocus.column + 1) }
      break
    }
  }
}

/**
 * Respond to the "menu" button
 */
function activateMenu () {
  if (!document.hasFocus()) { return }

  if (!document.body.classList.contains('paused')) { audioManager.playOnce(chimeAudio) } else { audioManager.playOnce(cancelAudio) }
  document.body.classList.toggle('paused')
}

/**
 * Respond to the "accept" button
 * @param {boolean} fromGamepad whether this request came from a gamepad
 */
function accept (fromGamepad = false) {
  if (!document.hasFocus()) { return }

  // console.debug('accept/push')

  document.body.classList.remove('paused')

  // make noise
  audioManager.playOnce(okAudio)

  const currentEl = focusableElements[currentFocus.row][currentFocus.column]
  if (currentEl && 'click' in currentEl) {
    currentEl.click()
    if (fromGamepad) { gameInput.getPlayer(0).rumble({ duration: 200, weakMagnitude: 0.0, strongMagnitude: 0.2 }) }
  }
}

/**
 * Respond to the "cancel" button
 */
function cancel () {
  if (!document.hasFocus()) { return }

  document.body.classList.remove('paused')

  // make noise
  audioManager.playOnce(cancelAudio)

  console.debug('cancel/exit')
}

/**
 * Perform an audio narration
 * @param {string} text   words to speak
 */
function narrate (text) {
  if (audioManager.muted) { return }
  speechSynthesis.cancel()
  speechSynthesis.speak(new SpeechSynthesisUtterance(text))
}

// Get system info
const osNameEls = document.getElementsByClassName('os-name')
for (const el of osNameEls) { el.textContent = DetectedOS.substring(0, 3) }

// Prepare list of elements one can navigate
const rowEls = document.querySelectorAll('#main > *')
for (const rowEl of rowEls) {
  const i = getGridRow(rowEl)
  const els = rowEl.querySelectorAll(FocusableQuery)
  const existingRowEls = focusableElements[i] ?? []

  focusableElements[i] = existingRowEls.concat(Array.from(els))

  for (let j = 0; j < els.length; j++) {
    els[j].addEventListener('focus', () => focusChanged(i, j))
    if (els[j].getAttribute('narrate') === 'select') {
      els[j].addEventListener('click', () => narrate(els[j].textContent))
    }
  }
}

// Wire up events
window.addEventListener('keydown', (e) => {
  if (e.key.startsWith('Arrow')) {
    navigate(e.key.replace('Arrow', '').toLowerCase())
    e.preventDefault()
    e.stopPropagation()
  }
  if (['Accept', 'Enter', ' ', 'Cancel', 'Backspace'].includes(e.key)) {
    // Will be handling on key up
    e.preventDefault()
    e.stopPropagation()
  }
}, { passive: false, capture: true })

window.addEventListener('keyup', (e) => {
  if (e.key === 'Home') {
    activateMenu()
  } else if (['Accept', 'Enter', ' '].includes(e.key)) {
    accept()
  } else if (['Cancel', 'Backspace'].includes(e.key)) {
    cancel()
  } else {
    // no matches, so let event propagate
    return
  }
  e.preventDefault()
  e.stopPropagation()
}, { passive: false, capture: true })

window.addEventListener('focus', (e) => {
// document.body.classList.remove('backgrounded')
}, { passive: true, capture: false })

window.addEventListener('blur', (e) => {
// document.body.classList.add('backgrounded')
}, { passive: true, capture: false })

// Wire up gamepad events
gameInput
  .onReinitialize(() => {
    // TODO show player symbols
    console.debug('Players updated')
    for (let i = 0; i < 4; i++) {
      const player = gameInput.getPlayer(i)

      // Play rumble pattern
      player.rumble({ duration: 200, weakMagnitude: 1.0, strongMagnitude: 0.25 })
      setTimeout(() => player.rumble({ duration: 400, weakMagnitude: 0.25, strongMagnitude: 1.0 }), 300)
      setTimeout(() => player.rumble({ duration: 200, weakMagnitude: 0.25, strongMagnitude: 0.25 }), 800)
    }
    const firstPlayer = gameInput.getPlayer(0)
    const gamepadImgEl = document.querySelector('img.gamepad')
    if (gamepadImgEl instanceof HTMLImageElement) { gamepadImgEl.src = `lib/gameinputjs/img/${firstPlayer?.model?.iconName || 'generic'}.png` }

    const gamepadInstructionsEl = document.querySelector('.hasGamepad')
    if (firstPlayer?.model) {
      gamepadInstructionsEl.removeAttribute('hidden')
      if (firstPlayer?.schema) {
        firstPlayer?.model.mapping.face.ordinal(0)
        gamepadInstructionsEl.querySelector('.button0-name').textContent = firstPlayer?.schema.ordinal(0)
        gamepadInstructionsEl.querySelector('.menu-name').textContent = firstPlayer?.schema.center.menu
      }
    } else {
      gamepadInstructionsEl.setAttribute('hidden', 'hidden')
    }
  })
  .onButtonDown((_index, sectionName /* @type {import('./gameinput-schema.js').GameInputSchemaSectionName} */, buttonName) => {
    // const player = gameInput.getPlayer(index)
    // console.debug(`Player ${index} pushed ${player.getButtonText(button)} (${button})`)

    if (['leftStick', 'dpad'].includes(sectionName)) {
      navigate(buttonName)
    }
  })
  .onButtonUp((index, sectionName, buttonName) => {
    const player = gameInput.getPlayer(index)
    // console.debug(`Player ${index} released ${player.getButtonText(button)} (${button})`)

    if (sectionName === 'center' && buttonName === 'menu') {
      activateMenu()
      return
    } else if (sectionName === 'face' && buttonName === player.schema.ordinalButton(1)) {
      cancel()
      return
    }

    if (sectionName === 'face' && buttonName === player.schema.ordinalButton(0)) {
      accept(true)
    }
  })
