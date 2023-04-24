const inquirer = require('inquirer');
const axios = require('axios');
const cheerio = require('cheerio');

// define a function to scrape the IPA and spelling of a word from dictionary.com
async function scrapeDefinition(word) {
	const url = `https://www.dictionary.com/browse/${word}`;
	const response = await axios.get(url);
	const $ = cheerio.load(response.data);
	const ipa = $(
		'.pron-spell-ipa-container .pron-ipa-container .pron-ipa-content'
	);
	const spelling = $(
		'.pron-spell-ipa-container .pron-spell-container .pron-spell-content'
	);
	return { ipa, spelling };
}

// define an async IIFE to repeatedly prompt the user for words to search
(async function () {
	while (true) {
		console.log('---');
		const answers = await inquirer.prompt([
			{
				type: 'input',
				name: 'word',
				message: 'Enter a word to search:',
			},
		]);
		const word = answers.word.trim();
		const { ipa, spelling } = await scrapeDefinition(word);
		console.log(`${spelling.text().trim()} (${ipa.text().trim()})`);
	}
})();
