import axios from 'axios';

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = 'http://127.0.0.1:8765';

/*
- word
- ipa
- example_en
- example_fr
- translation
- type
*/

export async function addCard(deck) {
    let note = {
        deckName: deck,
        modelName: 'ANKIENG_NOTE_NEW',
        fields: this,
        options: {
            allowDuplicate: false,
        },
    };
    try {
        const res = await axios.post(ankiUrl, {
            action: 'addNote',
            version: 6,
            params: {
                note,
            },
        });
        return res.data;
    } catch (err) {
        console.log(err);
    }
}
