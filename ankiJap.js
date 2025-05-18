import { toHiragana, toRomaji } from 'wanakana';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { tokenizer } from './utils/tokenizer.js';
import { chooseJapaneseTranslation } from './prompt.js';
import { startSpinner } from './utils/cli-loader.js';
import { getJapaneseWordComposition } from './src/ai.js';

const note_fields = {};

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

export async function ankiJap(usrInput, youtubeLink) {
    // word cards to go on Anki.
    let ankiCard = await generate_word_cards(usrInput);

    const stopSpinner = startSpinner(usrInput);

    let translations = await get_Dictionnaire_Japonais(usrInput);

    stopSpinner();

    if (translations.length > 0) {
        // clear log
        console.clear();
        let { romaji, translation, hiragana, kanji } =
            await chooseJapaneseTranslation(translations);

        if (kanji) ankiCard.word = kanji;
        if (hiragana) ankiCard.reading = hiragana;
        if (translation) ankiCard.traduction = translation;
        if (romaji) ankiCard.reading_romaji = romaji;
        ankiCard.audio = `[sound:audio_${ankiCard.reading}_${ankiCard.word}.mp3]`;
    }

    ankiCard.composition = `Peux-tu me donner une explication de la composition du mot ${ankiCard.word} selon le format suivant :
                    ✅ [kanji 1] = [sens simple en français]   
                    ✅ [kanji 2] = [sens simple en français]
                    🔁 [${ankiCard.word}] = [interprétation intuitive du mot, en une phrase courte en français]
                    🎥 Astuce mnémotechnique : 
                Ne donne rien d’autre.`;

    return ankiCard;
}
