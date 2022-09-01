
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

        // Set Background of thumbnail
        if (this.hasAttribute("thumbnail")) {
            clone.querySelector(".thumbnail").style.backgroundImage = `url(${this.getAttribute("thumbnail")})`;
        }

        // Set Title
        if (this.hasAttribute("title")) {
            clone.querySelector(".title").textContent = this.getAttribute("title");
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