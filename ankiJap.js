import { toHiragana, toRomaji, isKanji } from 'wanakana';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { tokenizer } from './utils/tokenizer.js';
import { inquireJapaneseTranslation } from './prompts.js';
import { startSpinner } from './utils/cli-loader.js';
import { getJapaneseWordComposition } from './src/ai.js';
import chalk from 'chalk';

const note_fields = {};
const ankiUrl = 'http://127.0.0.1:8765';

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

// the translations are fetched at the dictionnaire-japonais.com website.
export async function fetchTranslationsArr(userInput) {
    try {
        const { data } = await axios.get(
            `https://www.dictionnaire-japonais.com/search.php?w=${userInput}&t=1`
        );

        const $ = cheerio.load(data);
        let translationsArr = [];

        $('ul.resultsList > li > a').each((i, e) => {
            const $el = $(e);

            translationsArr.push(
                `${$el.children().eq(1).text().trim().split(' ')[1]} - ${$el
                    .children()
                    .eq(2)
                    .text()
                    .trim()} - ${
                    $el.children().eq(1).text().trim().split(' ')[0]
                } - ${$el.children().eq(1).text().trim().split(' ')[2]} `
            );
        });

        return translationsArr;
    } catch (error) {
        console.error('Error fetching data : ', error);
        return [];
    }
}

export async function anki(action, params = {}) {
    const res = await fetch(ankiUrl, {
        method: 'POST',
        body: JSON.stringify({ action, version: 6, params }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json.result;
}

async function fetchDeckWordsContainingKanji(kanji, deckName) {
    // 1) Get candidate notes (restricted to the deck)
    const noteIds = await anki('findNotes', {
        query: `deck:${deckName} word:*${kanji}*`, //${kanji}
    });

    // 2) Pull fields
    const notes = await anki('notesInfo', { notes: noteIds });

    return notes.map((e) => {
        const word = e.fields.word.value.replace(
            kanji,
            chalk.underline.bold.greenBright(kanji)
        );
        const reading = chalk.bold(e.fields.reading.value);
        const traduction = chalk.bold.blueBright(e.fields.traduction.value);
        return { word, reading, traduction };
    });
}

function extractKanjis(word) {
    let kanjis = [];
    for (let ch of word) {
        if (isKanji(ch)) {
            kanjis.push(ch);
        }
    }
    return kanjis;
}

export async function ankiJap(usrInput, channel_name) {
    let kanjiList = extractKanjis(usrInput);
    let deckWordsByKanji = {};

    if (kanjiList.length > 0) {
        const results = await Promise.all(
            kanjiList.map((kanji) =>
                fetchDeckWordsContainingKanji(kanji, channel_name).then(
                    (res) => [kanji, res]
                )
            )
        );

        for (const [kanji, deckWordsContainingKanji] of results) {
            deckWordsByKanji[kanji] = deckWordsContainingKanji;
        }

        for (const kanji in deckWordsByKanji) {
            deckWordsByKanji[kanji].map((e) => {
                console.log(`(${e.reading}) - ${e.word} - ${e.traduction}`);
            });

            // deckWordsByKanji[kanji].map((e) => {
            //     console.log(`\n(${e.reading}) - ${e.word} - ${e.traduction}`);
            // });
        }
    }

    // translation Array
    const stopSpinner = startSpinner(usrInput);
    let trArr = await fetchTranslationsArr(usrInput);
    stopSpinner();

    // word cards to go on Anki.
    let ankiCard = {};

    if (trArr.length > 0) {
        // console.clear(); // clear log
        let translationObject = await inquireJapaneseTranslation(trArr);
        Object.assign(ankiCard, translationObject);
    }

    ankiCard.composition = await getJapaneseWordComposition(ankiCard.word);

    // ankiCard.composition = `Peux-tu me donner une explication de la composition du mot ${ankiCard.word} selon le format suivant :
    //                 ✅ [kanji 1] = [sens simple en français]
    //                 ✅ [kanji 2] = [sens simple en français]
    //                 🔁 [${ankiCard.word}] = [interprétation intuitive du mot, en une phrase courte en français]
    //                 🎥 Astuce mnémotechnique :
    //             Ne donne rien d’autre.`;

    return ankiCard;
}
