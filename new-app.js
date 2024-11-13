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
import { getWRefData } from './utils/new-api.js';
import getThesaurusSynonyms from './src/getThesaurusSynonyms.js';
import { logSearchResults } from './utils/searchResultslogs.js';
import getWordReferenceSynonyms from './src/getWordReferenceSynonyms.js';
// prompt questions.
import {
    chooseTranslation,
    chooseDefinition,
    chooseTranslationType,
} from './prompt.js';

import { startSpinner } from './utils/cli-loader.js';

import { addCard } from './anki.js';
import getWordIPA from './src/getWordIPA.js';
import chalk from 'chalk';

// clear log.
console.clear();

// retrieve user input from terminal
const usrInput = process.argv.slice(2).join(' ').toLowerCase().trim();

// create Anki note object.
let ankiEngNote = { word: usrInput };

// DATA FETCH

// get wordreference.com's & dictionary.com's data
ankiEngNote = await getWRefData(usrInput);
let ipa = await getWordIPA(usrInput);
let getWordAndSynonymNuanceDiff = '';

console.log(
    chalk.yellow(`
        =====================================================================
        ----- IPA -----------------------------------------------------------
        =====================================================================
    `)
);

console.log(`\t${ipa}`);

console.log(
    chalk.yellow(`
        =====================================================================
        ----- WORDREFERENCE -------------------------------------------------
        =====================================================================
    `)
);
console.log(ankiEngNote);

console.log(
    chalk.yellow(`
        =====================================================================
        ----- SYNONYMS ------------------------------------------------------
        =====================================================================
    `)
);

let synonyms = await getWordReferenceSynonyms(usrInput);

// console.log(synonyms);
