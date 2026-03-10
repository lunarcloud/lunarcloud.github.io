import '../nav-header/nav-header-element.js'
import '../page-fade/page-fade.js'
import '../lib/aframe/aframe-master.js'
import { html2canvas } from '../lib/html2canvas-pro/html2canvas-pro.esm.js'
import { ProjectDisplayElement } from '../project-display/project-display-element.js'

export default class ThreeDShowcasePageController {
  /**
   * Constructor.
   */
  constructor () {
    const sceneEl = document.querySelector('a-scene')
    if (sceneEl?.hasLoaded === true)
        this.renderProjects()
    else
        sceneEl.addEventListener('loaded', () => this.renderProjects())
  }

  /**
   * Render the projects element onto the 3d scene.
   */
  renderProjects () {
    debugger
    const sceneEl = document.querySelector('a-scene')
    const projectsEl = document.getElementById('all-projects')

    /**
     * First project.
     * @type {ProjectDisplayElement}
     */
    const firstProject = document.querySelector('project-display')

    firstProject.onReady(() => {
        html2canvas(projectsEl, {
            backgroundColor: 'transparent'
        })
        .then(canvas => {
            const imageString = canvas.toDataURL('image/png')
            const proj3dEl = document.createElement('a-image')
            proj3dEl.id = 'all-projects-3d'
            proj3dEl.setAttribute('material', `src: url(${imageString})`)
            sceneEl.querySelector('#projects-entity').appendChild(proj3dEl)
        })
    })
  }
}

// Run the Page's Controller
new ThreeDShowcasePageController()
