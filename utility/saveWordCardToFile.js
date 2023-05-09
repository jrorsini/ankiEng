import fs from "fs";

// const fileName = "ankiTest.txt";

export async function fileExists(fileName) {
    return fs.existsSync(fileName);
}

export async function getFileContent(fileName) {
    return fs.readFileSync(fileName, "utf8");
}

export async function saveContentToFile(fileName, content) {
    return fs.writeFileSync(fileName, content);
}

export async function saveWordCardToFile(newWordCard) {
    let messageLog;
    let fileContent;
    if (await fs.existsSync(fileName)) {
        fileContent = await fs.readFile(fileName, "utf8", (err, data) => {
            if (err) throw err;
            // console.log("first");
            // console.log(data);

            // console.log("second");
            // console.log(data);
            if (data.includes(newWordCard)) {
                return `The sentence "${
                    newWordCard.split(";")[1]
                }" already exists in the file ${fileName}`;
            }

            const WordCard =
                data.trim() === "" ? newWordCard : data + "\n" + newWordCard;

            return fs.writeFile(fileName, WordCard, (err) => {
                if (err) throw err;
                return `The WordCard has been saved in the file ${fileName}`;
            });
        });

        /* 
        
        console.log("second");
        console.log(fileContent);
        if (fileContent.includes(newWordCard)) {
            return `The sentence "${
                newWordCard.split(";")[1]
            }" already exists in the file ${fileName}`;
        }

        const WordCard =
            fileContent.trim() === ""
                ? newWordCard
                : fileContent + "\n" + newWordCard;

        return await fs.writeFile(fileName, WordCard, (err) => {
            if (err) throw err;
            return `The WordCard has been saved in the file ${fileName}`;
        });
        
        
        */
        console.log("second");
        console.log(fileContent);
        if (fileContent.includes(newWordCard)) {
            return `The sentence "${
                newWordCard.split(";")[1]
            }" already exists in the file ${fileName}`;
        }

        const WordCard =
            fileContent.trim() === ""
                ? newWordCard
                : fileContent + "\n" + newWordCard;

        return await fs.writeFile(fileName, WordCard, (err) => {
            if (err) throw err;
            return `The WordCard has been saved in the file ${fileName}`;
        });
    } else {
        const WordCard = newWordCard;

        return await fs.writeFile(fileName, WordCard, (err) => {
            if (err) throw err;
            return `The sentence has been saved in the file ${fileName}`;
        });
    }
}
