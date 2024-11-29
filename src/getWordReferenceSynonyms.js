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

    return res.hasOwnProperty('')
        ? `${chalk.underline.bold('Synonyms')} : ${chalk.green(
              res[''][0]['synonyms'].join(', ')
          )}`
        : res;
}

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
