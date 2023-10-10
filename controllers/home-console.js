/* eslint-disable quotes */
import '../include-element/include-element.js'
import '../page-fade/page-fade.js'
import '../nav-header/nav-header-element.js'
import BgAudioManager from './bg-audio-page.js'
import { DetectedBrowser, DetectedOS, GameInput, GameInputButtons } from '../lib/gameinputjs/gameinput.js'

export default class HomeConsolePageController {
    static FocusableQuery = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, *[tabindex], *[contentEditable=true]'

    /**
     * Background Audio & Mute Manager
     * @type {BgAudioManager}
     */
    audioManager = new BgAudioManager()

    /**
     * Gamepad Handler
     * @type {GameInput}
     */
    gameInput = new GameInput({ debugStatements: true })

    /**
     * Elements that can receive focus.
     * @type {Array<Array>}
     */
    focusableElements = []

    /**
     * Where the current focus is.
     * @type {{row: number, column: number}}
     */
    currentFocus = {
        row: 0,
        column: -1
    }

    /**
     * Map of row to last focused column.
     * @type {Map<number, number>}
     */
    rowLastFocus = new Map()

    constructor () {
        const browserNameEls = document.getElementsByClassName('browser-name')
        for (const el of browserNameEls)
            el.textContent = DetectedBrowser

        const osNameEls = document.getElementsByClassName('os-name')
        for (const el of osNameEls)
            el.textContent = DetectedOS

        // Prepare list of elements one can navigate
        const rowEls = document.querySelectorAll('#main > *')
        for (const rowEl of rowEls) {
            const i = this.getGridRow(rowEl)
            const els = rowEl.querySelectorAll(HomeConsolePageController.FocusableQuery)
            const existingRowEls = this.focusableElements[i] ?? []

            this.focusableElements[i] = existingRowEls.concat(Array.from(els))

            for (let j = 0; j < els.length; j++) {
                els[j].addEventListener('focus', () => this.focusChanged(i, j))
            }
        }


        window.addEventListener('keydown', (e) => {
            switch (e.key) {
            case 'ArrowLeft':
                this.navigate('left')
                break
            case 'ArrowRight':
                this.navigate('right')
                break
            case 'ArrowUp':
                this.navigate('up')
                break
            case 'ArrowDown':
                this.navigate('down')
                break
            }
        }, { passive: true, capture: false })

        window.addEventListener('keyup', (e) => {
            switch (e.key) {
            case 'Home':
                this.activateMenu()
                break
            case 'Accept':
            case 'Enter':
            case ' ':
                this.accept()
                break
            case 'Cancel':
            case 'Backspace':
            case 'Escape':
                this.cancel()
                break
            }
        }, { passive: true, capture: false })

        window.addEventListener('focus', (e) => {
            // document.body.classList.remove('backgrounded')
        }, { passive: true, capture: false })

        window.addEventListener('blur', (e) => {
            // document.body.classList.add('backgrounded')
        }, { passive: true, capture: false })

        this.gameInput
            .onReinitialize(() => {
                // TODO show player symbols
                console.debug("Players updated")
                for (let i = 0; i < 4; i++) {
                    const player = this.gameInput.getPlayer(i)

                    // Play rumble pattern
                    player.rumble({ duration: 200, weakMagnitude: 1.0, strongMagnitude: 0.25 })
                    setTimeout(() => player.rumble({ duration: 400, weakMagnitude: 0.25, strongMagnitude: 1.0 }), 300)
                    setTimeout(() => player.rumble({ duration: 200, weakMagnitude: 0.25, strongMagnitude: 0.25 }), 800)
                }
            })
            .onButtonDown((index, button) => {
                // const player = this.gameInput.getPlayer(index)
                // console.debug(`Player ${index} pushed ${player.getButtonText(button)} (${button})`)

                switch (button) {
                case GameInputButtons.dpadLeft:
                case GameInputButtons.leftStickLeft:
                    this.navigate('left')
                    break
                case GameInputButtons.dpadRight:
                case GameInputButtons.leftStickRight:
                    this.navigate('right')
                    break
                case GameInputButtons.dpadUp:
                case GameInputButtons.leftStickUp:
                    this.navigate('up')
                    break
                case GameInputButtons.dpadDown:
                case GameInputButtons.leftStickDown:
                    this.navigate('down')
                    break
                }
            })
            .onButtonUp((index, button) => {
                // const player = this.gameInput.getPlayer(index)
                // console.debug(`Player ${index} released ${player.getButtonText(button)} (${button})`)

                switch (button) {
                case GameInputButtons.menu:
                    this.activateMenu()
                    break
                case GameInputButtons.button0:
                case GameInputButtons.button1:
                    this.accept()
                    console.debug()
                    break
                case GameInputButtons.button2:
                case GameInputButtons.button3:
                    this.cancel()
                    console.debug()
                    break
                }
            })
    }

    /**
     * Get the grid start minus 1
     * @param {Element} el element
     * @returns 0-based grid index
     */
    getGridRow(el) {
        return parseInt(
            el.computedStyleMap().get('grid-row-start').toString()
        ) - 1
    }

    /**
     * Set focus to a particular element.
     * @param {number} row row
     * @param {number} column column
     */
    setFocus (row, column) {
        /** @type {HTMLElement} */
        const el = this.focusableElements[row][column]
        if (!el)
            return

        el.focus()
        el.parentElement.scroll({ left: 0, behavior: 'smooth' })

        this.gameInput.getPlayer(0).rumble({ duration: 200, weakMagnitude: 0.2, strongMagnitude: 0.0 })
    }

    focusChanged (row, column) {
        this.currentFocus.row = row
        this.currentFocus.column = column

        this.rowLastFocus.set(row, column)
        // TODO: make noise
    }

    /**
     *
     * @param {'up'|'down'|'left'|'right'} direction the direction to navigate.
     */
    navigate (direction) {
        if (!document.hasFocus())
            return

        document.body.classList.remove('paused')

        // console.debug(`navigate ${direction}`)

        if (this.currentFocus.row < 0 || this.currentFocus.column < 0) {
            this.setFocus(0, 0)
            return
        }

        switch (direction) {
        case 'up':
        {
            if (this.currentFocus.row > 0) {
                const row = this.currentFocus.row - 1
                const column = this.rowLastFocus.get(row) ?? 0
                this.setFocus(row, column)
            }
            break
        }
        case 'down':
        {
            if (this.currentFocus.row < this.focusableElements.length - 1) {
                const row = this.currentFocus.row + 1
                const column = this.rowLastFocus.get(row) ?? 0
                this.setFocus(row, column)
            }
            break
        }
        case 'left':
        {
            if (this.currentFocus.column > 0)
                this.setFocus(this.currentFocus.row, this.currentFocus.column - 1)
            break
        }
        case 'right':
        {
            if (this.currentFocus.column < this.focusableElements[this.currentFocus.row].length - 1)
                this.setFocus(this.currentFocus.row, this.currentFocus.column + 1)
            break
        }
        }
    }

    activateMenu () {
        if (!document.hasFocus())
            return

        document.body.classList.toggle('paused')
    }

    accept () {
        if (!document.hasFocus())
            return

        // console.debug('accept/push')

        document.body.classList.remove('paused')

        // TODO: make noise

        const currentEl = this.focusableElements[this.currentFocus.row][this.currentFocus.column]
        if (currentEl && 'click' in currentEl) {
            currentEl.click()
            this.gameInput.getPlayer(0).rumble({ duration: 200, weakMagnitude: 0.0, strongMagnitude: 0.2 })
        }
    }

    cancel () {
        if (!document.hasFocus())
            return

        document.body.classList.remove('paused')

        // TODO: make noise
        console.debug('cancel/exit')
    }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new HomeConsolePageController()
