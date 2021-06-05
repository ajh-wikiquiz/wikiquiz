import { writable } from "svelte/store";

const dark = writable(false); // dark mode

// URL bar
const urlBarValue = writable('');

// Random URLs cache
const randomUrls = writable();
const randomUrlsIndex = writable(0);

// Options
const numQuestionsToGenerate = writable(2);

export { dark, urlBarValue, randomUrls, randomUrlsIndex, numQuestionsToGenerate };
