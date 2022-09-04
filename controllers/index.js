import "../animated-dialog/animated-dialog-element.js";
import "../page-fade/page-fade.js";

// On Loaded
document.addEventListener("DOMContentLoaded", () => {
	// Setup Modal
	var testDialog = document.getElementById("about-dialog");
	document.getElementById("open-about-dialog").addEventListener("click", () => testDialog.showModal());
	testDialog.querySelector("button").addEventListener("click", () => testDialog.close());
});