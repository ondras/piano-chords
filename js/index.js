import { toString } from "./chords.js";
import { find } from "./finder.js";
import { midiToTone } from "./midi.js";
import Keyboard from "./keyboard.js";
const naming = document.querySelector("#naming");
function str(chord) { return `<span class="chord-name">${toString(chord, naming.value)}</span>`; }
let k = new Keyboard(naming.value);
document.body.appendChild(k.node);
function update() {
    let node = document.querySelector("#chords");
    let tones = k.tones.map(midiToTone);
    if (tones.length < 3) {
        node.textContent = "Press more keys";
        return;
    }
    let chords = find(tones);
    if (chords.length == 0) {
        node.textContent = "No chords detected :-(";
    }
    else {
        node.innerHTML = `Detected chord(s):${chords.map(str).join("")}`;
    }
}
document.querySelector("#piano").appendChild(k.node);
k.onChange = update;
naming.addEventListener("change", _ => {
    k.naming = naming.value;
    update();
});
update();
