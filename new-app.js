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
import {
    getWordReferenceSynonyms,
    getWordReferenceDefinitions,
} from './src/getWordReferenceSynonyms.js';

import natural from 'natural';

import getWRefData from './src/getWRefData.js';
// prompt questions.
import {
    chooseTranslation,
    chooseDefinition,
    chooseTranslationType,
} from './prompt.js';

import { startSpinner } from './utils/cli-loader.js';

import { addCard } from './anki.js';
import chalk from 'chalk';

// clear log.
console.clear();

// retrieve user input from terminal
const usrInput = process.argv
    .slice(2)
    .join(' ')
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z\-]/gi, '');

// create Anki note object.
let ankiEngNote = { word: usrInput };

// DATA FETCH

function getClosestMatchingWord(wordToMatch, sentence) {
    const wordsInSentence = sentence.split(' ');

    let closestMatch = null;
    let minDistance = Infinity;

    wordsInSentence.forEach((word) => {
        const distance = natural.LevenshteinDistance(wordToMatch, word);
        if (distance < minDistance) {
            minDistance = distance;
            closestMatch = word;
        }
    });

    return closestMatch;
}

// let synonyms = await getThesaurusSynonyms(usrInput);
let synonyms = await getWordReferenceSynonyms(usrInput);
let definitions = await getWordReferenceDefinitions(usrInput);
let translations = await getWRefData(usrInput);

function searchResultLogTranslations(translations) {
    let ordredTranslations = translations.sort((a, b) =>
        a.fromType.localeCompare(b.fromType)
    );

    ordredTranslations.map((e) => {
        console.log(
            `${chalk.red(`${e.fromType}`)} ${chalk.red.bold(
                e.from
            )}・${chalk.cyan(`${e.toType}`)} ${chalk.cyan.bold(e.to)}`
        );

        if (e.example.from) {
            const en_match = getClosestMatchingWord(e.from, e.example.from);

            console.log(
                `\t${e.example.from.replace(
                    en_match,
                    chalk.bold.underline.italic.red(en_match)
                )}`
            );
        }

        if (e.example.to) {
            const fr_match = getClosestMatchingWord(e.to, e.example.to);

            console.log(
                `\t${e.example.to.replace(
                    fr_match,
                    chalk.bold.underline.italic.cyan(fr_match)
                )}`
            );
        }
    });
}

function searchResultLogDefinitions(definitions) {
    for (let wordType in definitions) {
        console.log(`${chalk.red.underline(wordType)}`);
        definitions[wordType].map((d) => console.log(`・${d}`));
    }
}
console.log(`${usrInput}`);
console.log('');
searchResultLogTranslations(translations);
console.log('');
searchResultLogDefinitions(definitions);

console.log(synonyms);

function terminalLog(word) {
    console.log(
        chalk.yellow(`
        ----- WORDREFERENCE -------------------------------------------------
    `)
    );

    console.log(
        chalk.yellow(`
        ----- SYNONYMS ------------------------------------------------------
    `)
    );
    console.log(synonyms);
}

// terminalLog(usrInput);
