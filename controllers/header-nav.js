import "../page-fade/page-fade.js";
import "../include-element/include-element.js";
import "../animated-dialog/animated-dialog-element.js";

// On Loaded
document.addEventListener("DOMContentLoaded", () => {
	
    // Remove the back button if on the home page.
    if (["/index.html", "/"].includes(location.pathname))
    {
        let backEl = document.getElementById("return-to-root");
        backEl.parentNode.removeChild(backEl);
    }
	
    // Setup about modal.
    var testDialog = document.getElementById("about-dialog");
    document.getElementById("open-about-dialog").addEventListener("click", () => testDialog.showModal());
    testDialog.querySelector("button").addEventListener("click", () => testDialog.close());
	
}, {once: true});