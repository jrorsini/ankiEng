import axios from "axios";
import cheerio from "cheerio";
import inquirer from "inquirer";
import isPhrasalVerb from "./isPhrasalVerb.js";

async function scrapeWord(userInput) {
    // website's urls
    const dictionary_url = `https://www.dictionary.com/browse/${userInput}`;
    const thesaurus_url = `https://www.thesaurus.com/browse/${userInput}`;
    // body response
    let dictionary_response;
    try {
        dictionary_response = await axios.get(dictionary_url);
    } catch (error) {
        console.log("dictionary err");
        console.log(error);
    }

    let thesaurus_response;

    try {
        thesaurus_response = await axios.get(thesaurus_url);
    } catch (error) {
        console.log("thesaurus err");
        console.log(error);
    }

    // Dictionary.com
    let $ = cheerio.load(dictionary_response.data);
    const ipaContainer = $(".pron-spell-ipa-container .pron-ipa-container");
    const spellingContainer = $(
        ".pron-spell-ipa-container .pron-spell-container"
    );

    // Dictionary.com ipa
    let ipa = "";
    if (ipaContainer.length > 0) {
        const ipaContents = ipaContainer.find(".pron-ipa-content");
        if (ipaContents.length === 1) {
            ipa = ipaContents
                .text()
                .trim()
                .replace(/[/()[\]]/g, "");
        } else {
            const ipaChoices = ipaContents
                .map((i, el) =>
                    $(el)
                        .text()
                        .replace(/[/()[\]]/g, "")
                        .trim()
                )
                .toArray();
            let uniqueIpaChoices = [...new Set(ipaChoices)];

            if (uniqueIpaChoices.length > 1) {
                const answers = await inquirer.prompt([
                    {
                        type: "list",
                        name: "ipaChoice",
                        message: `Multiple pronunciations found. Choose one to use for "${userInput}":`,
                        choices: uniqueIpaChoices,
                    },
                ]);
                ipa = answers.ipaChoice.trim();
            } else {
                ipa = uniqueIpaChoices[0];
            }
        }
    }

    // Dictionary.com spelling
    let spelling = "";
    if (spellingContainer.length > 0) {
        const spellingContents = spellingContainer.find(".pron-spell-content");
        if (spellingContents.length === 1) {
            spelling = spellingContents.text().trim().replace(/\[|\]/g, "");
        } else {
            const spellingChoices = spellingContents
                .map((i, el) => $(el).text().replace(/\[|\]/g, "").trim())
                .toArray();
            let uniqueSpellingChoices = [...new Set(spellingChoices)];

            if (uniqueSpellingChoices.length > 1) {
                const answers = await inquirer.prompt([
                    {
                        type: "list",
                        name: "spellingChoice",
                        message: `Multiple spellings found. Choose one to use for "${userInput}":`,
                        choices: uniqueSpellingChoices,
                    },
                ]);
                spelling = answers.spellingChoice.trim();
            } else {
                spelling = uniqueSpellingChoices[0];
            }
        }
    }
    spelling = spelling.replace(/\s+/g, " ").trim();

    // Dictionary.com input type
    let userInputTypes;
    if (isPhrasalVerb(userInput)) {
        userInputTypes = ["phrasal verb"];
    } else {
        userInputTypes = $("section.serp-nav-button")
            .next()
            .find("span.luna-pos")
            .toArray()
            .map((elem) =>
                $(elem)
                    .text()
                    // avoid a case like "reedy" in which we have this "adjective, reed·i·er, reed·i·est."
                    .replace(",", "")
                    .trim()
            );

        if (userInputTypes[0] === "adjective") {
            userInputTypes[0] = "adj";
        }
    }

    // Thesaurus.com
    $ = cheerio.load(thesaurus_response.data);

    const definitionChoices = [];

    $(".postab-container ul li a em")
        .toArray()
        .map((el, i) => {
            definitionChoices[i] = $(el)
                .text()
                .trim()
                // replace "as in" with the first word type found since it most likely only has one.
                .replace("as in", userInputTypes[0])
                .replace(".", "");
        });

    $(".postab-container ul li a strong")
        .toArray()
        .map((el, i) => {
            definitionChoices[i] += " | " + $(el).text().trim();
        });

    let tab = "";
    let type = "";
    let definition = "";

    if (definitionChoices.length > 1) {
        const answers = await inquirer.prompt([
            {
                type: "list",
                name: "spellingChoice",
                message: `Multiple definitions found. Choose one to use for "${userInput}":`,
                choices: definitionChoices,
            },
        ]);
        tab = answers.spellingChoice.trim();

        type = answers.spellingChoice;
        definition = answers.spellingChoice;
    } else {
        type = definitionChoices[0];
        definition = definitionChoices[0];
    }
    type = type
        .trim()
        .split(" | ")[0]
        .replace("as in", "noun")
        .replace(".", "");
    definition = definition
        .trim()
        .split(" | ")[1]
        .replaceAll(";", " -")
        .replaceAll(",", " -");
    return { ipa, spelling, type, definition };
}

export default scrapeWord;
