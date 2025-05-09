import axios from 'axios';

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = 'http://127.0.0.1:8765';

let deckName = '1 - JAPANESE';

// adding function for word cards
export async function addWordCard(note_fields) {
    let note = {
        deckName,
        modelName: 'CUSTOM_NOTE_ANKIJAP_NEW',
        fields: note_fields,
        options: { allowDuplicate: false },
    };

    const res = await axios.post(ankiUrl, {
        action: 'addNote',
        version: 6,
        params: { note },
    });

    try {
        const res = await axios.post(ankiUrl, {
            action: 'addNote',
            version: 6,
            params: {
                note,
            },
        });
        console.log(`${note_fields.word} card added successfully!`);
        return;
    } catch (err) {
        console.log(err.code);
    }
}
