// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

let lastFocused = null
let undoElement = null
let detection = null
let live = null
let currentObject = null
let timeout = false
let initialized = false
let check = true
let situatedObjects = {}

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/fI__QaIYR/";

let model, webcam, labelContainer, maxPredictions;

/* <button type="button" onclick="init()">Start</button>
<div id="webcam-container"></div>
<div id="label-container"></div> */
// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    // labelContainer.appendChild(document.createElement("div"));

    const detectionRegion = document.createElement("div")
    detectionRegion.setAttribute("role","region")
    detectionRegion.setAttribute("aria-live","polite")
    
    const detectionH = document.createElement("h2")
    detectionH.innerText = "Situated Objects"
    detection = document.createElement("p")
    detection.id = "live"
    detection.innerText = ""
    detectionRegion.appendChild(detectionH);
    detectionRegion.appendChild(detection);
    labelContainer.appendChild(detectionRegion);

    const liveRegion = document.createElement("div")
    liveRegion.setAttribute("role","region")
    liveRegion.setAttribute("aria-live","polite")
    
    live = document.createElement("p")
    live.id = "live"
    live.innerText = ""
    liveRegion.appendChild(live);
    labelContainer.appendChild(liveRegion);
    const instructions = document.createElement("div")
    const instructionsH = document.createElement("h3")
    const instructionsP = document.createElement("p")
    instructionsH.innerText = "Instructions"
    instructionsP.innerText = "Place an object in front of you. Press Period key to assign the last focused element to the current object. Press Comma to travel to the element the current object represents. You can assign multiple objects and travel to them at will."

    instructions.appendChild(instructionsH)
    instructions.appendChild(instructionsP)
    labelContainer.appendChild(instructions)
    initialized = true
    // for (let i = 0; i < maxPredictions; i++) { // and class labels
    // }
}

async function loop() {
    webcam.update(); // update the webcam frame
    if (check) {
        await predict();
    }
    check = !check
    window.requestAnimationFrame(loop);
}
// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    currentObject = null
    let classPrediction = ""
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > 0.98) {
            currentObject = prediction[i].className
            classPrediction =
                prediction[i].className + " detected." // + ": " + prediction[i].probability.toFixed(2);
        }
    }
        // labelContainer.firstChild.innerHTML = classPrediction;
        detection.innerText = classPrediction
}

const assignElement = (e) => {
    console.log("what is active?",document.activeElement,e)
    if (currentObject) {
        situatedObjects[currentObject] = lastFocused
        live.innerText = currentObject + " has been assigned to your current location. Travel back here at any time by by pressing Comma while " + currentObject + " is in front of you."
    } else {
        live.innerText = "Error: There is no object currently detected. Please place an object on the mat and move your hands away."
    }
}

const focusListener = e => {
    if (e.target) {
        console.log("Focused!",e.target,e)
        lastFocused = e.target
    } else if (e.srcElement) {
        console.log("Focused!",e.srcElement,e)
        lastFocused = e.srcElement
    }
}

const travel = () => {
    if (currentObject) {
        if (situatedObjects[currentObject]) {
            if (situatedObjects[currentObject] === lastFocused && undoElement) {
                undoElement.focus()
                live.innerText = "You successfully used the undo command."
                undoElement = null
            } else {
                undoElement = lastFocused
                console.log("situatedObjects[currentObject]",situatedObjects[currentObject])
                situatedObjects[currentObject].focus()
                live.innerText = "You've moved using your object. Press Comma again if you wish to undo this action."
            }
        } else {
            live.innerText = "Error! " + currentObject + " has not been assigned to anything. Press Period to assign it to the current element."
        }
    } else {
        live.innerText = "Error! There is no object currently detected. Please plainly place an object in front of you and move your hands away from it."
    }
}

const keyListener = e => {
    if (initialized) {
        if (e.code === "Period") {
            assignElement(e)
        } else if (e.code === "Comma") {
            if (!timeout) {
                travel()
            }
        }
        timeout = true
    }
}

const keyupListener = () => {
    timeout = false
}

const wrapper = document.createElement("div")
wrapper.setAttribute("style","position: fixed; top: 10em; right: 8em; z-index: 9999; background: white; max-width: 200px; padding: 10px;")

const initButton = document.createElement("button")
initButton.id = "initButton"
initButton.innerText = "Activate Situated Objects"
initButton.setAttribute("style","background: #c8ebff; border: 1px solid #444; padding: 1em;")
initButton.addEventListener("click",init)

const camDiv = document.createElement("div")
camDiv.id = "webcam-container"
const labelDiv = document.createElement("div")
labelDiv.id = "label-container"

wrapper.appendChild(initButton)
wrapper.appendChild(camDiv)
wrapper.appendChild(labelDiv)
const firstChild = document.body.firstChild
document.body.insertBefore(wrapper, firstChild)

const everything = [...document.querySelectorAll("*")]
everything.forEach(ele => {
    // const interactive = ele.tagName === "BUTTON" || ele.tagName === "INPUT"
    // if (interactive && !ele.getAttribute("tabindex")) {
    //     ele.setAttribute("tabindex","0")
    // }
    ele.addEventListener("focus",focusListener)
})
window.addEventListener("keypress",keyListener)
window.addEventListener("keyup",keyupListener)

console.log("YO!",wrapper)