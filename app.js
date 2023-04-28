import inquirer from 'inquirer';
import scrapeWord from './scrape.js';
import chalk from 'chalk';

async function main() {
	while (true) {
		let word;
		if (process.argv[2] !== undefined) {
			word = process.argv[2].toLowerCase();
		} else {
			const answers = await inquirer.prompt([
				{
					type: 'input',
					name: 'word',
					message: 'Enter a word to search (or press Enter to quit):',
				},
			]);
			word = answers.word.trim();
		}

		if (!word) {
			break;
		}

		console.log(chalk.magenta.bold(`Searching for "${word}"...`));

		try {
			const { ipa, spelling, type, definition } = await scrapeWord(word);
			console.log(``);
			console.log(chalk.yellow.underline.bold('Word:') + ` ${word}`);
			console.log(chalk.yellow.underline.bold('IPA:') + ` ${ipa}`);
			console.log(chalk.yellow.underline.bold('Spelling:') + ` ${spelling}`);
			console.log(chalk.yellow.underline.bold('Type:') + ` ${type}`);
			console.log(
				chalk.yellow.underline.bold('Definition:') + ` ${definition}`
			);
			console.log(``);
			console.log(`${word};${ipa};${spelling};${type};${definition}`);
			console.log('---');
		} catch (err) {
			console.log(``);
			console.log(chalk.red.bold(`could not find ${word}`));
			console.log('---');
		}
	}
}

main();
