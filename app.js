// API's handlers.
import { ankiEng } from './ankiEng.js';
import { ankiJap } from './ankiJap.js';
import addWordCard from './add-word-anki-card.js';
import saveWordAudio from './utils/save-word-audio.js';
import { getVideoIdAndStartTimeFromYoutubeURL } from './utils/video-audio-dl.js';
import { downloadVideoAudio } from './utils/video-audio-dl.js';
import {
    inquireSourceLink,
    inquireSourceTranscript,
    inquireTag,
    inquireWord,
} from './prompts.js';
import { convertYoutubeURL } from './utils/embed-video-link-handler.js';
import { getJapaneseSourceTranscriptTranslation } from './src/ai.js';
import isRomanChar from './utils/isRomanChar.js';
import { startSpinner } from './utils/cli-loader.js';

console.clear(); // clear log.

let usrInput = '';
let source_link = '';
let channel_name = '';

/*
    new chatGPT prompt to implement : 
        I need you to pick a generic term related to "drive" (noun) (volonté, instinct en français) 
        and tell me what's the nuance between the two so that I can know when to use it. 
        in a few words please.
*/

/**
 *
 * DODO List
 * →
 *      When being on youglish, I want the applescript to identify it's on youglish and retrieve timecode, videolink AND the transcript.
 * →
 *      (japanese words only) word is inputed, need to display which words in kanji collection if they have one of the kanjis.
 * →
 *      in case the insideedtion : https://youtu.be/W7M9-i5NwTY?t=14 I want the apple script to register the cc for transcript so I won't have to do it manually.
 */

// also with ankiJap, I must list the words with a reading similar to the search.

// list of arguments from CLI
let cli_args = process.argv.slice(2);

// Number of the arguments from CLI
let cli_args_len = cli_args.length;

// if first argument is a youtube link, then extract channel name and set usrInput accordingly.
let hasYoutubeLink = cli_args_len >= 2 && cli_args[0].includes('youtube.com');

// if youtube link is present, set source_link and channel_name from CLI args.
if (hasYoutubeLink) {
    [source_link, channel_name] = [
        convertYoutubeURL(cli_args[0]),
        cli_args[1].replaceAll(' ', '_'),
    ];
}

// set usrInput from CLI or prompt the user for input. based off youtube link presence.
usrInput = cli_args
    .slice(hasYoutubeLink ? 2 : 0)
    .join(' ')
    .toLowerCase()
    .trim();

if (!usrInput) usrInput = await inquireWord();

let note_fields = isRomanChar(usrInput)
    ? await ankiEng(usrInput)
    : await ankiJap(usrInput, channel_name);

let note_tags = !channel_name ? await inquireTag() : [channel_name];

while (!source_link) source_link = await inquireSourceLink();

let source_transcript = '';
while (!source_transcript) source_transcript = await inquireSourceTranscript();

note_fields.source_transcript = source_transcript;
note_fields.source_transcript_tr = await getJapaneseSourceTranscriptTranslation(
    source_transcript
);

const { videoId } = getVideoIdAndStartTimeFromYoutubeURL(source_link);

downloadVideoAudio(note_fields.word, source_link);
saveWordAudio(isRomanChar(usrInput) ? 'en' : 'ja', note_fields.word);

note_fields.source_link = source_link;
note_fields.source_thumbnail = `<img src="https://img.youtube.com/vi/${videoId}/0.jpg"/>`;
note_fields.source_audio = `[sound:source_audio_${note_fields.word}_${videoId}_audio.mov]`;
note_fields.audio = `[sound:audio_${note_fields.word}.mp3]`;

await addWordCard(note_fields, note_tags);
