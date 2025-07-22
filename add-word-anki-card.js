import axios from 'axios';
import chalk from 'chalk';
import isInputEnglish from './utils/isInputEnglish.js';

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = 'http://127.0.0.1:8765';

export default async function addWordCard(note_fields, note_tags) {
    let lang = isInputEnglish(note_fields.word) ? 'ENGLISH' : 'JAPANESE';

    let note = {
        deckName: `1 - ${lang}`,
        modelName: `CUSTOM_NOTE_${lang}`,
        fields: note_fields,
        tags: note_tags,
        options: { allowDuplicate: false },
    };

    try {
        const res = await axios.post(ankiUrl, {
            action: 'addNote',
            version: 6,
            params: { note },
        });
        console.log(
            chalk.green.bold(`${note_fields.word} card added successfully!`)
        );
        return;
    } catch (err) {
        console.log(chalk.red.bold(err.code));
    }
}
