const types = {
    verb: ["v expr", "vi", "vtr", "vtr + adj", "vi + prép"],
    noun: ["n", "npl"],
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
    return types[typ].indexOf(tr.fromType) !== -1;
}

export function filterByDefinitionType(d, typ) {
    return d.split(" - ")[0].toLowerCase() === typ;
}

export function getTranslationsTypeList(translations) {
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
