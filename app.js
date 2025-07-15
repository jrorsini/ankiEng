// API's handlers.
import { ankiEng } from './ankiEng.js';
import { ankiJap } from './ankiJap.js';
import inquirer from 'inquirer';
import addWordCard from './add-word-anki-card.js';
import saveWordAudio from './utils/save-word-audio.js';
import { getVideoIdAndStartTime } from './utils/video-audio-dl.js';
import { videoAudioDL } from './utils/video-audio-dl.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import {
    getJapaneseWordSampleSentence,
    getJapaneseSourceTranscriptTranslation,
} from './src/ai.js';
import isInputEnglish from './utils/isInputEnglish.js';
import saveSentenceAudio from './utils/save-sentence-audio.js';

// scrape https://ejje.weblio.jp/content/選択して examples.

// clear log.
console.clear();

// retrieve user input from terminal
const usrInput = process.argv.slice(2).join(' ').toLowerCase().trim(); // .replaceAll(/[^a-z\-\s]/gi, '');

async function inquirerForYoutubeLink(usrInput) {
    const { youtubeLink } = await inquirer.prompt([
        {
            type: 'input',
            name: 'youtubeLink',
            message: `Lien YouTube pour "${usrInput}":`,
        },
    ]);

    if (youtubeLink.trim() !== '') {
        console.log(`✅ Lien YouTube reçu: ${youtubeLink}`);
    } else {
        console.log('👍 No YouTube link provided.');
    }
    return youtubeLink;
}

async function inquirerSourceTranscript() {
    const { source_transcript } = await inquirer.prompt([
        {
            type: 'input',
            name: 'source_transcript',
            message: `Transcript :`,
        },
    ]);

    if (source_transcript.trim() !== '') {
        console.log(`✅ transcript received: ${source_transcript}`);
    } else {
        console.log('👍 No transcript provided.');
    }
    return source_transcript;
}

// exec('osascript -e \'tell application "iTerm" to close first window\'');

let ankiCard = isInputEnglish(usrInput)
    ? await ankiEng(usrInput)
    : await ankiJap(usrInput);

const youtubeLink = await inquirerForYoutubeLink(usrInput);

if (youtubeLink) {
    const { videoId } = getVideoIdAndStartTime(youtubeLink);

    ankiCard.source_link = youtubeLink;
    ankiCard.source_thumbnail = `<img src="https://img.youtube.com/vi/${videoId}/0.jpg"/>`;
    ankiCard.source_audio = `[sound:youglish_${ankiCard.word}_${videoId}_audio.mp3]`;

    const source_transcript = await inquirerSourceTranscript();
    if (source_transcript !== '') {
        ankiCard.source_transcript =
            await getJapaneseSourceTranscriptTranslation(source_transcript);
    }

    await videoAudioDL(ankiCard.word, youtubeLink);
} else {
    ankiCard.source_audio = `[sound:audio_${ankiCard.word}_sample_sentence.mp3]`;
    ankiCard.source_transcript = await getJapaneseWordSampleSentence(
        ankiCard.word
    );
}

await addWordCard(ankiCard);

isInputEnglish(usrInput)
    ? await saveWordAudio('en', ankiCard.word, ankiCard.word)
    : await saveWordAudio('ja', ankiCard.word, ankiCard.reading);

if (!isInputEnglish(usrInput) && !youtubeLink) {
    await saveSentenceAudio(ankiCard.word, ankiCard.source_transcript);
}
