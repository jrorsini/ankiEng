// https://www.wordreference.com/english/abbreviationsWRD.aspx?dict=enfr&abbr=vi&src=WR

import Reverso from "reverso-api";
import axios from "axios";
import { getClosestMatchingWord } from "./log.js";
import wr from "wordreference-api";

const reverso = new Reverso();

export async function getWordReference() {
    try {
        let wrData = await wr(this.word, "en", "fr");
        const arr = wrData.translations.map((e) => e.translations);
        let translations = [].concat(
            ...arr.map((inArr) => [].concat(...inArr))
        );
        translations = translations
            // .filter((e) => e.example.from.length > 0 && e.example.to.length > 0)
            .map((e) => ({
                ...e,
                // from: e.from.replaceAll("⇒", ""),
                to: e.to.trim(),
                // example:
                //     e.example.from.length == 0 && e.example.to.length == 0
                //         ? ``
                //         : `${e.example.from} | ${e.example.to}`,
            }));

        console.log(`=============`);
        console.log(getTranslationsTypeList(translations));
        // console.log({ ...this, translations });
        return { ...this, translations };
    } catch (err) {
        return this;
    }
}

// tr is the translations
// typ is the desired typ
function isTranslationType(tr, typ) {
    const types = {
        verb: ["'v expr", "vi", "vtr", "vtr + adj"],
        noun: ["n", "npl"],
        adjective: ["adj"],
    };

    types[typ].indexOf(tr.fromType) !== -1;
}

function getTranslationsTypeList(translations) {
    // declare allTypes var.
    const types = {
        verb: ["'v expr", "vi", "vtr", "vtr + adj"],
        noun: ["n", "npl"],
        adjective: ["adj"],
    };

    // declare translations type list.
    let translationsTypeList = [];

    // look through each translations.
    translations.map((e) => {
        for (const key in types) {
            // if abbr matches
            types[key].indexOf(e.fromType) !== -1
                ? translationsTypeList.push(key)
                : "other";
        }
        return e;
    });

    return [...new Set(translationsTypeList)];
}

export async function getDictionary() {
    try {
        let dictionaryData = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`
        );

        this["ipa"] = [
            ...new Set(
                dictionaryData.data.map((e) =>
                    e.phonetic ? e.phonetic.replaceAll("/", "") : ""
                )
            ),
        ][0];

        const nestedArray = dictionaryData.data.map((d) =>
            d.meanings.map((m) => {
                return m.definitions
                    .map(
                        (e) =>
                            `${m.partOfSpeech.toUpperCase()} - ${e.definition}`
                    )
                    .sort((a, b) => a.length - b.length);
            })
        );

        this["definitions"] = []
            .concat(
                ...nestedArray.map((subArrays) =>
                    [].concat(
                        ...subArrays.map((innerArray) =>
                            [].concat(...innerArray)
                        )
                    )
                )
            )
            .sort((a, b) => a[0].localeCompare(b[0]));

        return this;
    } catch (err) {
        return this;
    }
}

export async function getLingueeData() {
    try {
        let linguee_data = await axios.get(
            `https://linguee-api.fly.dev/api/v2/translations`,
            {
                params: { query: this.word, src: "en", dst: "fr" },
            }
        );

        let translations = [];

        linguee_data.data
            .filter((e) => e.featured)
            .map((e) => {
                e.translations
                    .filter((e) => e.featured)
                    .map((e) => {
                        if (
                            e.hasOwnProperty("examples") &&
                            e.examples.length > 0
                        ) {
                            translations.push({
                                type: e.pos.startsWith("noun")
                                    ? "noun"
                                    : e.pos.startsWith("adjective")
                                    ? "adjv"
                                    : e.pos,
                                translation: e.text,
                                examples: e.examples.map((e) => ({
                                    en: e.src,
                                    fr: e.dst,
                                })),
                            });
                        }
                    });
            });

        this["translations"] = translations;
        return this;
    } catch (error) {
        console.clear();
        return { ...this, translations: [] };
    }
}

export async function getReversoTranslations(input) {
    try {
        let res = await reverso.getTranslation(input, "english", "french");
        return { ...this, translations: [...new Set(res.translations)] };
    } catch (err) {
        return this;
    }
}

export async function getReversoExamples(input) {
    try {
        let res = await reverso.getContext(input, "english", "french");
        let examples = res.examples.map((e) => ({
            en: e.source,
            fr: e.target,
        }));
        let data = { translations: [] };
        this.translations.map((e) => {
            let translation = {
                translation: e,
            };

            let matchingExamples = examples.filter((ex) => {
                return getClosestMatchingWord(e, ex.fr) === e;
            });
            if (matchingExamples.length > 0) {
                translation.examples = matchingExamples;
                data.translations.push(translation);
            }
        });
        return data;
    } catch (err) {
        return this;
    }
}

export function fuseReversoAndLinguee(ankiEngNote, reverso_data) {
    reverso_data.translations.map((e) => {
        if (
            ankiEngNote.translations.find(
                (tr) => tr.translation === e.translation
            ) === undefined
        ) {
            ankiEngNote.translations.push({ type: "", ...e });
        }
        return e;
    });

    return ankiEngNote;
}
