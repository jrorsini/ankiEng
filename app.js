import inquirer from "inquirer";
import scrapeWord from "./scrape.js";
import chalk from "chalk";

async function main() {
    while (true) {
        let userInput;
        let userInputtype;

        // user input

        if (process.argv.length <= 2) {
            console.log("No user input provided.");
        } else {
            const userInput = process.argv.slice(2).join(" ");
            console.log(`User input: ${userInput}`);
        }

        if (process.argv[2] !== undefined) {
            userInput = process.argv[2].toLowerCase();
        } else {
            const answers = await inquirer.prompt([
                {
                    type: "input",
                    name: "word",
                    message: "Enter a word to search (or press Enter to quit):",
                },
            ]);
            userInput = answers.word.trim();
        }

        if (!word) {
            break;
        }

        console.log(chalk.magenta.bold(`Searching for "${word}"...`));

        // scrape
        try {
            const { ipa, spelling, type, definition } = await scrapeWord(word);
            console.log(``);
            console.log(chalk.yellow.underline.bold("Word:") + ` ${word}`);
            console.log(chalk.yellow.underline.bold("IPA:") + ` ${ipa}`);
            console.log(
                chalk.yellow.underline.bold("Spelling:") + ` ${spelling}`
            );
            console.log(chalk.yellow.underline.bold("Type:") + ` ${type}`);
            console.log(
                chalk.yellow.underline.bold("Definition:") + ` ${definition}`
            );
            console.log(``);
            console.log(`${word};${ipa};${spelling};${type};${definition}`);
            console.log("---");
        } catch (err) {
            console.log(``);
            console.log(chalk.red.bold(`could not find ${word}`));
            console.log("---");
        }
    }
}

main();
