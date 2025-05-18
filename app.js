// API's handlers.
import { ankiEng } from './ankiEng.js';
import { ankiJap } from './ankiJap.js';
import inquirer from 'inquirer';
import addWordCard from './add-word-anki-card.js';
import saveWordAudio from './utils/save-word-audio.js';
import { getVideoIdAndStartTime } from './utils/video-audio-dl.js';
import { videoAudioDL } from './utils/video-audio-dl.js';
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

// exec('osascript -e \'tell application "iTerm" to close first window\'');

let ankiCard = isInputEnglish(usrInput)
    ? await ankiEng(usrInput)
    : await ankiJap(usrInput);

const youtubeLink = await askForYoutubeLink(usrInput);
if (youtubeLink) {
    const { videoId } = getVideoIdAndStartTime(youtubeLink);

    ankiCard.source_link = youtubeLink;
    ankiCard.source_thumbnail = `<img src="https://img.youtube.com/vi/${videoId}/0.jpg"/>`;
    // ankiCard.source_transcript = !youtubeLink ? transcript : '';
    ankiCard.source_audio = `[sound:youglish_${ankiCard.word}_${videoId}_audio.mp3]`;

    await videoAudioDL(ankiCard.word, youtubeLink);
}

console.log(ankiCard);

isInputEnglish(usrInput)
    ? await addWordCard(ankiCard, '1 - ENGLISH', 'CUSTOM_NOTE_ENGLISH')
    : await addWordCard(ankiCard, '1 - JAPANESE', 'CUSTOM_NOTE_ANKIJAP');

isInputEnglish(usrInput)
    ? await saveWordAudio('en', ankiCard.word, ankiCard.word)
    : await saveWordAudio('ja', ankiCard.word, ankiCard.reading);
