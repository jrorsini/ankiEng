import fs from "fs";

const fileName = "ankiTest.txt";

export function saveWordCardToFile(newWordCard) {
    if (fs.existsSync(fileName)) {
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) throw err;
            const content = data;

            // Check if the new sentence already exists in the file
            if (content.includes(newWordCard)) {
                console.log(
                    `The sentence "${newWordCard}" already exists in the file ${fileName}`
                );
                return;
            }

            const WordCard =
                content.trim() === ""
                    ? newWordCard
                    : content + "\n" + newWordCard;

            fs.writeFile(fileName, WordCard, (err) => {
                if (err) throw err;
                console.log(
                    `The WordCard has been saved in the file ${fileName}`
                );
            });
        });
    } else {
        const WordCard = newWordCard;

        fs.writeFile(fileName, WordCard, (err) => {
            if (err) throw err;
            console.log(`The sentence has been saved in the file ${fileName}`);
        });
    }
}
