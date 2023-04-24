const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');

async function scrapeDefinition(word) {
	const dictionary_url = `https://www.dictionary.com/browse/${word}`;
	const thesaurus_url = `https://www.thesaurus.com/browse/${word}`;
	const dictionary_response = await axios.get(dictionary_url);
	const thesaurus_response = await axios.get(thesaurus_url);
	let $ = cheerio.load(dictionary_response.data);
	const ipaContainer = $('.pron-spell-ipa-container .pron-ipa-container');
	const spellingContainer = $(
		'.pron-spell-ipa-container .pron-spell-container'
	);
	let ipa = '';
	if (ipaContainer.length > 0) {
		const ipaContents = ipaContainer.find('.pron-ipa-content');
		if (ipaContents.length === 1) {
			ipa = ipaContents
				.text()
				.trim()
				.replace(/[/()[\]]/g, '');
		} else {
			const ipaChoices = ipaContents
				.map((i, el) =>
					$(el)
						.text()
						.trim()
						.replace(/[/()[\]]/g, '')
				)
				.toArray();
			const answers = await inquirer.prompt([
				{
					type: 'list',
					name: 'ipaChoice',
					message: `Multiple pronunciations found. Choose one to use for "${word}":`,
					choices: ipaChoices,
				},
			]);
			ipa = answers.ipaChoice.trim();
		}
	}
	let spelling = '';
	if (spellingContainer.length > 0) {
		const spellingContents = spellingContainer.find('.pron-spell-content');
		if (spellingContents.length === 1) {
			spelling = spellingContents.text().trim().replace(/\[|\]/g, '');
		} else {
			const spellingChoices = spellingContents
				.map((i, el) => $(el).text().trim().replace(/\[|\]/g, ''))
				.toArray();
			const answers = await inquirer.prompt([
				{
					type: 'list',
					name: 'spellingChoice',
					message: `Multiple spellings found. Choose one to use for "${word}":`,
					choices: spellingChoices,
				},
			]);
			spelling = answers.spellingChoice.trim();
		}
	}
	spelling = spelling.replace(/\s+/g, ' ');

	$ = cheerio.load(thesaurus_response.data);

	const definitionChoices = [];

	$('.postab-container ul li a em')
		.toArray()
		.map((el, i) => {
			definitionChoices[i] = $(el).text().trim();
		});

	$('.postab-container ul li a strong')
		.toArray()
		.map((el, i) => {
			definitionChoices[i] += ' | ' + $(el).text().trim();
		});

	const tabs = await inquirer.prompt([
		{
			type: 'list',
			name: 'spellingChoice',
			message: `Multiple definitions found. Choose one to use for "${word}":`,
			choices: definitionChoices,
		},
	]);

	return { ipa, spelling, tabs };
}

module.exports = {
	scrapeDefinition,
};
