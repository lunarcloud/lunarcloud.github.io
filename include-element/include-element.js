
export default class IncludeElement extends HTMLIFrameElement {

    constructor(){
        super();
		const content = (this.contentDocument.body||this.contentDocument);
		this.insertAdjacentHTML('afterend', content.innerHTML);
		this.remove();
    }
}

// Register element
customElements.define("include-element", IncludeElement, {extends: "iframe"});