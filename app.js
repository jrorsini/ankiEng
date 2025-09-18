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
    inquireWord,
} from './prompts.js';
import { convertYoutubeURL } from './utils/embed-video-link-handler.js';
import { getJapaneseSourceTranscriptTranslation } from './src/ai.js';
import isInputEnglish from './utils/isInputEnglish.js';
import { startSpinner } from './utils/cli-loader.js';

console.clear(); // clear log.

let usrInput = '';
let source_link = '';
let channel = '';

/*
    new chatGPT prompt to implement : 
        I need you to pick a generic term related to "drive" (noun) (volonté, instinct en français) 
        and tell me what's the nuance between the two so that I can know when to use it. 
        in a few words please.
*/

// also with ankiJap, I must list the words with a reading similar to the search.

let cli_args = process.argv.slice(2);

if (cli_args.length >= 2 && cli_args[0].includes('youtube.com')) {
    [source_link, channel] = [
        convertYoutubeURL(cli_args[0]),
        cli_args[1].replaceAll(' ', '_'),
    ];
    if (cli_args.length >= 3) {
        usrInput = cli_args.slice(2).join(' ').toLowerCase().trim();
    }
} else {
    usrInput = cli_args.join(' ').toLowerCase().trim();
}

if (!usrInput) usrInput = await inquireWord();

let note_fields = isInputEnglish(usrInput)
    ? await ankiEng(usrInput)
    : await ankiJap(usrInput);

let note_tags = !channel ? await inquireTag() : [channel];

while (!source_link) source_link = await inquireSourceLink();

let source_transcript = '';
while (!source_transcript) source_transcript = await inquireSourceTranscript();

note_fields.source_transcript = source_transcript;
note_fields.source_transcript_tr = await getJapaneseSourceTranscriptTranslation(
    source_transcript
);

const { videoId } = getVideoIdAndStartTime(source_link);

downloadVideoAudio(note_fields.word, source_link);
saveWordAudio(isInputEnglish(usrInput) ? 'en' : 'ja', note_fields.word);

note_fields.source_link = source_link;
note_fields.source_thumbnail = `<img src="https://img.youtube.com/vi/${videoId}/0.jpg"/>`;
note_fields.source_audio = `[sound:source_audio_${note_fields.word}_${videoId}_audio.mov]`;
note_fields.audio = `[sound:audio_${note_fields.word}.mp3]`;

await addWordCard(note_fields, note_tags);
