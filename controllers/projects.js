import ProjectDisplayElement from "../project-display/project-display-element.js";

export default class ProjectsPageController {
    
    /** @type HTMLElement */
    allProjectsEl;
    
    /** @type Array<ProjectDisplayElement> */
    projectEls;

    constructor() {
        this.allProjectsEl = document.getElementById("all-projects");

        this.projectEls = Array.prototype.slice.call(
            this.allProjectsEl.querySelectorAll("project-display"), 0
        );
        this.projectEls = this.projectEls.sort(ProjectDisplayElement.compareDate).reverse();
        for (let projEl of this.projectEls) {
            this.allProjectsEl.appendChild(projEl);
        }
    }
}

if ('App' in globalThis === false) globalThis.App = { Controller: undefined };
globalThis.App.Controller = new ProjectsPageController();