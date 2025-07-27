// API's handlers.
import { ankiEng } from './ankiEng.js';
import { ankiJap } from './ankiJap.js';
import addWordCard from './add-word-anki-card.js';
import saveWordAudio from './utils/save-word-audio.js';
import { getVideoIdAndStartTime } from './utils/video-audio-dl.js';
import { downloadVideoAudio } from './utils/video-audio-dl.js';
import {
    inquireSourceLink,
    inquireSourceTranscript,
    inquireTag,
} from './prompts.js';
import { getJapaneseSourceTranscriptTranslation } from './src/ai.js';
import isInputEnglish from './utils/isInputEnglish.js';
import { startSpinner } from './utils/cli-loader.js';

console.clear(); // clear log.

const usrInput = process.argv.slice(2).join(' ').toLowerCase().trim(); // retrieve user input from terminal

if (!usrInput) {
    console.log('You must to enter a word to search');
    process.exit(0);
}

let note_fields = isInputEnglish(usrInput)
    ? await ankiEng(usrInput)
    : await ankiJap(usrInput);

let source_link = '';
while (!source_link) source_link = await inquireSourceLink();

let source_transcript = '';
while (!source_transcript) source_transcript = await inquireSourceTranscript();

note_fields.source_transcript = await getJapaneseSourceTranscriptTranslation(
    source_transcript
);

const { videoId } = getVideoIdAndStartTime(source_link);

downloadVideoAudio(note_fields.word, source_link);
saveWordAudio(isInputEnglish(usrInput) ? 'en' : 'ja', note_fields.word);

note_fields.source_link = source_link;
note_fields.source_thumbnail = `<img src="https://img.youtube.com/vi/${videoId}/0.jpg"/>`;
note_fields.source_audio = `[sound:source_audio_${note_fields.word}_${videoId}_audio.m4a]`;
note_fields.audio = `[sound:audio_${note_fields.word}.mp3]`;

let note_tags = await inquireTag();

await addWordCard(note_fields, note_tags);
