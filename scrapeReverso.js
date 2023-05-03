import Reverso from "reverso-api";
import axios from "axios";
import cheerio from "cheerio";
import isPhrasalVerb from "./isPhrasalVerb.js";
const reverso = new Reverso();

/**
 * Get translations from Reverso API
 * @param {String} word - response from Reverso
 * @returns {Array}  Translations
 */
export async function fetchTranslations(word) {
    let res = await reverso.getTranslation(
        word,
        "english",
        "french",
        (err, response) => {
            if (err) throw new Error(err.message);
            return response;
        }
    );
    return res.translations;
}

/**
 * Get examples from Reverso API
 * @param {String} word - word to search in Reverso API
 * @returns {Array}  Examples
 */
export async function fetchExamples(word) {
    let res = await reverso.getContext(
        word,
        "english",
        "french",
        (err, response) => {
            if (err) throw new Error(err.message);

            return response;
        }
    );

    return res.examples;
}

/**
 * retrieve body response from dictionary.com
 * @param {String} word - word to search on dictionary.com
 * @returns {String} html body response scraped from dicitonary.com
 */
export async function fetchDictionaryBodyResponse(word) {
    let body;
    try {
        body = await axios.get(`https://www.dictionary.com/browse/${word}`);
    } catch (err) {
        console.log(err, err.stack);
    }
    return body;
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
 * List Spelling
 * @param {String} body - dictionary.com html body from fetchDictionaryBodyResponse.
 * @returns {Array} List of Spelling
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
                      .map((i, el) => $(el).text().replace(/\[|\]/g, "").trim())
                      .toArray()
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
              .map((el) =>
                  $(el)
                      .text()
                      // avoid a case like "reedy" in which we have this "adjective, reed·i·er, reed·i·est."
                      .replace(",", "")
                      .trim()
                      .replace("adjective", "adj")
              );
}
