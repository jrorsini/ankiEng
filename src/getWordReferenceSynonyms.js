import axios from 'axios';
import * as cheerio from 'cheerio';
import chalk from 'chalk';

function formatWordReferenceSynonyms(content) {
    /*  
        returned value schema.
        {
            wordType : {
                meaning : '',
                synonyms : []
            }
        }
    */

    let res = {};

    content.map((e) => {
        let split = e.split(/Synonyms:/gi);
        let synonymHeader = split[0].slice(7).split(/\:\s/gi);
        if (!synonymHeader) return false;
        let wordType = synonymHeader[0];
        let wordMeaning = synonymHeader[1];
        let synonyms = split[1].split(/Antonyms:/gi)[0].split(', ');

        if (res.hasOwnProperty(wordType)) {
            res[wordType].push({ meaning: wordMeaning, synonyms });
        } else {
            res[wordType] = [{ meaning: wordMeaning, synonyms }];
        }
    });
    // console.log(res);

    return res;
}

export async function getWordReferenceDefinitions(userInput) {
    try {
        const { data } = await axios.get(
            `https://www.wordreference.com/definition/${userInput}`
        );

        const $ = cheerio.load(data);

        let content = [];

        const def = {};

        $(
            'div.entryRH > span.rh_pdef > span.rh_pos, div.entryRH > ol > li > span.rh_def'
        ).each((i, e) => {
            const $el = $(e);
            if ($el.hasClass('rh_pos')) {
                def['type'] = $el.text();
            } else if ($el.hasClass('rh_def')) {
                let filteredElements = $el.not('span.rh_lab, span.rh_cat');
                console.log(filteredElements.text());
                def['meaning'] = filteredElements.text();
            }

            // console.log(def);

            content.push(def);
        });

        return content;
    } catch (error) {
        console.error('Error fetching data : ', error);
        return '';
    }
}

export async function getWordReferenceSynonyms(userInput) {
    try {
        const { data } = await axios.get(
            `https://www.wordreference.com/synonyms/${userInput}`
        );

        const $ = cheerio.load(data);

        let content = [];
        $('div#otherDicts div.clickable > div').each((i, e) => {
            content.push($(e).text());
        });

        return formatWordReferenceSynonyms(content);
    } catch (error) {
        console.error('Error fetching data : ', error);
        return '';
    }
}
