import cheerio from "cheerio";
import Reverso from "reverso-api";
import isPhrasalVerb from "./isPhrasalVerb.js";
import {
    fetchDictionaryBodyResponse,
    fetchThesaurusBodyResponse,
} from "./fetchBodyRes.js";
import axios from "axios";

const reverso = new Reverso();

export function getWord(body) {
    // arg: dictionary.com html body from fetchDictionaryBodyResponse.
    let $ = cheerio.load(body.data);
    const word = $("#top-definitions-section").find("h1").text().trim();

    return word;
}

export function getIPAs(body) {
    // arg: dictionary.com html body from fetchDictionaryBodyResponse.
    let $ = cheerio.load(body.data);
    const ipaContainer = $(`data-type="pronunciation-text"`);
    console.log(ipaContainer.text());
    console.log("hello");
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

    // console.log(ipa);
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

export async function getSynonyms() {
    let res;
    try {
        res = await reverso.getSynonyms(this.word, "english");
        this["synonyms"] = res.synonyms.map((e) => e.synonym);
        return this;
    } catch (err) {
        return this;
    }
}

export async function getTranslations() {
    try {
        let res = await reverso.getTranslation(this.word, "english", "french");
        let translations = res.translations.filter(
            (e) => e.toLowerCase() !== this.word
        );
        let examples = [];

        let linguee_translations_res = await axios.get(
            `https://linguee-api.fly.dev/api/v2/translations`,
            {
                params: { query: this.word, src: "en", dst: "fr" },
            }
        );

        linguee_translations_res.data.map((e) => ({
            text: e.text,
            pos: e.pos,
            translations: e.translations
                .filter((e) => e.featured)
                .map((tr) => {
                    translations.push(`${tr.text}`);
                    return {
                        text: tr.text,
                        pos: tr.pos,
                        examples: tr.examples.map((ex) => {
                            examples.push({ en: ex.src, fr: ex.dst });
                            return ex;
                        }),
                    };
                }),
        }));
        this["examples"] = examples;
        this["translations"] = [...new Set(translations)];
        return this;
    } catch (err) {
        return this;
    }
}

export async function getExamples() {
    try {
        let res = await reverso.getContext(this.word, "english", "french");
        const examples = res.examples
            .sort((a, b) => a.source.length - b.source.length)
            .map((e) => ({ en: e.source, fr: e.target }));
        this["examples"] = this["examples"].concat(examples);
        return this;
    } catch (err) {
        return this;
    }
}

export async function getDictionaryContent() {
    try {
        const res = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`
        );
        if (res.data[0].phonetic) {
            this.ipa = res.data[0].phonetic.replace(/[/()[\]]/g, "").trim();
        }
        // const defArr = [];
        // res.data[0].meanings
        //     .filter((e) => e.definitions.length > 0)
        //     .map((el) => ({
        //         partOfSpeech: el.partOfSpeech,
        //         definitions: el.definitions
        //             .filter((e) => e.hasOwnProperty("example"))
        //             .map((e) =>
        //                 defArr.push({
        //                     type: el.partOfSpeech,
        //                     definition: e.definition,
        //                     example: e.example,
        //                 })
        //             ),
        //     }))
        //     .filter((e) => e.definitions.length > 0);
        // this.definitions = defArr;
        return this;
    } catch (error) {
        return this;
    }
}
