import { clamp } from "./tones.js";
import { types as chordTypes, create as createChord } from "./chords.js";
function unwrap(cam) { return cam.chord; }
function CMP(a, b) { return b.match - a.match; }
export function find(tones) {
    tones = Array.from(new Set(tones.map(clamp)));
    function computeMatch(chord) {
        let matching = tones.filter(tone => chord.tones.includes(tone)).length;
        if (matching < tones.length) {
            return 0;
        }
        return matching == chord.tones.length ? 2 : 1;
    }
    function wrap(chord) {
        return { chord, match: computeMatch(chord) };
    }
    let computed = tones.flatMap(tone => {
        return chordTypes
            .map(type => createChord(type, tone))
            .map(wrap)
            .filter(cam => cam.match > 0);
    }).sort(CMP);
    if (computed.length == 0) {
        return [];
    }
    if (computed[0].match == 2) {
        return computed.filter(c => c.match == 2).map(unwrap);
    }
    else {
        return computed.map(unwrap);
    }
}
