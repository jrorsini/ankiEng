// import { addWordCard } from './anki.js';
import { isKanji, toHiragana, toRomaji } from 'wanakana';
import { tokenizer } from './utils/tokenizer.js';
import Reverso from 'reverso-api';
import { chooseJapaneseReversoTranslation } from './prompt.js';
import { addWordCard } from './ankijab-card-handler.js';

const reverso = new Reverso();

const note_fields = {
    word: '',
    reading: '',
    reading_romaji: '',
    translation: '',
    traduction: '',
    // definitions: '',
    // audio: '',
    // sample_jp: '',
    // sample_tr: '',
    // rude: '',
    // img: '',
    // memo_reading: '',
    // source_link: '',
    // source_thumbnail: '',
};

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

    // await reverso.getTranslation(
    //     word_card.basic_form,
    //     'japanese',
    //     'french',
    //     async (err, res) => {
    //         if (err) throw new Error(err.message);
    //         note_fields.traduction = [...new Set(res.translations)];
    //     }
    // );

    // console.log(note_fields);

    // let choosenJapaneseTranslations = await chooseJapaneseReversoTranslation(
    //     note_fields.traduction
    // );

    // note_fields.traduction = choosenJapaneseTranslations;

    return note_fields;
}

// add kanji cards to anki
// word_cards.map(async (kc) => await addWordCard(kc));

export async function ankiJap(usrInput) {
    // clear log
    console.clear();

    // word cards to go on Anki.
    let word_cards = await generate_word_cards(usrInput);
    await addWordCard(word_cards);
}
