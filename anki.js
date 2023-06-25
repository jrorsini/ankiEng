import axios from "axios";

// https://foosoft.net/projects/anki-connect/index.html#deck-actions

// Define the AnkiConnect API URL
const ankiUrl = "http://localhost:8765/";

// export async function checkIfDeckExists(deckName) {
//     let deckList;
//     await axios
//         .post(ankiUrl, {
//             action: "deckNamesAndIds",
//             version: 6,
//         })
//         .then((res) => {
//             deckList = res.data.result;
//         });
//     return deckList.hasOwnProperty(deckName);
// }

// export async function createAnkiDeck(deckName) {
//     await axios
//         .post(ankiUrl, {
//             action: "createDeck",
//             version: 6,
//             params: {
//                 deck: deckName,
//             },
//         })
//         .then((res) => {
//             console.log("deck " + res.data.result + "has been created");
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

/*
- word
- ipa
- example_en
- example_fr
- translation
- synonyms
*/

export async function addCard() {
    let note = {
        deckName: "ankiEng",
        modelName: "ANKIENG_NOTE",
        fields: this,
        options: {
            allowDuplicate: false,
        },
    };
    try {
        const res = await axios.post(ankiUrl, {
            action: "addNote",
            version: 6,
            params: {
                note,
            },
        });
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}
