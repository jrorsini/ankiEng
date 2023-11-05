var flagList = ['flag0', 'flag1', 'flag2', 'flag3', 'flag4', 'flag5'];

setTimeout(() => {
    const flagNumber = document.getElementById('cardflag').innerText;
    flagList = flagList.filter((f) => f !== flagNumber);
    console.log();
    flagList.map((f) => {
        document.getElementById(f).remove();
    });
    // element2Del
}, 100);

// --------------------------------------------------------------------------
// FLAG0 is DEFAULT | guess TRANSLATION from EXAMPLE_EN
// --------------------------------------------------------------------------

/**
	<span class="field_header">Example Sentence</span>
	<p id="revealing_text">{{furigana:example_en}}{{^example_en}}{{word}}{{/example_en}}</p>

	<span class="field_header">Translation</span>
	<div id="answer">{{type:translation}}</div>
 */
