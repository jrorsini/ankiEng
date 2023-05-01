import fs from "fs";

const fileName = "ankiTest";

function saveWordCardToFile(newWordCard) {
    if (fs.existsSync(fileName)) {
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) throw err;
            const content = data;

            const WordCard = content + " " + newWordCard;

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

export default saveWordCardToFile;
