// https://www.wordreference.com/english/abbreviationsWRD.aspx?dict=enfr&abbr=vi&src=WR

import Reverso from 'reverso-api';
import axios from 'axios';
import { getClosestMatchingWord } from './searchResultslogs.js';
import wr from 'wordreference-api';
import { getTranslationsTypeList } from './translationTypes.js';

const reverso = new Reverso();

export async function getWRefData(word) {
    try {
        let wrData = await wr(word, 'en', 'fr');
        const arr = wrData.translations.map((e) => e.translations);
        let translations = [].concat(
            ...arr.map((inArr) => [].concat(...inArr))
        );
        translations = translations.map((e) => ({
            ...e,
            from: e.from.trim().replaceAll('⇒', ''),
            to: e.to.trim().replaceAll('⇒', ''),
            example: {
                from: e.example.from.length > 0 ? e.example.from[0] : '',
                to: e.example.to.length > 0 ? e.example.to[0] : '',
            },
        }));

        return {
            translations,
            fromTypes: getTranslationsTypeList(translations),
        };
    } catch (err) {
        return err;
    }
}
