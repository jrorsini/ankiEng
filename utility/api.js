import Reverso from "reverso-api";
import axios from "axios";
import chalk from "chalk";
import { getClosestMatchingWord } from "./log.js";

const reverso = new Reverso();

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
        console.log(
            chalk.red(
                `no translations found for ${chalk.bold.underline(this.word)}`
            )
        );
    }
}

export async function getReversoTranslations(input) {
    try {
        let res = await reverso.getTranslation(input, "english", "french");
        return { ...this, translations: [...new Set(res.translations)] };
    } catch (err) {
        return false;
    }
}

function lengthDifference(word1, word2) {
    return Math.abs(word1.length - word2.length);
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
        return false;
    }
}
