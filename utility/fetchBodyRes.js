import axios from "axios";

/**
 * retrieve body response from thesaurus.com
 * @param {String} word - word to search on thesaurus.com
 * @returns {String} html body response scraped from thesaurus.com
 */
export async function fetchThesaurusBodyResponse(word) {
    try {
        return await axios.get(`https://www.thesaurus.com/browse/${word}`);
    } catch (error) {
        if (error.response) {
            console.log(
                `"${word}" ` + "Thesaurus Status:",
                error.response.status
            ); // console.log("Data:", error.response.data);
        } else if (error.request) {
            console.log("Request:", error.request);
        } else {
            console.log("Error:", error.message);
        }
        return false;
    }
}

/**
 * retrieve body response from dictionary.com
 * @param {String} word - word to search on dictionary.com
 * @returns {String} html body response scraped from dictionary.com
 */
export async function fetchDictionaryBodyResponse(word) {
    try {
        return await axios.get(`https://www.dictionary.com/browse/${word}`);
    } catch (error) {
        if (error.response) {
            console.log(
                `"${word}" ` + "Dictionary Status:",
                error.response.status
            );
            // console.log("Data:", error.response.data);
        } else if (error.request) {
            console.log("Request:", error.request);
        } else {
            console.log("Error:", error.message);
        }
        return false;
    }
}
