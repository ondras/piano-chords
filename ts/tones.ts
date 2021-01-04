export type Tone = number;

type Bases = Record<string, string>;

const TONES = 12;
const BASES: Record<string, Bases> = {};
BASES["english"] = {
	"0": "C",
	"2": "D",
	"4": "E",
	"5": "F",
	"7": "G",
	"9": "A",
	"10": "B♭",
	"11": "B"
};
BASES["german"] = Object.assign({}, BASES["english"], { "10": "B", "11": "H" });

export function clamp(num: number): Tone {
	num = num % TONES;
	return num < 0 ? num + TONES : num;
}

export function transpose(tone: Tone, offset: number) {
	return clamp(tone + offset);
}

export function parse(str: string, naming = "english") {
	const bases = BASES[naming];

	str = str.trim();
	let base: number | undefined;

	let first = str.charAt(0);
	for (let p in bases) {
		if (bases[p] == first.toUpperCase()) {
			base = Number(p);
		}
	}
	if (base === undefined) {
		throw new Error(`Cannot parse the base tone "${first}"`);
	}

	let i = 0;
	while (++i < str.length) {
		let a = str.charAt(i);
		switch (a) {
			case "#":
			case "♯":
				base += 1;
			break;

			case "b":
			case "♭":
				base -= 1;
			 break;

			default:
				throw new Error(`Cannot parse accidental "${a}"`);
			break;
		}
	}

	return (base + TONES) % TONES;
}

export function toString(tone: Tone, naming = "english") {
	const bases = BASES[naming];

	if (tone in bases) { return bases[tone]; }

	return `${bases[tone-1]}♯`;
}
