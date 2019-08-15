/**
 * Adds trailling whitespaces for padding based on an expected length and string length.
 * 
 * @param {number} pad Expected length of the cell.
 * @param {string} str String to be fitted inside the cell.
 */
module.exports = (pad, str) => {
    return ' '.repeat(Math.abs(pad - str.length))
}