var wordTypeColor = {
    n: 'noun_type_color',
    v: 'verb_type_color',
    a: 'adjv_type_color',
};

// get word type
var wordTypeClass =
    wordTypeColor[document.getElementById('word_type').innerHTML.slice(0, 1)];

document.getElementById('revealing_text') &&
    document.getElementById('revealing_text').classList.add(wordTypeClass);
document.getElementById('answer') &&
    document.getElementById('answer').classList.add(wordTypeClass);

document.getElementById('revealing_text') && revealText('revealing_text');

document.getElementById('translation') &&
    document.getElementById('translation').classList.add(wordTypeClass);

document.getElementById('revealing_blank') &&
    document.getElementById('revealing_blank').classList.add(wordTypeClass);
document.getElementById('revealing_blank') &&
    highlightToFill('revealing_blank');
