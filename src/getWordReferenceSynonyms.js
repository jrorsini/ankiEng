import axios from 'axios';
import * as cheerio from 'cheerio';

function wordReferenceSynonymsHandler(content) {
    let res = {};
    content.map((e) => {
        let split = e.split(/Synonyms:/gi);
        let synonyms = split[1].split(/Antonyms:/gi)[0];
        // split[0];
    });
}

export default async function getWordReferenceSynonyms(userInput) {
    try {
        // Load the thesaurus page for the word
        const { data } = await axios.get(
            `https://www.wordreference.com/synonyms/${userInput}`
        );

        // Load the page into Cheerio
        const $ = cheerio.load(data);

        // console.log($('div#otherDicts div.clickable').text());
        let content = [];
        $('div#otherDicts div.clickable > div').each((i, e) => {
            content.push($(e).text());
        });

        wordReferenceSynonymsHandler(content);

        // $('div[data-type="results-page-navigation-group"]') // Adjust this selector based on actual HTML structure
        //     .each((index, element) => {
        //         const wordType = $(element)
        //             .find('button')
        //             .text()
        //             .replace(/\s\([0-9]+\)/gi, ''); // For example, "adjective"
        //         const meaningList = [];

        //         // Find each synonym or meaning under this section
        //         $(element)
        //             .find('a') // Adjust this selector
        //             .each((_, meaningEl) => {
        //                 const meaning = $(meaningEl)
        //                     .text()
        //                     .replace(/as\sin\s/gi, '');
        //                 meaningList.push(meaning);
        //             });

        //         meanings[wordType] = meaningList;
        //     });

        // return meanings;
    } catch (error) {
        // console.error('Error fetching data : ', error);
        return '';
    }
}
