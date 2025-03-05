import axios from 'axios';
import chalk from 'chalk';

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = 'http://127.0.0.1:8765';
// deck's name
const deckName = `0 🇺🇸 English`;

/*
- english
- ipa
- nuance
- context
- meaning
- translations
- visual
- extra
- type_from
- type_to
- example_en
- example_fr
- source_link
- source_thumbnail
*/

export async function addCard() {
    let note = {
        deckName,
        modelName: 'CUSTOM_NOTE_ANKIENG',
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
        if (!res.data.error) {
            console.log(
                `${chalk.underline.bold.yellow(
                    this.word.toUpperCase()
                )} HAS BEEN ADDED`
            );
        } else {
            console.log(`${chalk.bgRed.white(res.data.error.toUpperCase())}`);
        }
        return;
    } catch (err) {
        console.log(err);
    }
}
