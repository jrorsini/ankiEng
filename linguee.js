import axios from "axios";

console.clear();

const usrInput = process.argv.slice(2).join(" ").toLowerCase().trim();

console.log(`loading "${usrInput}"`);

const linguee_translations_res = await axios.get(
    `https://linguee-api.fly.dev/api/v2/translations`,
    {
        params: { query: usrInput, src: "en", dst: "fr" },
    }
);

const linguee_external_sources_res = await axios.get(
    `https://linguee-api.fly.dev/api/v2/external_sources`,
    {
        params: { query: usrInput, src: "en", dst: "fr" },
    }
);

const linguee_examples_res = await axios.get(
    `https://linguee-api.fly.dev/api/v2/examples`,
    {
        params: { query: usrInput, src: "en", dst: "fr" },
    }
);

const translations = [];
const examples = [];

const linguee_translations = linguee_translations_res.data.map((e) => ({
    text: e.text,
    pos: e.pos,
    translations: e.translations
        .filter((e) => e.featured)
        .map((tr) => {
            translations.push(`${e.pos} | ${tr.text}`);
            return {
                text: tr.text,
                pos: tr.pos,
                examples: tr.examples.map((ex) => {
                    examples.push(`${ex.src} | ${ex.dst}`);
                    return ex;
                }),
            };
        }),
}));

const linguee_external_sources = linguee_external_sources_res.data
    .map((e) => ({
        src: e.src,
        dst: e.dst,
    }))
    .sort((a, b) => a.src.length - b.src.length)
    .slice(0, 8);

const linguee_examples = linguee_examples_res.data.map((e) => ({
    text: e.text,
    translations: e.translations.map((e) => e.text).join(", "),
}));

console.clear();
console.log(translations);
console.log(examples);
// console.log(linguee_translations);
// console.log(linguee_examples);
// console.log(linguee_external_sources);
