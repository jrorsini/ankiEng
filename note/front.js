/*
<span id="ipa_field_hint">{{ipa}}</span>
<p id="revealing_text">{{revealing_text}}</p>
{{type::translation}}

<link rel="stylesheet" href="ankiEng/style.css"/>
<script src="ankiEng/front.js"/>
*/

function colorizeIPA() {
    var div = document.getElementById("ipa_field_hint").innerText;
    var html = "";

    var consonants = [
        "p",
        "b",
        "t",
        "d",
        "ʃ",
        "ʒ",
        "k",
        "g",
        "ɡ",
        "f",
        "v",
        "ɹ",
        "θ",
        "ð",
        "s",
        "z",
        "ʃ",
        "m",
        "n",
        "ŋ",
        "h",
        "l",
        "r",
        "w",
        "j",
        "y",
    ];

    var vowels = ["i", "u", "e", "ə", "ɜ", "ɔ", "æ", "ʌ", "ɑ", "ɒ", "a", "ɛ"];

    for (var i = 0; i < div.length; i++) {
        // consonants

        if (consonants.indexOf(div[i]) != -1) {
            if (consonants.indexOf(div[i - 1]) != -1) {
                if (consonants.indexOf(div[i - 2]) != -1) {
                }
            } else if (consonants.indexOf(div[i + 1]) != -1) {
                if (consonants.indexOf(div[i + 2]) != -1) {
                    html +=
                        '<span class="ipa_block ipa_consonant">' +
                        div[i] +
                        div[i + 1] +
                        div[i + 2] +
                        "</span>";
                } else {
                    html +=
                        '<span class="ipa_block ipa_consonant">' +
                        div[i] +
                        div[i + 1] +
                        "</span>";
                }
            } else {
                html +=
                    '<span class="ipa_block ipa_consonant">' +
                    div[i] +
                    "</span>";
            }
        }

        // diphthong
        else if (vowels.indexOf(div[i]) != -1) {
            if (div[i + 1] == "ɪ" || div[i + 1] == "ʊ") {
                html +=
                    '<span class="ipa_block ipa_diphthong">' +
                    div[i] +
                    div[i + 1] +
                    "</span>";
            } else if (div[i - 1] == "ʊ") {
                html +=
                    '<span class="ipa_block ipa_diphthong">ʊ' +
                    div[i] +
                    "</span>";
            } else {
                html += '<span class="ipa_block ipa_vowel">';
                if (div[i + 1] == "ː") {
                    html += div[i] + "ː";
                } else {
                    html += div[i];
                }
                html += "</span>";
            }
        }

        // vowel
        else if (div[i] == "ɪ") {
            if (vowels.indexOf(div[i - 1]) == -1) {
                html += '<span class="ipa_block ipa_vowel">ɪ</span>';
            }
        } else if (div[i] == "ʊ") {
            if (vowels.indexOf(div[i + 1]) != -1) {
            } else if (vowels.indexOf(div[i - 1]) == -1) {
                html += '<span class="ipa_block ipa_vowel">ʊ</span>';
            }
        } else if (div[i] == "ˈ" || div[i] == "ˌ") {
            html += "<span>" + div[i] + "</span>";
        } else if (div[i] == "ː") {
            html += "";
        } else {
            html += '<span class="ipa_block ipa_vowel">' + div[i] + "</span>";
        }
    }
}

setTimeout(() => {
    // document.getElementById("ipa_field_hint").innerHTML = html;

    // replace "|" by "b" tags for revealing_text.
    const revealing_text = document.getElementById("revealing_text").innerHTML;
    const revealing_text_match = revealing_text.match(/\|.+\|/gi);

    // document.getElementById("revealing_text").innerHTML = revealing_text.replace(
    //     /\|.+\|/gi,
    //     `<b id="revealing_text_b">${revealing_text_match[0].slice(1, -1)}</b>`
    // );

    /*
        // append #ipa_field_hint
        const node = document.getElementById("ipa_field_hint");
        document.getElementById("revealing_text_b").appendChild(node);
    */

    function fadeWords(sentenceElement) {
        const words = sentenceElement.textContent.split("");

        // Clear the existing content
        sentenceElement.textContent = "";

        let englishWordColorOn = false;

        words.forEach((word) => {
            if (!englishWordColorOn && word === "|") {
                englishWordColorOn = true;
            } else if (englishWordColorOn && word === "|") {
                englishWordColorOn = false;
            }

            const wordElement = document.createElement("span");

            // Add a class to the word element
            wordElement.classList.add("char-fade");
            englishWordColorOn && wordElement.classList.add("char-fade_bold");

            wordElement.textContent = word.replace(/\|/gi, "");
            wordElement.style.opacity = "0";

            sentenceElement.appendChild(wordElement);
        });

        const wordElements = sentenceElement.querySelectorAll("span.char-fade");
        let currentIndex = 0;

        function revealNextLetter() {
            if (currentIndex < wordElements.length) {
                const wordElement = wordElements[currentIndex];
                wordElement.style.opacity = "1";
                currentIndex++;

                setTimeout(revealNextLetter, 30); // Adjust the delay as needed
            }
        }

        revealNextLetter();
    }

    // Call the function with the target sentence element
    const sentenceBreakDown = document.getElementById("revealing_text");
    fadeWords(sentenceBreakDown);

    let word_char_number =
        document.getElementById("word_char_number").innerHTML;

    document.getElementById("word_char_number").innerHTML =
        word_char_number.slice(0, 1).toUpperCase() +
        word_char_number.slice(1).replace(/[^-\s]/gi, "_");
}, 100);
