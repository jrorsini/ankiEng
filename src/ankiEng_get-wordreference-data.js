import axios from 'axios';
import * as cheerio from 'cheerio';
import wr from 'wordreference-api';
import {
    formatWordReferenceTranslations,
    formatWordReferenceSynonyms,
} from './wordreference-formatters.js';

//////////////////////////////////// TRANSLATIONS

export async function getWordReferenceTranslations(word) {
    try {
        let WordReferenceRes = await wr(word, 'en', 'fr');
        return formatWordReferenceTranslations(WordReferenceRes);
    } catch (err) {
        return err;
    }
}

//////////////////////////////////// DEFINITIONS

export async function getWordReferenceDefinitions(userInput) {
    try {
        const { data } = await axios.get(
            `https://www.wordreference.com/definition/${userInput}`
        );

        const $ = cheerio.load(data);

        let content = [];

        let def = {};

        $(
            'div.entryRH > span.rh_pdef > span.rh_pos, div.entryRH > span.rh_empos, div.entryRH > ol > li > span.rh_def'
        ).each((i, e) => {
            const $el = $(e);
            if ($el.hasClass('rh_pos') || $el.hasClass('rh_empos')) {
                def['type'] = $el.text();
            } else if ($el.hasClass('rh_def')) {
                if (!def.hasOwnProperty('type')) {
                    def['type'] = content[content.length - 1]['type'];
                }
                def['meaning'] = $el.text();
                content.push(def);
                def = {};
            }
        });

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
    } catch (error) {
        console.error('Error fetching data : ', error);
        return '';
    }
}

//////////////////////////////////// SYNONYMES

export async function getWordReferenceSynonyms(userInput) {
    try {
        const { data } = await axios.get(
            `https://www.wordreference.com/synonyms/${userInput}`
        );

        const $ = cheerio.load(data);

        let content = [];

        $('div#otherDicts div.clickable > div').each((i, e) => {
            content.push(
                $(e)
                    .text()
                    .replace(/\sCollocations/gi, '')
            );
        });

        return formatWordReferenceSynonyms(content);
    } catch (error) {
        console.error('Error fetching data : ', error);
        return '';
    }
}
