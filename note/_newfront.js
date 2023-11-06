var flagList = ['flag0', 'flag1', 'flag2', 'flag3', 'flag4', 'flag5'];

var wordTypeColor = {
    n: 'noun_type_color',
    v: 'verb_type_color',
    a: 'adjv_type_color',
};

setTimeout(() => {
    // turn card's container's opacity to 1
    document.getElementById('card_container').style.opacity = 1;

    // retrieve card flag's number
    const flagNumber = document.getElementById('cardflag').innerText;

    // retrieve non selected flags
    flagList = flagList.filter((f) => f !== flagNumber);

    // remove non selected flag's elements

    var elementToMove = document.getElementById(flagNumber);
    var parentElement = elementToMove.parentNode;
    parentElement.insertBefore(elementToMove, parentElement.firstChild);

    flagList.map((f) => {
        document.getElementById(f) && document.getElementById(f).remove();
    });

    // get word type
    const wordTypeClass =
        wordTypeColor[
            document.getElementById('word_type').innerHTML.slice(0, 1)
        ];

    // get word type
    switch (flagNumber) {
        case 'flag1':
            document.getElementById('example_fr').classList.add(wordTypeClass);
            document.getElementById('answer').classList.add(wordTypeClass);
            revealTextFrench();
            break;

        default:
            document
                .getElementById('revealing_text')
                .classList.add(wordTypeClass);
            document.getElementById('answer').classList.add(wordTypeClass);
            revealText();
            break;
    }
}, 100);

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

*/
