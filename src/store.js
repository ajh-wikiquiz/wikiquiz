import { writable } from "svelte/store";

const dark = writable(false); // dark mode

const urlBarValue = writable('');
const articleImgSrc = writable('');

export { dark, urlBarValue, articleImgSrc };
