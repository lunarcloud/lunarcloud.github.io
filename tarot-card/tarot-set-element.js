import "./tarot-card-element.js";

export default class TarotSetElement extends HTMLElement {

    #holding = false;

    constructor() {
        super();

        this.addEventListener("dragover", this.#dragOver);
        this.addEventListener("drop", this.#drop);

        document.addEventListener("DOMContentLoaded", () => {
            this.#sort();
        }, {once: true});
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

        if (["all", "move"].includes(event.dataTransfer.effectAllowed))
        {
            let sourceEl = document.getElementById(event.dataTransfer.getData("text"));
            target.appendChild(sourceEl);
        }
        this.#sort();
    }

    #sort() {
        if (!this.hasAttribute("sorted") && !this.hasAttribute("reverse-sorted"))
            return;

        let sortedBy = document.body.getAttribute("reverse-sorted") || document.body.getAttribute("sorted") || "id";

        /** @type Array<TarotCardElement> */
        let tarotCards = Array.prototype.slice.call(
            this.querySelectorAll("tarot-card"), 0
        );

        let sortFn = (a,b) => sortedBy == "text"
            ? a.textContent.localeCompare(b.textContent)
            : a.getAttribute(sortedBy).localeCompare(b.getAttribute(sortedBy));

        tarotCards.sort(sortFn);
        if (this.hasAttribute("reverse-sorted"))
            tarotCards.reverse();

        for (let card of tarotCards) {
            this.appendChild(card);
        }
    }

}

// Register element
customElements.define("tarot-set", TarotSetElement);