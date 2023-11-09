function revealText(elementId) {
    const revealing_text = document.getElementById(elementId).innerHTML;
    const revealing_text_match = revealing_text.match(/\|(.*?)\|/gi);

    document.getElementById(elementId).innerHTML = revealing_text.replace(
        /\|(.*?)\|/gi,
        `<b>${revealing_text_match[0].slice(1, -1)}</b>`
    );
}

function highlightToFill(elementId) {
    const revealing_text = document.getElementById(elementId).innerHTML;
    const revealing_text_match = revealing_text.match(/\|(.*?)\|/gi);

    document.getElementById(elementId).innerHTML = revealing_text.replace(
        /\|(.*?)\|/gi,
        `<b>${revealing_text_match[0].slice(1, -1).replace(/[\w]/g, '_')}</b>`
    );
}
