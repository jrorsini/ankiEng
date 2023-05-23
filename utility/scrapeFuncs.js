import Reverso from "reverso-api";
import axios from "axios";
import cheerio from "cheerio";
import isPhrasalVerb from "./isPhrasalVerb.js";

const reverso = new Reverso();

export async function mainScrape(userInput) {
    let dictionaryRes;
    let thesaurusRes;
    dictionaryRes = await fetchDictionaryBodyResponse(userInput);
    thesaurusRes = await fetchThesaurusBodyResponse(userInput);

    const word = dictionaryRes ? getWord(dictionaryRes) : false;
    const ipa = dictionaryRes ? getIPAs(dictionaryRes) : false;
    const types = dictionaryRes ? getTypes(userInput, dictionaryRes) : false;
    const pronunciation = dictionaryRes
        ? getPronunciation(dictionaryRes)
        : false;
    const definitions = thesaurusRes
        ? getDefinitions(thesaurusRes, types)
        : false;
    const translations = await getTranslations(userInput);
    const examples = await getExamples(userInput);

    const response = {
        word: "",
        ipa,
        pronunciation,
        type: "",
        definitions: "",
        translation: "",
        examples: "",
    };

    return {
        word,
        ipa,
        pronunciation,
        definitions,
        translations,
        examples,
    };
}

export const errorLogMessage = "Couldn't find what you're looking for...";

/**
 * retrieve body response from dictionary.com
 * @param {String} word - word to search on dictionary.com
 * @returns {String} html body response scraped from dictionary.com
 */
export async function fetchDictionaryBodyResponse(word) {
    try {
        return await axios.get(`https://www.dictionary.com/browse/${word}`);
    } catch (error) {
        if (error.response) {
            console.log(
                `"${word}" ` + "Dictionary Status:",
                error.response.status
            );
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
 *
 * @param {String} word to search synonyms for
 * @returns {Array} synonyms
 */
export async function getSynonyms(word) {
    let response;
    try {
        response = await reverso.getSynonyms(word, "english");
    } catch (err) {
        console.log(err);
    }

    return response.synonyms.map((e) => e.synonym);
}

/**
 * retrieve body response from thesaurus.com
 * @param {String} word - word to search on thesaurus.com
 * @returns {String} html body response scraped from thesaurus.com
 */
export async function fetchThesaurusBodyResponse(word) {
    try {
        return await axios.get(`https://www.thesaurus.com/browse/${word}`);
    } catch (error) {
        if (error.response) {
            console.log(
                `"${word}" ` + "Thesaurus Status:",
                error.response.status
            ); // console.log("Data:", error.response.data);
        } else if (error.request) {
            console.log("Request:", error.request);
        } else {
            console.log("Error:", error.message);
        }
        return false;
    }
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
            return response;
        }
    );

    return res;
}

/**
 * retrieve body response from thesaurus.com
 * @param {String} body - word to search on thesaurus.com
 * @param {Array} types - types from dictionary.com
 * @returns {String} html body response scraped from thesaurus.com
 */
export function getDefinitions(body, type) {
    let $ = cheerio.load(body.data);

    let definitions = [];

    // check if there isn't a case in which two word type are retrieved
    if (type) {
        $(".postab-container ul li a em")
            .toArray()
            .map((e, i) => {
                definitions[i] = $(e)
                    .text()
                    .trim()
                    .replace(".", "")
                    .replace("as in", type);
            });

        $(".postab-container ul li a strong") // definitions
            .toArray()
            .map((e, i) => {
                definitions[i] +=
                    " | " + $(e).text().trim().replaceAll(";", ",");
            });
        return definitions;
    }
    return false;
}

/**
 * obtain original word form
 * @param {String} body - dictionary.com html body from fetchDictionaryBodyResponse.
 * @returns {String} List of IPAs
 */
export function getWord(body) {
    // arg: dictionary.com html body from fetchDictionaryBodyResponse.
    let $ = cheerio.load(body.data);
    const word = $("#top-definitions-section").find("h1").text().trim();

    return word;
}

/**
 * List IPAs
 * @param {String} body - dictionary.com html body from fetchDictionaryBodyResponse.
 * @returns {Array} List of IPAs
 */
export function getIPAs(body) {
    // arg: dictionary.com html body from fetchDictionaryBodyResponse.
    let $ = cheerio.load(body.data);
    const ipaContainer = $(".pron-spell-ipa-container").find(
        ".pron-ipa-content"
    );

    const ipa =
        ipaContainer.length === 1
            ? [
                  ipaContainer
                      .text()
                      .replace(/[/()[\]]/g, "")
                      .trim(),
              ][0]
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
              ][0];

    return ipa.split(", ")[0];
}

/**
 * List Spellings
 * @param {String} body - dictionary.com html body from fetchDictionaryBodyResponse.
 * @returns {Array} List of Spellings
 */
export function getPronunciation(body) {
    let $ = cheerio.load(body.data);
    const spellingContainer = $(
        ".pron-spell-ipa-container .pron-spell-container"
    ).find(".pron-spell-content");

    let pronunciation =
        spellingContainer.length === 1
            ? [spellingContainer.text().replace(/\[|\]/g, "").trim()]
            : [
                  ...new Set(
                      spellingContainer
                          .toArray()
                          .map((e) => $(e).text().replace(/\[|\]/g, "").trim())
                  ),
              ];
    return pronunciation.length > 0 ? pronunciation[0].split(", ")[0] : ""; //;
}

/**
 * List Types
 * @param {String} word - word searched
 * @param {String} body - dictionary.com html body from fetchDictionaryBodyResponse.
 * @returns {Array} List of Types
 */
export function getTypes(word, body) {
    let $ = cheerio.load(body.data);
    const types = isPhrasalVerb(word)
        ? "phrasal verb"
        : $("section.serp-nav-button")
              .next()
              .find("span.luna-pos")
              .toArray()
              .map((e) =>
                  $(e)
                      .text()
                      // avoid a case like "reedy" in which we have this "adjective, reed·i·er, reed·i·est."
                      .replaceAll(",", "")
                      .trim()
                      .replace("adjective", "adj")
              )
              .toString()
              .split(",")[0]
              .split(" ")[0];
    return types;
}

/**
 * Get translations from Reverso API
 * @param {String} word - response from Reverso
 * @returns {Array}  Translations
 */
export async function getTranslations(word) {
    try {
        let res = await reverso.getTranslation(word, "english", "french");
        let translations = res.translations.filter(
            (e) => e.toLowerCase() !== word
        );
        return [...new Set(translations)];
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Get examples from Reverso API
 * @param {String} word - word to search in Reverso API
 * @returns {Array}  Examples
 */
export async function getExamples(word) {
    try {
        let res = await reverso.getContext(word, "english", "french");
        return res.examples;
    } catch (err) {
        console.log(err);
        return fasle;
    }
}
