import Reverso from "reverso-api";
import axios from "axios";
import cheerio from "cheerio";
import isPhrasalVerb from "./isPhrasalVerb.js";
import chalk from "chalk";

const reverso = new Reverso();

export const errorLogMessage = "Couldn't find what you're looking for...";

/**
 * retrieve body response from dictionary.com
 * @param {String} word - word to search on dictionary.com
 * @returns {String} html body response scraped from dictionary.com
 */
export async function fetchDictionaryBodyResponse(word) {
    // return axios.get(`https://www.dictionary.com/browse/${word}`);

    try {
        const response = await axios.get(
            `https://www.dictionary.com/browse/${word}`
        );
    } catch (error) {
        if (error.response) {
            console.log("Status:", error.response.status);
            // console.log("Data:", error.response.data);
        } else if (error.request) {
            console.log("Request:", error.request);
        } else {
            console.log("Error:", error.message);
        }
        return false;
    }
}

/**
 * retrieve body response from thesaurus.com
 * @param {String} word - word to search on thesaurus.com
 * @returns {String} html body response scraped from thesaurus.com
 */
export async function fetchThesaurusBodyResponse(word) {
    let body = await axios.get(`https://www.thesaurus.com/browse/${word}`);
    return body;
}

/**
 * retrieve  response from Reverso API
 * @param {String} word - response from Reverso
 * @returns {Object} response from Reverso API
 */
export async function fetchReversoResponse(word) {
    let res = await reverso.getTranslation(
        word,
        "english",
        "french",
        (err, response) => {
            if (err) throw new Error(err.message);

            // console.log(response);
            return response;
        }
    );

    return res;
}

/**
 * log the entire content of the searched word
 * @param {String} userInput - to log
 * @param {Array} ipas - to log
 * @param {Array} spellings - to log
 * @param {Array} definitions - to log
 * @param {Array} translations - to log
 * @param {Array} examples - to log
 */
export function logWordContent(
    userInput,
    ipas,
    spellings,
    definitions,
    translations,
    examples
) {
    const log = console.log;

    log("\n\t\t" + chalk.yellow.bold.underline(`WORD:`) + ` ${userInput}\n`);

    if (ipas !== "")
        log(
            "\n\t" +
                chalk.yellow.bold.underline(`IPA:`) +
                ` ${ipas.join(" | ")}` +
                "   |   " +
                chalk.yellow.bold.underline(`SPELLING:`) +
                ` ${spellings.join(" | ")}\n`
        );

    definitions.map((e) => {
        log(
            "\t" +
                chalk.yellow.inverse(` ${e.split(" | ")[0].toUpperCase()}: `) +
                chalk.yellow.bold(` ${e.split(" | ")[1]}`)
        );
    });
    log(
        "\n\t" +
            chalk.cyan.bold(
                `${translations
                    .map((line, index) =>
                        (index + 1) % 4 === 0 ? line + "\n\t" : line + " - "
                    )
                    .join("")
                    .slice(0, -2)}`
            ) +
            "\n"
    );

    examples.map((e) => {
        const sourceOffset = e.source_phrases[0].offset;
        const sourceLength = e.source_phrases[0].length;
        const sourcePhrase = e.source_phrases[0].phrase;

        const targetOffset = e.target_phrases[0].offset;
        const targetLength = e.target_phrases[0].length;
        const targetPhrase = e.target_phrases[0].phrase;
        log(
            `\t${e.source.slice(0, sourceOffset)}` +
                chalk.red.bold.underline(sourcePhrase) +
                `${e.source.slice(
                    sourceOffset + sourceLength,
                    e.source.length
                )}\n\t${e.target.slice(0, targetOffset)}` +
                chalk.cyan.bold.underline(targetPhrase) +
                `${e.target.slice(
                    targetOffset + targetLength,
                    e.target.length
                )}\n`
        );
    });
}

/**
 * retrieve body response from thesaurus.com
 * @param {String} body - word to search on thesaurus.com
 * @param {Array} types - types from dictionary.com
 * @returns {String} html body response scraped from thesaurus.com
 */
export function fetchDefinitions(body, types) {
    let $ = cheerio.load(body.data);

    let definitions = [];

    $(".postab-container ul li a em")
        .toArray()
        .map((e, i) => {
            definitions[i] = $(e)
                .text()
                .trim()
                .replace(".", "")
                .replace("as in", types[0]);
        });

    $(".postab-container ul li a strong") // definitions
        .toArray()
        .map((e, i) => {
            definitions[i] += " | " + $(e).text().trim().replaceAll(";", ",");
        });

    return definitions;
}

/**
 * List IPAs
 * @param {String} body - dictionary.com html body from fetchDictionaryBodyResponse.
 * @returns {Array} List of IPAs
 */
export function fetchIPAs(body) {
    // arg: dictionary.com html body from fetchDictionaryBodyResponse.
    let $ = cheerio.load(body.data);
    const ipaContainer = $(".pron-spell-ipa-container").find(
        ".pron-ipa-content"
    );

    return ipaContainer.length === 1
        ? [
              ipaContainer
                  .text()
                  .replace(/[/()[\]]/g, "")
                  .trim(),
          ]
        : [
              ...new Set(
                  ipaContainer
                      .map((i, el) =>
                          $(el)
                              .text()
                              .replace(/[/()[\]]/g, "")
                              .trim()
                      )
                      .toArray()
              ),
          ];
}

/**
 * List Spellings
 * @param {String} body - dictionary.com html body from fetchDictionaryBodyResponse.
 * @returns {Array} List of Spellings
 */
export function fetchSpellings(body) {
    let $ = cheerio.load(body.data);
    const spellingContainer = $(
        ".pron-spell-ipa-container .pron-spell-container"
    ).find(".pron-spell-content");

    return spellingContainer.length === 1
        ? [spellingContainer.text().replace(/\[|\]/g, "").trim()]
        : [
              ...new Set(
                  spellingContainer
                      .toArray()
                      .map((e) => $(e).text().replace(/\[|\]/g, "").trim())
              ),
          ];
}

/**
 * List Types
 * @param {String} word - word searched
 * @param {String} body - dictionary.com html body from fetchDictionaryBodyResponse.
 * @returns {Array} List of Types
 */
export function fetchTypes(word, body) {
    let $ = cheerio.load(body.data);

    return isPhrasalVerb(word)
        ? ["phrasal verb"]
        : $("section.serp-nav-button")
              .next()
              .find("span.luna-pos")
              .toArray()
              .map((e) =>
                  $(e)
                      .text()
                      // avoid a case like "reedy" in which we have this "adjective, reed·i·er, reed·i·est."
                      .replace(",", "")
                      .trim()
                      .replace("adjective", "adj")
              );
}

/**
 * Get translations from Reverso API
 * @param {String} res - response from Reverso
 * @returns {Array}  Translations
 */
export function fetchTranslations(res) {
    return [...new Set(res.translations)];
}

/**
 * Get examples from Reverso API
 * @param {String} res - word to search in Reverso API
 * @returns {Array}  Examples
 */
export function fetchExamples(res) {
    // console.log(res);
    return res.context.examples;
}
