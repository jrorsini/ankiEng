const types = {
    verb: [
        "v expr",
        "vi",
        "vtr",
        "vtr + adj",
        "vi + prép",
        "vi + prep",
        "vi phrasal",
        "vi phrasal + prep",
    ],
    noun: ["n", "npl", "n as adj"],
    adjective: ["adj"],
};
// tr is the translations
// typ is the desired typ

/**
 * Asks which Definition to choose
 * @param {Object} tr - translations object
 * @param {String} typ - desired translation type
 * @returns {String} the choosen Definition
 */
export function filterByTranslationType(tr, typ) {
    if (typ === "other") {
        return (
            [...types.verb, ...types.noun, ...types.adjective].indexOf(
                tr.fromType
            ) === -1
        );
    } else {
        return types[typ].indexOf(tr.fromType) !== -1;
    }
}

export function filterByDefinitionType(d, typ) {
    return d.split(" - ")[0].toLowerCase() === typ;
}

export function getTranslationsTypeList(translations) {
    // declare translations type list.
    let translationsTypeList = [];

    // look through each translations.
    translations.map((e) => {
        let foundType = false;

        for (const key in types) {
            // if abbr matches
            if (types[key].indexOf(e.fromType) !== -1) {
                translationsTypeList.push(key);
                foundType = true;
                break;
            }
        }
        !foundType && translationsTypeList.push("other");

        return e;
    });

    return [...new Set(translationsTypeList)];
}
