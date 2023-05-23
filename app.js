import { mainScrape } from "./utility/scrapeFuncs.js";
import { logWordContent } from "./utility/log.js";
import {
    askWhatWordToEnter,
    whichExample,
    whichDefinition,
    whichTranslation,
} from "./prompt.js";

import { addCard } from "./anki.js";

const log = console.log;
let UserInputSearched = false;

while (true && UserInputSearched === false) {
    console.log("\n");
    let input;
    if (process.argv.length <= 2) {
        input = await askWhatWordToEnter();
    } else {
        input = process.argv.slice(2).join(" ").toLowerCase().trim();
        UserInputSearched = true;
    }

    if (input.length > 0) {
        let { word, ipa, pronunciation, definitions, translations, examples } =
            await mainScrape(input);

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
            examples.length > 0
                ? await whichExample(word, examples)
                : examples[0];

        // TRANSLATION
        let translation = await whichTranslation(translations);

        // ADD ANKI CARD
        await addCard(word, typ, pronunciation, ipa, def, example, translation);
    } else {
        log("No input");
        break;
    }
}
