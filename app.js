// API's handlers.
import { ankiEng } from './ankiEng.js';
import { ankiJap } from './ankiJap.js';

function isInputEnglish(text) {
    // Checks if the string contains any Roman characters (A-Z, a-z)
    return /[A-Za-z]/.test(text);
}

// clear log.
console.clear();

// retrieve user input from terminal
const usrInput = process.argv.slice(2).join(' ').toLowerCase().trim(); // .replaceAll(/[^a-z\-\s]/gi, '');

// check if input is english
if (isInputEnglish(usrInput)) {
    await ankiEng(usrInput);
} else {
    await ankiJap(usrInput);
}
// exec('osascript -e \'tell application "iTerm" to close first window\'');
