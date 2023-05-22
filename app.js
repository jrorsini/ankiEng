import { mainScrape } from "./utility/scrapeFuncs.js";
import { logWordContent } from "./utility/log.js";
import {
    askWhatWordToEnter,
    whichIPA,
    whichExample,
    whichDefinition,
    whichSpelling,
    whichTranslation,
    askIfUserWantExamples,
} from "./prompt.js";

import { addCard } from "./anki.js";

const log = console.log;

while (true) {
    console.log("\n");
    let word;
    if (process.argv.length <= 2) {
        word = await askWhatWordToEnter();
    } else {
        word = process.argv.slice(2).join(" ").toLowerCase().trim();
    }

    if (word.length > 0) {
        let {
            userInput,
            ipa,
            pronunciation,
            definitions,
            translations,
            examples,
        } = await mainScrape(word);

        logWordContent(
            userInput,
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
        let example;
        if (examples.length > 0) {
            // logWordContent(examples);
            if (await askIfUserWantExamples()) {
                example =
                    examples.length > 1
                        ? await whichExample(examples)
                        : examples[0];
            }
        }

        // TRANSLATION
        let translation = await whichTranslation(translations);

        // ADD CARD
        await addCard(userInput, typ, spelling, ipa, def, example, translation);
    } else {
        log("No input");
        break;
    }
}
