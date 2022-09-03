import {FadeOutAnchorElement} from "../page-fade/page-fade.js";

const pageFilters = new URLSearchParams(location.search)?.get('filter')?.split(',') ?? [];

export default class ProjectDisplayElement extends HTMLElement {

    static templateElement;

    tags = [];

    constructor() {
        super();

        const shadow = this.attachShadow({mode: "open"});

        // Apply external styles to the shadow DOM
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'project-display/project-display.css');

        // Attach the created element to the shadow DOM
        shadow.appendChild(linkElem);

        // Apply Template html to shadow DOM
        const clone = document.importNode(ProjectDisplayElement.templateElement.content, true);
        
        // Append Tags from attribute to list
        this.tags = this.getAttribute("tags").split(',');
        this.tags.sort((a, b) => a.length - b.length + a.localeCompare(b)); // shortest-first, then alphabetical
        this.tags.forEach(tag => {
            if (tag.trim() == '') return; // ignore empties

            const listItemEl = document.createElement('li');
            listItemEl.toggleAttribute("active", pageFilters.includes(tag));

            const anchorEl = document.createElement('a', { is: "fadeout-anchor"});
            anchorEl.textContent = tag;
            anchorEl.href= `?filter=${tag}`;
            anchorEl.addEventListener("fadednavigate", () => { 
                listItemEl.toggleAttribute("active");
                let active = listItemEl.hasAttribute("active");
                const event = new CustomEvent("projectfilterselected", { detail: { tag, active } });
                this.dispatchEvent(event);
             }, {passive: false});

            listItemEl.appendChild(anchorEl);
            clone.querySelector("ul.tags").appendChild(listItemEl);
        });

        // Set Thumbnail
        let thumbStyle = clone.querySelector(".thumbnail").style;
        if (this.hasAttribute("thumbnail")) {
            thumbStyle.backgroundImage = `url(${this.getAttribute("thumbnail")})`;
        }
        if (this.hasAttribute("thumbnail-size")) {
            thumbStyle.backgroundSize = this.getAttribute("thumbnail-size");
        }
        if (this.hasAttribute("thumbnail-repeat")) {
            thumbStyle.backgroundRepeat = this.getAttribute("thumbnail-repeat");
        }

        // Set Links
        let linksEl = clone.querySelector(".links");
        if (this.hasAttribute("link-main")) {
            linksEl.querySelector(".main a").href = this.getAttribute("link-main");
            linksEl.querySelector(".main").classList.remove("hidden");
            linksEl.classList.remove("hidden");
        }
        if (this.hasAttribute("link-repo")) {
            linksEl.querySelector(".repo a").href = this.getAttribute("link-repo");
            linksEl.querySelector(".repo").classList.remove("hidden");
            linksEl.classList.remove("hidden");
        }
        if (this.hasAttribute("link-announcement")) {
            linksEl.querySelector(".announcement a").href = this.getAttribute("link-announcement");
            linksEl.querySelector(".announcement").classList.remove("hidden");
            linksEl.classList.remove("hidden");
        }

        // Set Dates
        if (this.hasAttribute("released")) {
            let dateTimeEl = clone.querySelector(".published time");
            let dateTimeVal = this.getAttribute("released");
            dateTimeEl.setAttribute('datetime', dateTimeVal);
            dateTimeEl.textContent = dateTimeVal;
            clone.querySelector(".published").classList.remove("hidden");
        }
        if (this.hasAttribute("first")) {
            let dateTimeEl = clone.querySelector(".timeframe time.first");
            let dateTimeVal = this.getAttribute("first");
            dateTimeEl.setAttribute('datetime', dateTimeVal);
            dateTimeEl.textContent = dateTimeVal;
            dateTimeEl.classList.remove("hidden");
            clone.querySelector(".timeframe").classList.remove("hidden");
        }
        if (this.hasAttribute("last")) {
            let dateTimeEl = clone.querySelector(".timeframe time.last");
            let dateTimeVal = this.getAttribute("last");
            dateTimeEl.setAttribute('datetime', dateTimeVal);
            dateTimeEl.textContent = dateTimeVal;
            dateTimeEl.classList.remove("hidden");
            clone.querySelector(".timeframe").classList.remove("hidden");
        }

        // Set For (Company, Organization)
        if (this.hasAttribute("for")) {
            clone.querySelector(".for").textContent = this.getAttribute("for");
            clone.querySelector(".for").classList.remove("hidden");
        }

        // Set Rough Team-Size
        if (this.hasAttribute("size")) {
            clone.querySelector(".size").classList.remove("hidden");
            let sizeImg = clone.querySelector(`.size .${this.getAttribute("size")}`);
            sizeImg.classList.remove("hidden");
        }
        
        // Set Name (can't use 'title' because that'll make a tooltip)
        if (this.hasAttribute("name")) {
            let nameEl = clone.querySelector(".name");
            nameEl.textContent = this.getAttribute("name");
            if (this.hasAttribute("name-no-hyphen-char")) 
                nameEl.setAttribute("word-break-no-hyphen", true);
        } else {
            console.warn("project-display element does not have a name!", this);
        }

        
        
        shadow.appendChild(clone);
    }

    /**
     * Compare two project-displays by provided dates.
     * @param {ProjectDisplayElement} projectA  a project-display.
     * @param {ProjectDisplayElement} projectB  another project-display.
     * @returns {number}                        comparison result
     */
    static compareDate(projectA, projectB) {

        // Check if they're both ongoing
        let ongoingA = projectA.hasAttribute("first") && !projectA.hasAttribute("last");
        let ongoingB = projectB.hasAttribute("first") && !projectB.hasAttribute("last");
        if (ongoingA && !ongoingB) return 1;
        if (!ongoingA && ongoingB) return -1;


        let firstA = projectA.attributes['first']?.value ?? "";
        let releasedA = projectA.attributes['released']?.value ?? "";
        let minA =[releasedA, firstA].sort()[0];
        
        let firstB = projectB.attributes['first']?.value ?? "";
        let releasedB = projectB.attributes['released']?.value ?? "";
        let minB = [releasedB, firstB].sort()[0];
        
        return minA.localeCompare(minB);
    }

    /**
     * Create a comparison function with the given attribute.
     * @param   {string}    attributeName   name of the attribute to compare on.
     * @returns {function}                  comparator function.
     */
    static generateCompare(attributeName) {
        return (projectA, projectB) => {
            let attrA = projectA.attributes[attributeName]?.value ?? "";
            let attrB = projectB.attributes[attributeName]?.value ?? "";
            return attrA.localeCompare(attrB);
        };        
    }
}

const templateResponse = await fetch('project-display/project-display.html');
ProjectDisplayElement.templateElement = new DOMParser()
    .parseFromString(await templateResponse.text(), 'text/html')
    .querySelector('template');


// Register element
customElements.define('project-display', ProjectDisplayElement);