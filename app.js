const inquirer = require('inquirer');
const { scrapeDefinition } = require('./scrape');

async function main() {
	while (true) {
		const answers = await inquirer.prompt([
			{
				type: 'input',
				name: 'word',
				message: 'Enter a word to search (or press Enter to quit):',
			},
		]);

		const word = answers.word.trim();
		if (!word) {
			break;
		}

		console.log(`Searching for "${word}"...`);
		const { ipa, spelling, type, definition } = await scrapeDefinition(word);
		console.log(`Word: ${word}`);
		console.log(`IPA: ${ipa}`);
		console.log(`Spelling: ${spelling}`);
		console.log(`Type: ${type}`);
		console.log(`Definition: ${definition}`);

		console.log(`${word};${ipa};${spelling};${type};${definition}`);
		console.log('---');
	}
}

main();
