// "astute" is a hard for me to guess. Maybe it'd be best if I had to go from french "perspicace"
// "tétine" is a word that I should study both ways
// "rougeurs", "driveway" needs a picture
// "guetteur, homme de guet" is not a word easy to guess for lookout, should probably content with getting the english word, even from sentence example.
// would be more convenient to have "remarquable" as a word to guess in english. More useful to use "standout" in english than guessing it.

/**
 * TO-DO-LIST
 *
 * Remove the definition field in Anki then also remove it from the app handlers.
 * The dictionary.com resource should be used only for IPA.
 * then change in the script to add a ruby row with the IPA in it.
 * form now on, only guess from word or context.
 */

/**
 * TO TEST
 * wunderking
 * oxpecker (undefined example)
 */

// API's handlers.
import { getDictData, getWRefData } from './utils/api.js';
import { logSearchResults } from './utils/searchResultsLogs.js';
// prompt questions.
import {
    chooseTranslation,
    chooseDefinition,
    chooseTranslationType,
} from './prompt.js';

import { startSpinner } from './utils/cli-loader.js';

import { addCard } from './ankieng-card-handler.js';

// clear log.
console.clear();

// retrieve user input from terminal
const wordInputed = process.argv.slice(2).join(' ').toLowerCase().trim();

// log user input loading
const stopSpinner = startSpinner(wordInputed);

// create Anki note object.
let ankiEngNote = { word: wordInputed };

const getWordData = async (params) => {};

// DATA FETCH

// get wordreference.com's & dictionary.com's data
ankiEngNote = await getWRefData.call(ankiEngNote);
ankiEngNote = await getDictData.call(ankiEngNote);
stopSpinner();
// PROMPT

// checks if translations were found then proceed to prompt or error log
if (ankiEngNote.translations.length > 0) {
    console.clear(); // clear log.

    ankiEngNote.fromTypes.length > 1
        ? (ankiEngNote = await chooseTranslationType.call(ankiEngNote))
        : delete ankiEngNote.fromTypes;

    // logs search results
    logSearchResults(ankiEngNote);

    console.log(`\n`);

    // choose which translation to keep
    ankiEngNote = await chooseTranslation.call(ankiEngNote);

    console.clear(); // clear log.

    // choose a definition to keep
    if (ankiEngNote.definitions) {
        ankiEngNote = await chooseDefinition.call(ankiEngNote);
    } else {
        ankiEngNote['definition'] = '';
        delete ankiEngNote.definitions;
    }

    ankiEngNote['word'] = ankiEngNote.from;

    ankiEngNote['translation'] = ankiEngNote.to;

    ankiEngNote['example_en'] = ankiEngNote.example.from
        ? ankiEngNote.example.from
        : '';

    ankiEngNote['example_fr'] = ankiEngNote.example.to
        ? ankiEngNote.example.to
        : '';

    delete ankiEngNote.from;
    delete ankiEngNote.example;
    delete ankiEngNote.to;
    ankiEngNote['display_ex-en'] = '1';

    console.clear(); // clear log.

    // save card in Anki.
    await addCard.call(ankiEngNote);
} else {
    console.clear();
}
