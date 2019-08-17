/**
 * Adds trailling whitespaces to the right until the length of the string is equal to `width`.
 * 
 * @param {number} width Length of the string.
 * @param {string} str   String to be fitted inside the cell.
 */
const padString = (width, str) => str + ' '.repeat(Math.abs(width - str.length))

/**
 * Returns the largest item length on an array.
 * 
 * @param {string[]} arr Array to be reduced into the largest string.
 */
const getLargest = (arr) => arr.reduce((acc, cur) => {
    if (acc > cur.length)
        return acc
    return cur.length
}, -1)

/**
 * Formats an object into a table according to the Discord markdown guidelines.
 * 
 * @param {obj[]}    cols           Array of objects describing the columns.
 * @param {obj}      cols[i]        Object describing a column.
 * @param {string}   cols[i].header Title of a column.
 * @param {string[]} cols[i].data   Describes each row of a column.
 */
module.exports = (cols) => {
    let rows = []

    cols.filter(e => e.data.length).forEach((col, colIdx, cols) => {
        const arr   = [col.header, ...col.data].filter(e => e !== undefined)
        const width = getLargest(arr)

        arr.forEach((str, i) => {
            // First column, so initialize the string.
            if (i >= rows.length)
                rows.push('`| ')

            rows[i] += padString(width, str)

            // Last column, close the table.
            if (colIdx === cols.length - 1)
                rows[i] += ' |`'
            
            // Middle columns, append a column separator.
            else
                rows[i] += ' | '
        })
    })

    return rows.join('\n')
}
