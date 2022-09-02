
export default class ProjectDisplayElement extends HTMLElement {

    static templateElement;

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
        let tags = this.getAttribute("tags").split(',');
        tags.sort((a, b) => a.length - b.length + a.localeCompare(b)); // shortest-first, then alphabetical
        tags.forEach(tag => {
            const listItemEl = document.createElement('li');
            const anchorEl = document.createElement('a');
            anchorEl.textContent = `#${tag}`;
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
            linksEl.querySelector(".main").href = this.getAttribute("link-main");
            linksEl.querySelector(".main").classList.remove("hidden");
            linksEl.classList.remove("hidden");
        }
        if (this.hasAttribute("link-repo")) {
            linksEl.querySelector(".repo").href = this.getAttribute("link-repo");
            linksEl.querySelector(".repo").classList.remove("hidden");
            linksEl.classList.remove("hidden");
        }
        if (this.hasAttribute("link-announcement")) {
            linksEl.querySelector(".announcement").href = this.getAttribute("link-announcement");
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
        
        // Set Name (Title)
        if (this.hasAttribute("name")) {
            clone.querySelector(".name").textContent = this.getAttribute("name");
        } else {
            console.warn("project-display element does not have a name!", this);
        }
        
        
        shadow.appendChild(clone);
    }
}

const templateResponse = await fetch('project-display/project-display.html');
ProjectDisplayElement.templateElement = new DOMParser()
    .parseFromString(await templateResponse.text(), 'text/html')
    .querySelector('template');


// Register element
customElements.define('project-display', ProjectDisplayElement);