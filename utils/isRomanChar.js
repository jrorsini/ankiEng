export default function isRomanChar(text) {
    // Checks if the string contains any Roman characters (A-Z, a-z)
    return /[A-Za-z]/.test(text);
}
