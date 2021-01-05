import * as tones from "./tones.js";
const CHORDS = {
    major: [0, 4, 7],
    maj6: [0, 4, 7, 9],
    dom7: [0, 4, 7, 10],
    maj7: [0, 4, 7, 11],
    aug: [0, 4, 8],
    aug7: [0, 4, 8, 10],
    "maj7+": [0, 4, 8, 11],
    dom9: [0, 4, /*8,*/ 10, 2],
    minor: [0, 3, 7],
    min6: [0, 3, 7, 9],
    min7: [0, 3, 7, 10],
    "min/maj7": [0, 3, 7, 11],
    dim: [0, 3, 6],
    dim7: [0, 3, 6, 9],
    m7b5: [0, 3, 6, 10],
    "dim/maj7": [0, 3, 6, 11]
};
const SUFFIXES = {
    major: "",
    maj6: "<sup>6</sup>",
    dom7: "<sup>7</sup>",
    maj7: "maj<sup>7</sup>",
    aug: "+",
    aug7: "+<sup>7</sup>",
    "maj7+": "+maj<sup>7</sup>",
    dom9: "<sup>9</sup>",
    minor: "mi",
    min6: "mi<sup>6</sup>",
    min7: "mi<sup>7</sup>",
    "min/maj7": "mi/maj<sup>7</sup>",
    dim: "dim",
    dim7: "dim<sup>7</sup>",
    m7b5: "mi<sup>7/5-</sup>",
    "dim/maj7": "dim/maj<sup>7</sup>"
};
export const types = Object.keys(CHORDS);
export function parse(str, naming) {
    str = str.trim();
    let parts = str.match(/^(.[#♯b♭]?)(.*)/);
    if (parts == null) {
        throw new Error(`Cannot split chord "${str}"`);
    }
    let base = tones.parse(parts[1], naming);
    for (let type in CHORDS) {
        //		let suffix = stripTags(SUFFIXES[type]);
        let suffix = SUFFIXES[type];
        if (suffix == parts[2]) {
            return create(type, base);
        }
    }
    throw new Error(`No known type found for "${str}"`);
}
export function toString(chord, naming) {
    let base = tones.toString(chord.base, naming);
    let type = SUFFIXES[chord.type];
    return `${base}${type}`;
}
export function transpose(chord, offset) {
    return create(chord.type, tones.transpose(chord.base, offset));
}
export function create(type, base) {
    return {
        type,
        base,
        tones: CHORDS[type].map(offset => tones.transpose(base, offset))
    };
}
