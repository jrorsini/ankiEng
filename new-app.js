// API's handlers.
import { getWordReferenceTranslations } from './src/get-wordreference-data.js';

import { getTranslationFromReverso } from './src/reverso.js';

import { addAnkiEngCard } from './ankieng-card-handler.js';

import {
    chooseTranslationType,
    chooseTranslation,
    chooseReversoTranslation,
} from './prompt.js';

import { searchResultLogTranslations } from './src/search-results-logs.js';

import { startSpinner } from './utils/cli-loader.js';
import { ankiJap } from './ankiJap.js';

function isEnglish(text) {
    // Checks if the string contains any Roman characters (A-Z, a-z)
    return /[A-Za-z]/.test(text);
}

// clear log.
console.clear();

// retrieve user input from terminal
const usrInput = process.argv.slice(2).join(' ').toLowerCase().trim(); // .replaceAll(/[^a-z\-\s]/gi, '');

// check if input is english

if (isEnglish(usrInput)) {
    // starting spinner
    const stopSpinner = startSpinner(usrInput);

    // DATA FETCH
    let fetchedTranslations = await getWordReferenceTranslations(usrInput);
    let fetchedReversoTranslation = await getTranslationFromReverso(usrInput);

    stopSpinner();

    const note_fields = {
        english: '',
        ipa: '',
        pronunciation: '',
        audio: '',
        nuance: '',
        context: '',
        meaning: '',
        translations: '',
        visual: '',
        extra: '',
        type_from: '',
        type_to: '',
        example_en: '',
        example_fr: '',
        source_link: '',
        source_thumbnail: '',
    };

    if (fetchedTranslations.length > 0) {
        const translationType = await chooseTranslationType(
            fetchedTranslations
        );
        fetchedTranslations = fetchedTranslations.filter(
            (e) => e.fromType === translationType
        );
        searchResultLogTranslations(fetchedTranslations);
        let { from, fromType, toType, to, example } = await chooseTranslation(
            fetchedTranslations
        );
        console.log(example);

        note_fields.english = from;
        note_fields.translations = to;
        note_fields.type_from = fromType;
        note_fields.type_to = toType;
        note_fields.example_en = example.from;
        note_fields.example_fr = example.to;
    }
    const reversoTranslation = await chooseReversoTranslation(
        fetchedReversoTranslation
    );

    note_fields.translations += `, ${reversoTranslation}`;
    console.log(reversoTranslation);
    await addAnkiEngCard(note_fields);
} else {
    await ankiJap(usrInput);
}
