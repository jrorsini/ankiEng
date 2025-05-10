import { toHiragana, toRomaji } from 'wanakana';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { tokenizer } from './utils/tokenizer.js';
import { chooseJapaneseTranslation } from './prompt.js';
import { addWordCard } from './ankijab-card-handler.js';
import { convertYouTubeEmbedToShort } from './utils/embed-video-link-handler.js';
import { getYouglishEmbededVideoLinkAndTranscript } from './src/ankiJap_get-youglish-embeded-video-link-and-transcript.js';
import { exec } from 'child_process';
import { videoAudioDL } from './utils/video-audio-dl.js';
import { saveWordAudio } from './utils/save-word-audio.js';

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

export async function ankiJap(usrInput) {
    // kanji en video youtube (supprimer manuellement le youglish puis passer le lien de la vidéo youtube)
    // kanji en texte (youglish par défaut)

    // enregistrement dans les deux cas vers le alias.
    // remplissage automatique des champs.

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

    const { videoId, shortUrl } = convertYouTubeEmbedToShort(video_url);

    word_card_2_add.source_link = shortUrl;
    word_card_2_add.source_thumbnail = `<img src="https://img.youtube.com/vi/${videoId}/0.jpg"/>`;
    word_card_2_add.source_transcript = transcript;
    word_card_2_add.audio = `[sound:audio_${word_card_2_add.word}.mp3]`;
    word_card_2_add.source_audio = `[sound:youglish_${word_card_2_add.word}_${videoId}_audio.mp3]`;

    // insertion de la carte.
    await addWordCard(word_card_2_add);

    // génération des fichiers audio.
    await saveWordAudio('jp', word_card_2_add.word);
    await videoAudioDL(word_card_2_add.word, shortUrl);
}
