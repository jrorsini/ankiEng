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

console.clear();
const data = [
    { id: 1, name: "John Doe", age: 30, email: "john@example.com" },
    { id: 2, name: "Jane Smith", age: 28, email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", age: 35, email: "bob@example.com" },
];

console.table(data);

console.log(translations);
console.log(examples);
