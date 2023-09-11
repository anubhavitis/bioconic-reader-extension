const highlightColor = "rgb(213, 234, 255)";

const template = `
  <template id="highlightTemplate">
    <span class="highlight" style="font-weight: bold; display: inline"></span>
  </template>

  <button id="mediumHighlighter">
    <svg class="text-marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 544 512"><path d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z"></path></svg>
  </button>
`;

const styled = ({ display = "none", left = 0, top = 0 }) => `
  #mediumHighlighter {
    align-items: center;
    background-color: green;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    display: ${display};
    justify-content: center;
    left: ${left}px;
    padding: 5px 10px;
    position: fixed;
    top: ${top}px;
    width: 40px;
    z-index: 9999;
  }
  .text-marker {
    fill: white;
  }
  .text-marker:hover {
    fill: ${highlightColor};
  }
`;

function splitStringIntoTwoEqualParts(inputString) {
    const length = inputString.length;

    // Calculate the midpoint of the string
    const midpoint = Math.floor(length / 2);

    // Split the string into two equal parts
    const part1 = inputString.substring(0, midpoint);
    const part2 = inputString.substring(midpoint);

    return [part1, part2];
}

class MediumHighlighter extends HTMLElement {
    get markerPosition() {
        return JSON.parse(this.getAttribute("markerPosition") || "{}");
    }

    get styleElement() {
        return this.shadowRoot.querySelector("style");
    }

    get highlightTemplate() {
        return this.shadowRoot.getElementById("highlightTemplate");
    }

    static get observedAttributes() {
        return ["markerPosition"];
    }

    constructor() {
        super();
        this.render();
    }

    render() {
        this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        style.textContent = styled({});
        this.shadowRoot.appendChild(style);
        this.shadowRoot.innerHTML += template;
        this.shadowRoot
            .getElementById("mediumHighlighter")
            .addEventListener("click", () => this.highlightSelection());
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "markerPosition") {
            this.styleElement.textContent = styled(this.markerPosition);
        }
    }

    highlightSelection() {
        var userSelection = window.getSelection();
        console.log("User selection: " + userSelection)
        for (let i = 0; i < userSelection.rangeCount; i++) {
            this.highlightRange(userSelection.getRangeAt(i));
        }
        window.getSelection().empty();
    }




    highlightRange(range) {
        console.log("Range in highlight range is:" + range)
        

        const extractedElements = range.extractContents()
        const textExtracted = extractedElements.textContent || extractedElements.innerText;
        
        //Extracting array of elements
        const arraryOfElements = textExtracted.split(/\s+/);
        console.log(arraryOfElements)

        arraryOfElements.reverse().forEach(element => {
            const space = document.createTextNode(" ");
            const highlight_clone = this.highlightTemplate.cloneNode(true).content.firstElementChild;

            const [part1, part2] = splitStringIntoTwoEqualParts(element);
            highlight_clone.innerHTML = part1
            
            const new_span = document.createElement('span');
            new_span.appendChild(space);
            new_span.appendChild(highlight_clone)
            new_span.innerHTML += part2
            range.insertNode(new_span)
        });
    }
}

window.customElements.define("medium-highlighter", MediumHighlighter);