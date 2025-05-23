import axios from 'axios';
import chalk from 'chalk';

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = 'http://127.0.0.1:8765';

// adding function for word cards
export default async function addWordCard(note_fields, deckName, NoteType) {
    let note = {
        deckName,
        modelName: NoteType,
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
        console.log(
            chalk.green.bold(`${note_fields.word} card added successfully!`)
        );
        return;
    } catch (err) {
        console.log(chalk.red.bold(err.code));
    }
}
