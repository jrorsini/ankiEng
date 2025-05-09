// API's handlers.
import { getWordReferenceTranslations } from './src/ankiEng_get-wordreference-data.js';

import { getTranslationFromReverso } from './src/reverso.js';

import { addAnkiEngCard } from './ankieng-card-handler.js';

import { exec } from 'child_process';

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
    // let fetchedReversoTranslation = await getTranslationFromReverso(usrInput);

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

    // https://www.youtube.com/embed/CxouIJKVpaw?playsinline=1&iv_load_policy=3&rel=0&showinfo=0&controls=1&fs=0&start=34&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fyouglish.com&widgetid=1&forigin=https%3A%2F%2Fyouglish.com%2Fpronounce%2F%25E4%25B8%25A1%25E5%259B%25BD%2Fjapanese&aoriginsup=1&vf=6

    // const reversoTranslation = await chooseReversoTranslation(
    //     fetchedReversoTranslation
    // );

    // note_fields.translations += `, ${reversoTranslation}`;
    // console.log(reversoTranslation);
    await addAnkiEngCard(note_fields);
} else {
    await ankiJap(usrInput);
    // exec('osascript -e \'tell application "iTerm" to close first window\'');
}
