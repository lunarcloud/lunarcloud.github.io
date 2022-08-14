export default class TarotSetElement extends HTMLElement {

    #holding = false;

    constructor() {
        super();

        this.addEventListener("dragover", this.#dragOver);
        this.addEventListener("drop", this.#drop);
    }

    /**
     * Drag Over
     * @param {DragEvent} e
     */
    #dragOver(event) {
        event.preventDefault();
    }

    /**
     * Drop
     * @param {DragEvent} event
     */
    #drop(event) {
        event.preventDefault();

        if (!this.id) {
            console.warn("Tried dropping onto a tarot-set without an id!");
            return;
        }
        
        let target = document.getElementById(this.id); // don't use event's target, because it could be a child node, like another card

        if (['all', 'move'].includes(event.dataTransfer.effectAllowed)) 
        {
          let sourceEl = document.getElementById(event.dataTransfer.getData("text"));
          target.appendChild(sourceEl);
        }
    }

}

// Register element
customElements.define('tarot-set', TarotSetElement);