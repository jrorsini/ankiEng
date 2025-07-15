export default function isInputEnglish(text) {
    // Checks if the string contains any Roman characters (A-Z, a-z)
    return /[A-Za-z]/.test(text);
}
