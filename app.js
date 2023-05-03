import inquirer from "inquirer";
import scrapeWord from "./utility/scrapeFuncs.js";
import saveWordCardToFile from "./saveWordCardToFile.js";
import chalk from "chalk";

let UserInputSearched = false;

async function main() {
    while (true && UserInputSearched === false) {
        let userInput;
        // let userInputType;

        // user input

        if (process.argv.length <= 2) {
            console.log("No user input provided.");
        } else {
            const userInput = process.argv.slice(2).join(" ");
            console.log(`User input: ${userInput}`);
            UserInputSearched = true;
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

        if (!userInput) {
            break;
        }

        console.log(chalk.magenta.bold(`Searching for "${userInput}"...`));

        // scrape
        try {
            const { ipa, spelling, type, definition } = await scrapeWord(
                userInput
            );
            console.log(``);
            console.log(chalk.yellow.underline.bold("Word:") + ` ${userInput}`);
            console.log(chalk.yellow.underline.bold("IPA:") + ` ${ipa}`);
            console.log(
                chalk.yellow.underline.bold("Spelling:") + ` ${spelling}`
            );
            console.log(chalk.yellow.underline.bold("Type:") + ` ${type}`);
            console.log(
                chalk.yellow.underline.bold("Definition:") + ` ${definition}`
            );
            console.log(``);

            saveWordCardToFile(
                `${type};${userInput};${spelling};${ipa};${definition}`
            );

            console.log("---");
        } catch (err) {
            console.log(``);
            console.log(chalk.red.bold(`could not find ${userInput}`));
            console.error(err, err.stack);
            console.log("---");
        }
    }
}

main();
