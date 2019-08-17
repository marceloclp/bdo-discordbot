const parseIcon   = require('./parseIcon')
const parseHeader = require('./parseHeader')

/**
 * Formats an array into a list according to the Discord markdown guidelines.
 * 
 * @param {string[]} rows   Row content.
 * @param {string}   header A list can have a header.
 * @param {string}   icon   Icon to be preppended to each row.
 */
module.exports = (rows, header, icon) => {
    if (!rows)
        return null

    const list = rows.map(row => {
        if (!icon)
            return row
        return `${parseIcon(icon)}${row}`
    }).join('\n')

    if (!header)
        return list

    return parseHeader(header) + list
}