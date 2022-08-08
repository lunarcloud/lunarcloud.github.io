
export default class AnimatedDialogElement extends HTMLDialogElement {

closing = false;

constructor(){
    super();
}

close() {
    if (this.closing) return;
    this.closing = true;

    this.addEventListener('animationend', () => {
    super.close();
    this.classList.remove("dismissing");
    this.closing = false;
    }, {once: true});
    
    this.classList.add("dismissing");
}
}

// Register element
customElements.define('anim-dialog', AnimatedDialogElement, {extends: 'dialog'});
