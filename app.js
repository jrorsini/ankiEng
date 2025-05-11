// API's handlers.
import { ankiEng } from './ankiEng.js';
import { ankiJap } from './ankiJap.js';
import inquirer from 'inquirer';

function isInputEnglish(text) {
    // Checks if the string contains any Roman characters (A-Z, a-z)
    return /[A-Za-z]/.test(text);
}

// clear log.
console.clear();

// retrieve user input from terminal
const usrInput = process.argv.slice(2).join(' ').toLowerCase().trim(); // .replaceAll(/[^a-z\-\s]/gi, '');

async function askForYoutubeLink(usrInput) {
    const { youtubeLink } = await inquirer.prompt([
        {
            type: 'input',
            name: 'youtubeLink',
            message: `Lien YouTube pour "${usrInput}":`,
        },
    ]);

    if (youtubeLink.trim() !== '') {
        console.log(`✅ YouTube link received: ${youtubeLink}`);
    } else {
        console.log('👍 No YouTube link provided.');
    }
    return youtubeLink;
}
const youtubeLink = await askForYoutubeLink(usrInput);

isInputEnglish(usrInput)
    ? await ankiEng(usrInput, youtubeLink)
    : await ankiJap(usrInput, youtubeLink);

// exec('osascript -e \'tell application "iTerm" to close first window\'');
