// API's handlers.
import { ankiEng } from './ankiEng.js';
import { ankiJap } from './ankiJap.js';
import inquirer from 'inquirer';
import addWordCard from './add-word-anki-card.js';
import saveWordAudio from './utils/save-word-audio.js';
import { getVideoIdAndStartTime } from './utils/video-audio-dl.js';
import { downloadVideoAudio } from './utils/video-audio-dl.js';
import {
    getJapaneseWordSampleSentence,
    getJapaneseSourceTranscriptTranslation,
} from './src/ai.js';
import isInputEnglish from './utils/isInputEnglish.js';
import saveSentenceAudio from './utils/save-sentence-audio.js';
import { startSpinner } from './utils/cli-loader.js';

console.clear(); // clear log.

const usrInput = process.argv.slice(2).join(' ').toLowerCase().trim(); // retrieve user input from terminal

if (!usrInput) {
    console.log('You must to enter a word as a parameter');
    process.exit(0);
}

async function inquireGetsYoutubeLink() {
    const { youtubeLink } = await inquirer.prompt([
        {
            type: 'input',
            name: 'youtubeLink',
            message: `Youtube link :`,
        },
    ]);

    console.log(
        youtubeLink.trim() !== ''
            ? `✅ link received`
            : 'You must paste a youtube link'
    );
    return youtubeLink;
}

async function inquireSourceTranscript() {
    const { source_transcript } = await inquirer.prompt([
        {
            type: 'input',
            name: 'source_transcript',
            message: `Transcript :`,
        },
    ]);

    console.log(
        source_transcript.trim() !== '' ? `✅ transcript received` : '👍'
    );
    return source_transcript;
}

// exec('osascript -e \'tell application "iTerm" to close first window\'');

let ankiCard = isInputEnglish(usrInput)
    ? await ankiEng(usrInput)
    : await ankiJap(usrInput);

let youtube_link = '';
while (!youtube_link) youtube_link = await inquireGetsYoutubeLink();

let source_transcript = '';
while (!source_transcript) source_transcript = await inquireSourceTranscript();

const { videoId } = getVideoIdAndStartTime(youtubeLink);

ankiCard.source_link = youtubeLink;
ankiCard.source_thumbnail = `<img src="https://img.youtube.com/vi/${videoId}/0.jpg"/>`;
ankiCard.source_audio = `[sound:youglish_${ankiCard.word}_${videoId}_audio.mp3]`;

if (source_transcript !== '') {
    ankiCard.source_transcript = await getJapaneseSourceTranscriptTranslation(
        source_transcript
    );
}

await downloadVideoAudio(ankiCard.word, youtubeLink);

ankiCard.source_audio = `[sound:audio_${ankiCard.word}_sample_sentence.mp3]`;
ankiCard.source_transcript = await getJapaneseWordSampleSentence(ankiCard.word);

isInputEnglish(usrInput)
    ? await saveWordAudio('en', ankiCard.word, ankiCard.word)
    : await saveWordAudio('ja', ankiCard.word, ankiCard.reading);

if (!isInputEnglish(usrInput) && !youtubeLink) {
    await saveSentenceAudio(ankiCard.word, ankiCard.source_transcript);
}
/*
    TODOs :
        - inquire for tags based off the language
        - automatically add the tag rather than doing it manually.
*/

await addWordCard(ankiCard);
