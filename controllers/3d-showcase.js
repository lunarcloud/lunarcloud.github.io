import '../include-element/include-element.js'
import '../nav-header/nav-header-element.js'
import '../page-fade/page-fade.js'
import ProjectDisplayElement from '../project-display/project-display-element.js'

// eslint-disable-next-line no-undef
globalThis.html2canvas = globalThis.html2canvas ?? function (_el, _opts) {
    const outcome = new Promise((_resolve, reject) => setTimeout(() =>
        reject(new Error('html2canvas is undefined!'))
    , 1))
    return outcome
}

export default class ThreeDShowcasePageController {
    /**
     * Constructor.
     */
    constructor () {
        const sceneEl = document.querySelector('a-scene')
        // @ts-ignore
        if (sceneEl?.hasLoaded === true) {
            this.renderProjects()
        } else {
            sceneEl.addEventListener('loaded', () => this.renderProjects())
        }
    }

    /**
     * Render the projects element onto the 3d scene.
     */
    renderProjects () {
        const sceneEl = document.querySelector('a-scene')
        const projectsEl = document.getElementById('all-projects')

        /**
         * First project.
         * @type {ProjectDisplayElement}
         */
        const firstProject = document.querySelector('project-display')

        firstProject.onReady(() => {
            setTimeout(() => {
                globalThis
                    .html2canvas(projectsEl, { backgroundColor: 'transparent' })
                    .then(canvas => {
                        const imageString = canvas.toDataURL('image/png')
                        const proj3dEl = document.createElement('a-image')
                        proj3dEl.id = 'all-projects-3d'
                        proj3dEl.setAttribute('material', `src: url(${imageString})`)
                        sceneEl.querySelector('#projects-entity').appendChild(proj3dEl)
                    })
            }, 100)
        })
    }
}

globalThis.App ??= { Page: undefined }
globalThis.App.Page = new ThreeDShowcasePageController()
