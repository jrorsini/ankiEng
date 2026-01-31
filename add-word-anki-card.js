import axios from 'axios';
import chalk from 'chalk';
import isRomanChar from './utils/isRomanChar.js';

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = 'http://127.0.0.1:8765';

export default async function addWordCard(note) {
    try {
        const res = await axios.post(ankiUrl, {
            action: 'addNote',
            version: 6,
            params: { note },
        });
        console.log(res);

        console.log(
            chalk.green.bold(`${note.fields.word} card added successfully!`),
        );
        return;
    } catch (err) {
        console.log(chalk.red.bold(err.code));
    }
}

// export default async function addWordCard(fields, tags) {
//     let lang = isRomanChar(fields.word) ? 'ENGLISH' : 'JAPANESE';

//     console.log(tags[0]);

//     const tagToDeck = {
//         'Learn_Japanese_with_JapanesePod101.com':
//             'Learn_Japanese_with_JapanesePod101.com',
//         Bite_Size_Japanese: 'BiteSizeJapanese',
//         MAIの日本語Podcast: 'MAIの日本語Podcast',
//         "Ayano's_Japanese_Learning_Hub": 'Ayano_s_Japanese_Learning_Hub',
//         HINA_Japanese: 'HINA_Japanese',
//         Otsukare_Japanese: 'Otsukare_Japanese',
//         Imari_Japan: 'Imari_Japan',
//         Yosuke_Teaches_Japanese: 'Yosuke_Teaches_Japanese',
//     };

//     const deckName = tagToDeck[tags[0]] ?? `1 - ${lang}`;

//     const modelName = `CUSTOM_NOTE_${lang}`;

//     let note = {
//         deckName,
//         modelName,
//         fields,
//         tags,
//         options: { allowDuplicate: true },
//     };

//     try {
//         const res = await axios.post(ankiUrl, {
//             action: 'addNote',
//             version: 6,
//             params: { note },
//         });
//         console.log(res);

//         console.log(
//             chalk.green.bold(`${fields.word} card added successfully!`),
//         );
//         return;
//     } catch (err) {
//         console.log(chalk.red.bold(err.code));
//     }
// }
