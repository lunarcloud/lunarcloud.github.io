export default class TarotCardElement extends HTMLElement {

	#holding = false;

	constructor() {
		super();
		this.removeAttribute("dragging");
		this.removeAttribute("holding");

		this.setAttribute("draggable", true);
		this.addEventListener("dragstart", this.#dragStart);
		this.addEventListener("dragend", this.#dragEnd);

		this.addEventListener("mousedown", this.#holdStart);
		this.addEventListener("touchstart", this.#holdStart);
		this.addEventListener("mouseup", this.#holdEnd);
		this.addEventListener("touchend", this.#holdEnd);
		this.addEventListener("touchcancel", this.#holdEnd);
	}

	#dragStart(event) {
		this.setAttribute("dragging", "");
		if (this.id) 
		{
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.dropEffect = "move";
			event.dataTransfer.setData("text", this.id);
		}
		else { 
			console.warn("tarot-card element dragged, but does not have an id set!");
		}
	}

	/**
	 * Handle the end of a drag.
	 * @param {DragEvent} event 
	 */
	#dragEnd(event) {
		this.removeAttribute("dragging");
		event.dataTransfer.dropEffect = "move";
		this.blur();
		this.#holdEnd(event); // not holding if just stopped dragging
	}

	/**
	 * Handle the start of a drag/hold.
	 */
	#holdStart() {
		if (this.#holding) return;
		this.setAttribute("holding", "");
		this.#holding = true;
	}

	/**
	 * Handle the end of a drag/hold.
	 */
	#holdEnd() {
		if (!this.#holding) return;
		this.removeAttribute("holding");
		this.#holding = false;
	}
}

// Register element
customElements.define("tarot-card", TarotCardElement);