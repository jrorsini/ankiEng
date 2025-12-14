import axios from 'axios';
import chalk from 'chalk';
import isRomanChar from './utils/isRomanChar.js';

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = 'http://127.0.0.1:8765';

export default async function addWordCard(note_fields, note_tags) {
    let lang = isRomanChar(note_fields.word) ? 'ENGLISH' : 'JAPANESE';

    const tagToDeck = {
        'Learn_Japanese_with_JapanesePod101.com':
            'Learn_Japanese_with_JapanesePod101.com',
        Bite_Size_Japanese: 'BiteSizeJapanese',
        MAIの日本語Podcast: 'MAIの日本語Podcast',
        'Learn_Japanese_with_JapanesePod101.com':
            'Learn_Japanese_with_JapanesePod101.com',
    };

    let note = {
        deckName: tagToDeck[note_tags[0]] ?? `1 - ${lang}`,
        modelName: `CUSTOM_NOTE_${lang}`,
        fields: note_fields,
        tags: note_tags,
        options: { allowDuplicate: true },
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
