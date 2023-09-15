import '../include-element/include-element.js'
import '../page-fade/page-fade.js'
import './header-nav.js'
import '../project-display/project-display-element.js'

// eslint-disable-next-line no-undef
globalThis.html2canvas = globalThis.html2canvas ?? function () { console.error('html2canvas is undefined!') }

export default class VrDemoPageController {
    /**
     * Constructor.
     */
    constructor () {
        document.querySelector('a-scene').addEventListener('loaded', () => {
            setTimeout(() => {
                const allProjectsEl = document.getElementById('all-projects')

                const sceneEl = document.querySelector('a-scene')
                const projects3dEl = sceneEl.querySelector('#projects-entity')

                globalThis
                    .html2canvas(allProjectsEl, { backgroundColor: 'transparent' })
                    .then(canvas => {
                        const imageString = canvas.toDataURL('image/png')

                        const proj3dEl = document.createElement('a-image')
                        proj3dEl.id = 'all-projects-3d'
                        proj3dEl.setAttribute('material', 'src', `url(${imageString})`)
                        projects3dEl.appendChild(proj3dEl)
                    })
            }, 200)
        })
    }
}

if ('App' in globalThis === false) globalThis.App = { Page: undefined }
globalThis.App.Page = new VrDemoPageController()