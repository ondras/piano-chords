import * as midi from "./midi.js";
import { Tone, clamp, toString } from "./tones.js";


const NATURAL = new Set<Tone>([0, 2, 4, 5, 7, 9, 11]);
const CODES = {
	"KeyZ": 48,
	"KeyS": 49,
	"KeyX": 50,
	"KeyD": 51,
	"KeyC": 52,
	"KeyV": 53,
	"KeyG": 54,
	"KeyB": 55,
	"KeyH": 56,
	"KeyN": 57,
	"KeyJ": 58,
	"KeyM": 59,

	"KeyQ":   60,
	"Digit2": 61,
	"KeyW":   62,
	"Digit3": 63,
	"KeyE":   64,
	"KeyR":   65,
	"Digit5": 66,
	"KeyT":   67,
	"Digit6": 68,
	"KeyY":   69,
	"Digit7": 70,
	"KeyU":   71,
	"KeyI":   72
}

function isNatural(tone: Tone) {
	return NATURAL.has(clamp(tone));
}

function createKey(midiTone: number) {
	let tone = midi.midiToTone(midiTone);
	let node = document.createElement("li");
	node.classList.add("key");

	if (isNatural(tone)) {
		node.classList.add("white");
	} else {
		node.classList.add("black");
	}
	return node;
}

const MIN = 48;
const MAX = 72;

export default class Keyboard {
	readonly node: HTMLElement;
	protected keys = new Map<number, HTMLElement>();

	constructor(naming: string) {
		this.node = document.createElement("ol");
		this.node.classList.add("keyboard");

		for (let i=MIN; i<=MAX; i++) {
			let key = createKey(i);
			this.node.appendChild(key);
			this.keys.set(i, key);
		}

		this.node.addEventListener("click", this);
		window.addEventListener("keydown", this);
		window.addEventListener("keyup", this);

		midi.addEventListener(this);

		this.naming = naming;
	}

	handleEvent(e: Event) {
		switch (e.type) {
			case "click":
				(e.target as HTMLElement).classList.toggle("active");
			break;

			case "keydown": {
				let midiTone = CODES[(e as KeyboardEvent).code];
				midiTone && this.down(midiTone);
			} break;

			case "keyup": {
				let midiTone = CODES[(e as KeyboardEvent).code];
				midiTone && this.up(midiTone);
			} break;

			case "midimessage": this.onMidiMessage(e as WebMidi.MIDIMessageEvent); break;
		}

		this.onChange();
	}

	private down(midi: number) {
		(this.keys.get(midi) as HTMLElement).classList.add("active");
	}

	private up(midi: number) {
		(this.keys.get(midi) as HTMLElement).classList.remove("active");
	}

	private onMidiMessage(e: WebMidi.MIDIMessageEvent) {
		let [cmd, pitch, velocity] = e.data;
		let tone = midi.midiToTone(pitch) + MIN;

		switch (cmd >> 4) {
			case 9: // note on
				(velocity > 0 ? this.down(tone) : this.up(tone));
			break;

			case 8:
				this.up(tone);
			break; // note off
		}
	}

	get tones() {
		let tones = [] as Tone[];
		this.keys.forEach((node, tone) => {
			node.classList.contains("active") && tones.push(tone);
		});
		return tones;
	}

	set naming(naming: string) {
		this.keys.forEach((node, midiTone) => {
			let tone = midi.midiToTone(midiTone);
			node.textContent = toString(tone, naming);
		});
	}

	onChange() {}
}
