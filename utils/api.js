// https://www.wordreference.com/english/abbreviationsWRD.aspx?dict=enfr&abbr=vi&src=WR

import Reverso from 'reverso-api';
import axios from 'axios';
import { getClosestMatchingWord } from './searchResultslogs.js';
import wr from 'wordreference-api';
import { getTranslationsTypeList } from './translationTypes.js';

const reverso = new Reverso();

export async function getWRefData() {
    try {
        let wrData = await wr(this.word, 'en', 'fr');
        const arr = wrData.translations.map((e) => e.translations);
        let translations = [].concat(
            ...arr.map((inArr) => [].concat(...inArr))
        );
        this['translations'] = translations.map((e) => ({
            ...e,
            from: e.from.trim().replaceAll('⇒', ''),
            to: e.to.trim().replaceAll('⇒', ''),
            example: {
                from: e.example.from.length > 0 ? e.example.from[0] : '',
                to: e.example.to.length > 0 ? e.example.to[0] : '',
            },
        }));

        return {
            ...this,
            fromTypes: getTranslationsTypeList(translations),
        };
    } catch (err) {
        return this;
    }
}

export async function getIPA(word) {
    try {
        let dictionaryapiJSON = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        return [
            ...new Set(
                dictionaryapiJSON.data.map((e) =>
                    e.phonetic ? e.phonetic.replaceAll('/', '') : ''
                )
            ),
        ][0];
    } catch (error) {
        console.error(error);
        return;
    }
}

export async function getDictData() {
    try {
        let dictionaryData = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`
        );

        // assign IPA
        this['ipa'] = [
            ...new Set(
                dictionaryData.data.map((e) =>
                    e.phonetic ? e.phonetic.replaceAll('/', '') : ''
                )
            ),
        ][0];

        return this;
    } catch (err) {
        return this;
    }
}
