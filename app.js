import { mainScrape } from "./utility/scrapeFuncs.js";
import { logWordContent } from "./utility/log.js";
import { exec } from "child_process";
import {
    askWhatWordToEnter,
    whichExample,
    whichDefinition,
    whichTranslation,
} from "./prompt.js";

import axios from "axios";
import { addCard } from "./anki.js";

console.clear();

const ankiEngNote = await mainScrape(
    process.argv.slice(2).join(" ").toLowerCase().trim()
);

const res = await axios.get(
    "https://api.dictionaryapi.dev/api/v2/entries/en/hello"
);

console.log(res.data);

// console.log(ankiEngNote);
logWordContent(ankiEngNote);

/*

 logWordContent(
        word,
        ipa,
        pronunciation,
        definitions,
        translations,
        examples
    );

    // DEFINITION
    let { typ, def } =
        definitions.length > 1
            ? await whichDefinition(definitions)
            : definitions[0] || definitions;

    // EXAMPLE
    let example =
        examples.length > 0 ? await whichExample(word, examples) : examples[0];

    // TRANSLATION
    let translation = await whichTranslation(translations);

    // ADD ANKI CARD
    await addCard(word, typ, pronunciation, ipa, def, example, translation);

*/
