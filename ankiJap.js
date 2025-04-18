// import { addWordCard } from './anki.js';
import { isKanji, toHiragana, toRomaji } from 'wanakana';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { tokenizer } from './utils/tokenizer.js';
import Reverso from 'reverso-api';
import { chooseJapaneseTranslation } from './prompt.js';
import { addWordCard } from './ankijab-card-handler.js';

const reverso = new Reverso();

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
    // clear log
    console.clear();

    // word cards to go on Anki.
    let word_card_2_add = await generate_word_cards(usrInput);

    let translations = await get_Dictionnaire_Japonais(usrInput);
    let { romaji, translation, hiragana, kanji } =
        await chooseJapaneseTranslation(translations);

    if (kanji) word_card_2_add.word = kanji;
    if (hiragana) word_card_2_add.reading = hiragana;
    if (translation) word_card_2_add.traduction = translation;
    if (romaji) word_card_2_add.reading_romaji = romaji;

    await addWordCard(word_card_2_add);
}
