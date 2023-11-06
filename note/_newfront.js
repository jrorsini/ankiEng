function revealText(elementId) {
    const revealing_text = document.getElementById(elementId).innerHTML;
    const revealing_text_match = revealing_text.match(/\|.+\|/gi);

    document.getElementById('revealing_text').innerHTML =
        revealing_text.replace(
            /\|.+\|/gi,
            `<b id="revealing_text_b">${revealing_text_match[0].slice(
                1,
                -1
            )}</b>`
        );
}

var wordTypeColor = {
    n: 'noun_type_color',
    v: 'verb_type_color',
    a: 'adjv_type_color',
};

// get word type
var wordTypeClass =
    wordTypeColor[document.getElementById('word_type').innerHTML.slice(0, 1)];

document.getElementById('revealing_text').classList.add(wordTypeClass);
document.getElementById('answer').classList.add(wordTypeClass);

revealText('revealing_text');

// --------------------------------------------------------------------------
// FLAG0 is DEFAULT | guess TRANSLATION from EXAMPLE_EN
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// FLAG1 | guess WORD from EXAMPLE_FR
// --------------------------------------------------------------------------

/**


<div id="card_container" style="opacity:0">
    <span style="opacity:0; position: absolute;" id="cardflag">{{CardFlag}}</span>
    <span id="word_ipa" style="opacity:0;">{{ipa}}</span>
    <span id="word_type" style="opacity:0;">{{fromType}}</span>

    <div id="flag0">
        <span class="field_header">Example Sentence</span>
        <p id="revealing_text">{{furigana:example_en}}</p>

        <span class="field_header">Translation</span>
        <div id="answer">{{type:translation}}</div>
    </div>

    <div id="flag1">
        <p>flag1</p>
        <span class="field_header">Definition</span>
        <p><b>{{definition}}</b></p>
    </div>

    <div id="flag2">
        <p>flag2</p>
    </div>

    <div id="flag3">
        <p>flag3</p>
    </div>

    <div id="flag4">
        <p>flag4</p>
    </div>
</div>

{{#display_ex-fr}}
    <span class="field_header">French Sentence</span>
    <p id="revealing_text">{{example_fr}}</p>

    <span class="field_header">English Word</span>
    <div id="answer">{{type:word}}</div>
{{/display_ex-fr}}

*/
