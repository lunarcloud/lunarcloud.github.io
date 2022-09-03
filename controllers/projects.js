import ProjectDisplayElement from "../project-display/project-display-element.js";

export default class ProjectsPageController {
    
    /** @type HTMLElement */
    allProjectsEl;
    
    /** @type Array<ProjectDisplayElement> */
    projectEls;

    pageIsFiltered = false;
    pageFilters = [];

    constructor() {
        this.allProjectsEl = document.getElementById("all-projects");

        this.projectEls = Array.prototype.slice.call(
            this.allProjectsEl.querySelectorAll("project-display"), 0
        );
        this.projectEls = this.projectEls.sort(ProjectDisplayElement.compareDate).reverse();

        this.pageFilters = new URLSearchParams(location.search)?.get('filter')?.split(',').filter(i => /\S/.test(i)) ?? [];

        for (let projEl of this.projectEls) {
            this.allProjectsEl.appendChild(projEl);
            let hasFilterTags = this.pageFilters.length == 0 || this.pageFilters.every(i => projEl.tags.includes(i));
            projEl.toggleAttribute("hidden", !hasFilterTags);
            projEl.addEventListener("projectfilterselected", 
                event => this.updateFilter(event.detail.tag, event.detail.active)
            );
        }

        this.filterClearBtn = document.getElementById("filter-clear");
        if (this.pageFilters.length == 0) {
           this.filterClearBtn.toggleAttribute("disabled", true);
        } else {
            this.filterClearBtn.addEventListener("click", () => this.clearFilters());
        }

        let filtersListEl = document.getElementById("filters-list").querySelector("ul.project-tags");
        this.pageFilters.forEach(tag => {
            if (tag.trim() == '') return; // ignore empties

            const listItemEl = document.createElement('li');
            listItemEl.toggleAttribute("active", pageFilters.includes(tag));

            const anchorEl = document.createElement('a');
            anchorEl.textContent = tag;
            anchorEl.addEventListener("click", () => { 
                listItemEl.toggleAttribute("active");
                let active = listItemEl.hasAttribute("active");
                const event = new CustomEvent("projectfilterselected", {
                    detail: { tag, active }
                });
                this.dispatchEvent(event);
             });
             
            listItemEl.appendChild(anchorEl);
            filtersListEl.appendChild(listItemEl);
        });
    }

    updateFilter(tagName, active) {
        if (active) {
            this.pageFilters.push(tagName);
        } else {
            this.pageFilters.splice(this.pageFilters.indexOf(tagName), 1);
        }

        let search = new URLSearchParams(location.search);
        if (this.pageFilters.length == 0) {
            search.delete("filter");
        } else {
            search.set("filter", this.pageFilters);
        }
        location.search = search.toString().replaceAll('%2C', ',');
    }

    clearFilters() {
        let search = new URLSearchParams(location.search);
        search.delete("filter");
        location.search = search;
    }

}

if ('App' in globalThis === false) globalThis.App = { Page: undefined };
globalThis.App.Page = new ProjectsPageController();