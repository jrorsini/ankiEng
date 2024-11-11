import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getThesaurusSynonyms(userInput) {
    try {
        // Load the thesaurus page for the word
        const { data } = await axios.get(
            `https://www.thesaurus.com/browse/${userInput}`
        );

        // Load the page into Cheerio
        const $ = cheerio.load(data);

        // Select the side column section containing the word type and meanings
        const meanings = {};

        $('div[data-type="results-page-navigation-group"]') // Adjust this selector based on actual HTML structure
            .each((index, element) => {
                const wordType = $(element)
                    .find('button')
                    .text()
                    .replace(/\s\([0-9]+\)/gi, ''); // For example, "adjective"
                const meaningList = [];

                // Find each synonym or meaning under this section
                $(element)
                    .find('a') // Adjust this selector
                    .each((_, meaningEl) => {
                        const meaning = $(meaningEl)
                            .text()
                            .replace(/as\sin\s/gi, '');
                        meaningList.push(meaning);
                    });

                meanings[wordType] = meaningList;
            });

        return meanings;
    } catch (error) {
        // console.error('Error fetching data : ', error);
        return '';
    }
}
