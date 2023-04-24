const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');

async function scrapeDefinition(word) {
	// website's urls
	const dictionary_url = `https://www.dictionary.com/browse/${word}`;
	const thesaurus_url = `https://www.thesaurus.com/browse/${word}`;
	// body response
	const dictionary_response = await axios.get(dictionary_url);
	const thesaurus_response = await axios.get(thesaurus_url);

	// Dictionary.com
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
	spelling = spelling.replace(/\s+/g, ' ').trim();

	// Thesaurus.com
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

	let tab = '';
	let type = '';
	let definition = '';

	if (definitionChoices.length > 1) {
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'spellingChoice',
				message: `Multiple definitions found. Choose one to use for "${word}":`,
				choices: definitionChoices,
			},
		]);
		tab = answers.spellingChoice.trim();

		type = answers.spellingChoice;
		definition = answers.spellingChoice;
	} else {
		type = definitionChoices[0];
		definition = definitionChoices[0];
	}
	type = type.trim().split(' | ')[0].replace('.', '');
	definition = definition
		.trim()
		.split(' | ')[1]
		.replaceAll(';', ' -')
		.replaceAll(',', ' -');
	return { ipa, spelling, type, definition };
}

module.exports = {
	scrapeDefinition,
};
