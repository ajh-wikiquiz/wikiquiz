import { writable } from "svelte/store";

const dark = writable(false); // dark mode

// URL bar
const urlBarValue = writable('');

// Options
const numQuestionsToGenerate = writable(2);

export { dark, urlBarValue, numQuestionsToGenerate };
