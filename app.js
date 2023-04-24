const inquirer = require('inquirer');
const { scrapeDefinition } = require('./scrape');

async function main() {
	while (true) {
		// const answers = await inquirer.prompt([
		// 	{
		// 		type: 'input',
		// 		name: 'word',
		// 		message: 'Enter a word to search (or press Enter to quit):',
		// 	},
		// ]);

		// const word = answers.word.trim();
		// if (!word) {
		// 	break;
		// }

		// console.log(`Searching for "${word}"...`);
		// const { ipa, spelling } = await scrapeDefinition(word);
		console.log(`Searching for "test"...`);
		const { ipa, spelling, tabs } = await scrapeDefinition('trifle');
		console.log(`IPA: ${ipa}`);
		console.log(`Spelling: ${spelling}`);
		console.log(`Definition: ${tabs}`);
		console.log('---');
	}
}

main();
