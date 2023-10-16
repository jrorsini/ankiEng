import axios from 'axios';

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = 'http://localhost:8765/';

/*
- word
- ipa
- example_en
- example_fr
- translation
- type
*/

export async function addCard(deck, noteType) {
    let note = {
        deckName: deck,
        modelName: noteType,
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
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}
