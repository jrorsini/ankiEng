export function formatWordReferenceSynonyms(content) {
    let res = {};

    content.map((e) => {
        let split = e.split(/Synonyms:/gi);
        let synonymHeader = split[0].slice(7).split(/\:\s/gi);
        if (!synonymHeader) return false;
        let wordType = synonymHeader.length > 1 ? synonymHeader[0] : '';
        let wordMeaning =
            synonymHeader.length > 1 ? synonymHeader[1] : synonymHeader[0];
        let synonyms = split[1].split(/Antonyms:/gi)[0].split(', ');

        if (res.hasOwnProperty(wordType)) {
            res[wordType].push({ meaning: wordMeaning, synonyms });
        } else {
            res[wordType] = [{ meaning: wordMeaning, synonyms }];
        }
    });

    return res;
}

export function formatWordReferenceTranslations(WordReferenceRes) {
    const arr = WordReferenceRes.translations.map((e) => e.translations);
    return [].concat(...arr.map((inArr) => [].concat(...inArr))).map((e) => ({
        ...e,
        from: e.from.trim().replaceAll('⇒', ''),
        to: e.to.trim().replaceAll('⇒', ''),
        example: {
            from: e.example.from.length > 0 ? e.example.from[0] : '',
            to: e.example.to.length > 0 ? e.example.to[0] : '',
        },
    }));
}

export function formatWordReferenceDefinitions(content) {
    let FormattedContent = {};

    content.map((e) => {
        let wordType = e['type'].replaceAll('.', '');

        if (FormattedContent.hasOwnProperty(wordType)) {
            FormattedContent[wordType].push(e['meaning']);
        } else {
            FormattedContent[wordType] = [e['meaning']];
        }
    });

    return FormattedContent;
}
