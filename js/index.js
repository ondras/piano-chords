import { toString } from "./chords.js";
import { find } from "./finder.js";
import { midiToTone } from "./midi.js";
import Keyboard from "./keyboard.js";
function str(chord) { return toString(chord); }
let k = new Keyboard();
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
        node.innerHTML = `Playing ${chords.map(str).join(" / ")}`;
    }
}
document.querySelector("#piano").appendChild(k.node);
k.onChange = update;
update();
