import axios from "axios";
import { getIPAs, getPronunciation, getTypes } from "./api.js";
import cheerio from "cheerio";

export async function fetchThesaurusBodyResponse(object) {
    try {
        const body = await axios.get(
            `https://www.thesaurus.com/browse/${object.word}`
        );
        let $ = cheerio.load(body.data);
        let definitions = [];

        if (object.type) {
            $(".postab-container ul li a em")
                .toArray()
                .map((e, i) => {
                    definitions[i] = $(e)
                        .text()
                        .trim()
                        .replace(".", "")
                        .replace("as in", object.type);
                });

            $(".postab-container ul li a strong") // definitions
                .toArray()
                .map((e, i) => {
                    definitions[i] +=
                        " | " + $(e).text().trim().replaceAll(";", ",");
                });

            object["definitions"] = definitions;
        }
        return object;
    } catch (error) {
        return object;
    }
}

export async function fetchDictionaryBodyResponse(object) {
    try {
        const body = await axios.get(
            `https://www.dictionary.com/browse/${object.word}`
        );

        object["ipa"] = getIPAs(body);
        object["type"] = getTypes(object.word, body);
        object["pronunciation"] = getPronunciation(body);

        return object;
    } catch (error) {
        return object;
    }
}
