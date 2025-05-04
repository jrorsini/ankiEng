import { toHiragana, toRomaji } from 'wanakana';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { tokenizer } from './utils/tokenizer.js';
import { chooseJapaneseTranslation } from './prompt.js';
import { addWordCard } from './ankijab-card-handler.js';
import { convertYouTubeEmbedToShort } from './utils/embed-video-link-handler.js';
import {
    generate_yt_dlp_cmd,
    generate_ffmpeg_cmd,
} from './utils/generate_yt_dlp_cmd.js';
import { getYouglishEmbededVideoLinkAndTranscript } from './src/ankiJap_get-youglish-embeded-video-link-and-transcript.js';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const note_fields = {
    word: '',
    reading: '',
    reading_romaji: '',
    traduction: '',
};

export async function get_Dictionnaire_Japonais(userInput) {
    try {
        const { data } = await axios.get(
            `https://www.dictionnaire-japonais.com/search.php?w=${userInput}&t=1`
        );

        const $ = cheerio.load(data);
        let content = [];

        $('ul.resultsList > li > a').each((i, e) => {
            const $el = $(e);

            content.push(
                `${$el.children().eq(1).text().trim().split(' ')[1]} - ${$el
                    .children()
                    .eq(2)
                    .text()
                    .trim()} - ${
                    $el.children().eq(1).text().trim().split(' ')[0]
                } - ${$el.children().eq(1).text().trim().split(' ')[2]} `
            );
        });

        return content;
    } catch (error) {
        console.error('Error fetching data : ', error);
        return '';
    }
}

export async function generate_word_cards(input) {
    // list tokenized parts of the input and gives me reading and all that.
    let word_card = tokenizer.tokenize(input).slice(0, 1)[0];

    if (word_card.basic_form !== word_card.surface_form) {
        const basicForm = tokenizer
            .tokenize(word_card.basic_form)
            .slice(0, 1)[0];
        word_card = basicForm;
    }

    note_fields.word = word_card.basic_form;
    note_fields.reading = toHiragana(word_card.reading);
    note_fields.reading_romaji = toRomaji(word_card.reading);

    return note_fields;
}

async function runCommands(cmd1, cmd2) {
    try {
        console.log('➡️ Running yt-dlp...');
        await execPromise(cmd1);

        console.log('🎬 yt-dlp done. Now running ffmpeg...');
        await execPromise(cmd2);

        console.log('✅ All commands finished.');
    } catch (err) {
        console.error('❌ Error:', err.stderr || err.message);
    }
}

export async function ankiJap(usrInput) {
    // clear log
    console.clear();

    // word cards to go on Anki.
    let word_card_2_add = await generate_word_cards(usrInput);

    let translations = await get_Dictionnaire_Japonais(usrInput);
    // console.log(translations);
    if (translations.length > 0) {
        let { romaji, translation, hiragana, kanji } =
            await chooseJapaneseTranslation(translations);

        if (kanji) word_card_2_add.word = kanji;
        if (hiragana) word_card_2_add.reading = hiragana;
        if (translation) word_card_2_add.traduction = translation;
        if (romaji) word_card_2_add.reading_romaji = romaji;
    }

    const { transcript, video_url } =
        await getYouglishEmbededVideoLinkAndTranscript(word_card_2_add.word);

    word_card_2_add.source_link = convertYouTubeEmbedToShort(video_url);
    word_card_2_add.source_transcript = transcript;
    word_card_2_add.source_audio = `[sound:${word_card_2_add.word}_audio.mp3]`;

    let cmd1 = await generate_yt_dlp_cmd(word_card_2_add.word, video_url);
    let cmd2 = await generate_ffmpeg_cmd(word_card_2_add.word, video_url);

    await runCommands(cmd1, cmd2);
    await addWordCard(word_card_2_add);
}
