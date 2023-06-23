import axios from "axios";

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = "http://localhost:8765/";

export async function checkIfDeckExists(deckName) {
    let deckList;
    await axios
        .post(ankiUrl, {
            action: "deckNamesAndIds",
            version: 6,
        })
        .then((res) => {
            deckList = res.data.result;
        });
    return deckList.hasOwnProperty(deckName);
}

export async function createAnkiDeck(deckName) {
    await axios
        .post(ankiUrl, {
            action: "createDeck",
            version: 6,
            params: {
                deck: deckName,
            },
        })
        .then((res) => {
            console.log("deck " + res.data.result + "has been created");
        })
        .catch((err) => {
            console.log(err);
        });
}

export async function addCard(
    word,
    type,
    pronunciation,
    ipa,
    definition,
    example,
    translation
) {
    let note = {
        deckName: "ankiEng",
        modelName: "ANKIENG_NOTE",
        fields: this,
        options: {
            allowDuplicate: false,
        },
    };

    const res = await axios.post(ankiUrl, {
        action: "addNote",
        version: 6,
        params: {
            note,
        },
    });

    console.log(res.data);
}

// if (!(await checkIfDeckExists("ankiEng"))) {
//     await createAnkiDeck("ankiEng");
// }

// Send the request to import the card

// axios
//     .post(ankiUrl, card)
//     .then((res) => {
//         // console.log(res);
//     })
//     .catch((err) => {
//         // console.log(err);
//     });
