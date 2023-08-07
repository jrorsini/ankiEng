import Reverso from "reverso-api";
import axios from "axios";
import chalk from "chalk";

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
        return this;
    } catch (error) {
        return this;
    }
}
//
