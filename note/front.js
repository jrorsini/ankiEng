/*
<span id="ipa_field_hint">{{ipa}}</span>
<p id="revealing_text">{{revealing_text}}</p>
{{type::translation}}

<link rel="stylesheet" href="ankiEng/style.css"/>
<script src="ankiEng/front.js"/>
*/

setTimeout(() => {
    console.log("hello front");
    // document.getElementById("ipa_field_hint").innerHTML = html;

    // replace "|" by "b" tags for revealing_text.
    document.getElementById("revealing_text").style.opacity = 1;
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

    // Call the function with the target sentence element
    const sentenceBreakDown = document.getElementById("revealing_text");
    fadeWords(sentenceBreakDown);

    let word_char_number =
        document.getElementById("word_char_number").innerHTML;

    document.getElementById("word_char_number").innerHTML =
        word_char_number.slice(0, 1).toUpperCase() +
        word_char_number.slice(1).replace(/[a-z]/gi, "_");
}, 100);
