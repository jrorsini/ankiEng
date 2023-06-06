import cheerio from "cheerio";

/**
 * List IPAs
 * @param {String} body - dictionary.com html body from fetchDictionaryBodyResponse.
 * @returns {Array} List of IPAs
 */
export function cheerioGetIPAs(body) {
    // arg: dictionary.com html body from fetchDictionaryBodyResponse.
    let $ = cheerio.load(body.data);
    const ipaContainer = $(".pron-spell-ipa-container").find(
        ".pron-ipa-content"
    );

    const ipa =
        ipaContainer.length === 1
            ? [
                  ipaContainer
                      .text()
                      .replace(/[/()[\]]/g, "")
                      .trim(),
              ][0]
            : [
                  ...new Set(
                      ipaContainer
                          .map((i, el) =>
                              $(el)
                                  .text()
                                  .replace(/[/()[\]]/g, "")
                                  .trim()
                          )
                          .toArray()
                  ),
              ][0];
    return ipa.split(", ")[0];
}
