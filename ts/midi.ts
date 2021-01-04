import { clamp } from "./tones.js";


let listeners = [];

function onStateChange(e) {
  listenToInputs(e.target);
}

function onMidiMessage(e) {
  listeners.forEach(listener => {
    if (typeof(listener) == "function") {
      listener(e);
    } else {
      listener.handleEvent(e);
    }
  });
}

function listenToInputs(access) {
  access.inputs.forEach(input => input.addEventListener("midimessage", onMidiMessage));
}

export function midiToTone(midi: number) {
  return clamp(midi - 36); // 36 = C
}

export function addEventListener(listener: EventListener | EventListenerObject) {
  listeners.push(listener);
}

async function init() {
  if (!navigator.requestMIDIAccess) { return null; }

  let access = await navigator.requestMIDIAccess();
  access.addEventListener("statechange", onStateChange);

  listenToInputs(access);
}

init();
