// Let the CSS know when to fade the page in
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        document.body.toggleAttribute("loaded", true);
    }
});

if (document.readyState === 'complete') {
      document.body.toggleAttribute("loaded", true);
}

// Define the Anchor variant that lets us fade out
export default class FadeOutAnchorElement extends HTMLAnchorElement {

    fadingOut = false;

    constructor(){
        super();
        if (this.attributes.hasOwnProperty("download")) {
            console.warn("FadeOutAnchorElement is a download! Fading will not be available.", this);
            return;
        }

        this.addEventListener('click', e => this.fadePageOut(e));
    }

    fadePageOut(event) {
        if (this.fadingOut) return true;
        this.fadingOut = true;

        document.body.toggleAttribute("loaded", false);
        document.body.toggleAttribute("unloading", true);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            this.#fadingOutFinish()
        else
            document.body.addEventListener('animationend', () => this.#fadingOutFinish(), {once: true});
        
        event.preventDefault();
        return false;
    }

    #fadingOutFinish() {
        this.click();
        this.fadingOut = false;
        setTimeout(() => this.fadePageIn(), 100); // if you don't do this then it's blank when you click 'back'
    }

    fadePageIn() {
        document.body.toggleAttribute("loaded", true);
        document.body.toggleAttribute("unloading", false);
    }
}

// Register element
customElements.define('fadeout-anchor', FadeOutAnchorElement, {extends: 'a'});
