// import { addWordCard } from './anki.js';
import { isKanji, toHiragana, toKatakana } from 'wanakana';
import { tokenizer } from './tokenizer.js';
import Reverso from 'reverso-api';

const reverso = new Reverso();

export async function generate_word_cards(input) {
    // list tokenized parts of the input and gives me reading and all that.
    let word_card = tokenizer.tokenize(input).slice(0, 1)[0];

    if (word_card.basic_form !== word_card.surface_form) {
        const basicForm = tokenizer
            .tokenize(word_card.basic_form)
            .slice(0, 1)[0];
        word_card = basicForm;
    }

    // word_card = word_card.map((k) => ({
    //     word: k.basic_form,
    //     reading: toHiragana(k.reading),
    // }));
    // .filter((w) => isKanji(w.word));

    // for (let i = 0; i < word_card.length; i++) {
    await reverso.getTranslation(
        word_card.basic_form,
        'japanese',
        'french',
        async (err, res) => {
            if (err) throw new Error(err.message);
            console.log(res);

            // word_card[i] = {
            //     ...word_card[i],
            //     translations: res.translations,
            //     voice: res.voice,
            //     examples: res.context.examples,
            //     rude: res.context.rude ? '1' : '0',
            // };
        }
    );
    // }

    console.log(word_card);

    return word_card;
}

// add kanji cards to anki
// word_cards.map(async (kc) => await addWordCard(kc));

export async function ankiJap(usrInput) {
    // clear log
    console.clear();

    // word cards to go on Anki.
    let word_cards = await generate_word_cards(usrInput);
}
