/*
<span id="ipa_field_hint">{{ipa}}</span>
<p id="example_en">{{example_en}}</p>

<p id="example_fr">{{example_fr}}</p>

<link rel="stylesheet" href="ankiEng/style.css"/>
<script src="ankiEng/back.js"/>

*/

setTimeout(() => {
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

    // document.getElementById("ipa_field_hint").innerHTML = html;

    // replace "|" by "b" tags for example_en.
    const example_en = document.getElementById("example_en").innerHTML;
    const example_en_match = example_en.match(/\|.+\|/gi);

    document.getElementById("example_en").innerHTML = example_en.replace(
        /\|.+\|/gi,
        `<b id="example_en_b">${example_en_match[0].slice(1, -1)}</b>`
    );

    // replace "|" by "b" tags for example_fr.
    const example_fr = document.getElementById("example_fr").innerHTML;
    const example_fr_match = example_fr.match(/\|.+\|/gi);

    console.log(example_fr_match);
    document.getElementById("example_fr").innerHTML = example_fr.replace(
        /\|.+\|/gi,
        `<b id="example_fr_b">${example_fr_match[0].slice(1, -1)}</b>`
    );

    // append #ipa_field_hint
    const node = document.getElementById("ipa_field_hint");
    document.getElementById("example_en_b").appendChild(node);
}, 100);
