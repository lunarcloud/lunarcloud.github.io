
export default class AnimatedDialogElement extends HTMLDialogElement {

    closing = false;

    constructor(){
        super();
    }

    close() {
        if (this.closing) return;
        this.closing = true;

        this.toggleAttribute("dismissing", true);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            this.#closeFinish()
        else
            this.addEventListener('animationend', this.#closeFinish, {once: true});
        
    }

    #closeFinish() {
        super.close();
        this.toggleAttribute("dismissing", false);
        this.closing = false;
    }
}

// Register element
customElements.define('anim-dialog', AnimatedDialogElement, {extends: 'dialog'});
