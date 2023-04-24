const inquirer = require('inquirer');
const { scrapeDefinition } = require('./scrape');
import chalk from 'chalk';

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

		try {
			const { ipa, spelling, type, definition } = await scrapeDefinition(word);
			console.log(``);
			console.log(chalk.yellow.underline('Word!') + `: ${word}`);
			console.log(`IPA: ${ipa}`);
			console.log(`Spelling: ${spelling}`);
			console.log(`Type: ${type}`);
			console.log(`Definition: ${definition}`);
			console.log(``);
			console.log(`${word};${ipa};${spelling};${type};${definition}`);
			console.log('---');
		} catch (err) {
			console.log(`could not find ${word}`);
			console.log('---');
		}
	}
}

main();
