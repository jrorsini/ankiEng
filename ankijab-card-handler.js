import axios from 'axios';
import { tokenizer } from './tokenizer.js';
import { selectExample, selectTranslation } from './prompt.js';

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = 'http://127.0.0.1:8765';

let WdKanjiDeck = 'lang - 🇯🇵 ankiJap Word';

const note_fields = {
    word: '',
    romaji: '',
    reading: '',
    traduction: '',
    translation: '',
    definitions: '',
    audio: '',
    sample_jp: '',
    sample_tr: '',
    rude: '',
    img: '',
    memo_reading: '',
    source_link: '',
    source_thumbnail: '',
};

// adding function for word cards
export async function addWordCard(card) {
    let note = {
        deckName: 'lang - 🇯🇵 ankiJap Word',
        modelName: 'ANKIJAP_NOTE_WORD',
        fields: card,
        options: { allowDuplicate: false },
    };

    const res = await axios.post(ankiUrl, {
        action: 'addNote',
        version: 6,
        params: { note },
    });

    res.data.error == null &&
        console.log(`${card.word} card added successfully!`);
}
