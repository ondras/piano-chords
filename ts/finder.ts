import { Tone, clamp } from "./tones.js";
import { types as chordTypes, create as createChord, Chord } from "./chords.js";


interface ChordAndMatch {
	chord: Chord;
	match: number; // 0 = none, 1 = partial, 2 = exact
}

function unwrap(cam: ChordAndMatch) { return cam.chord; }
function CMP(a: ChordAndMatch, b: ChordAndMatch) { return b.match - a.match; }

export function find(tones: Tone[]) {
	tones = Array.from(new Set(tones.map(clamp)));

	function computeMatch(chord: Chord) {
		let matching = tones.filter(tone => chord.tones.includes(tone)).length;
		if (matching < tones.length) { return 0; }
		return matching == chord.tones.length ? 2 : 1;
	}

	function wrap(chord: Chord) {
		return { chord, match: computeMatch(chord) };
	}

	let computed = tones.flatMap(tone => {
		return chordTypes
			.map(type => createChord(type, tone))
			.map(wrap)
			.filter(cam => cam.match > 0);
		}).sort(CMP);

	if (computed.length == 0) { return []; }
	if (computed[0].match == 2) {
		return computed.filter(c => c.match == 2).map(unwrap);
	} else {
		return computed.map(unwrap);
	}
}
