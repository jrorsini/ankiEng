import cheerio from "cheerio";
import Reverso from "reverso-api";
import isPhrasalVerb from "./isPhrasalVerb.js";
import {
    fetchDictionaryBodyResponse,
    fetchThesaurusBodyResponse,
} from "./fetchBodyRes.js";

const reverso = new Reverso();

export async function mainScrape(userInput) {
    let res = { word: userInput };
    res = await fetchDictionaryBodyResponse(res);
    res = await fetchThesaurusBodyResponse(res);
    res = await getSynonyms(res);
    res = await getTranslations(res);
    res = await getExamples(res);

    return res;
}

export function getWord(body) {
    // arg: dictionary.com html body from fetchDictionaryBodyResponse.
    let $ = cheerio.load(body.data);
    const word = $("#top-definitions-section").find("h1").text().trim();

    return word;
}

export async function getSynonyms(object) {
    let res;
    try {
        res = await reverso.getSynonyms(object.word, "english");
        object["synonyms"] = res.synonyms.map((e) => e.synonym);
        return object;
    } catch (err) {
        return object;
    }
}

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

export async function getTranslations(object) {
    try {
        let res = await reverso.getTranslation(
            object.word,
            "english",
            "french"
        );
        let translations = res.translations.filter(
            (e) => e.toLowerCase() !== object.word
        );
        object["translations"] = [...new Set(translations)];
        return object;
    } catch (err) {
        return object;
    }
}

export async function getExamples(object) {
    try {
        let res = await reverso.getContext(object.word, "english", "french");
        object["examples"] = res.examples
            .sort((a, b) => a.source.length - b.source.length)
            .map((e) => ({ en: e.source, fr: e.target }));
        return object;
    } catch (err) {
        return object;
    }
}
