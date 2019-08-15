const rp                = require('request-promise')
const BDOScraper        = require('bdo-scraper')
const { debug, locale } = require('./../config.json')

const {
    map_type_to_icon,
    padding,
    getCellWidth,
} = require('./lib')

const formatMsg = (author, term, data) => {
    const isLocaleEn = locale === 'en'

    const title     = `Name (${locale.toUpperCase()})`
    const title_en = 'Name (EN)'

    // Get the cell width of the locale name and the english name.
    const width    = getCellWidth([title,    ...data.map(item => item.name)])
    const width_en = getCellWidth([title_en, ...data.map(item => item.name_en)])

    return [
        author,
        `**Search Term:** ${term}`,
        `**Number of Results:** ${data.length}`,

        // Table header.
        [
            map_type_to_icon(),
            '`',
            `| ${title}${padding(width, title)}`,
            !isLocaleEn ? ` | ${title_en}${padding(width_en, title_en)}` : null,
            ' |`'
        ].filter(e => e).join(''),

        // Table body.
        data.map(item => ([
            map_type_to_icon(item.type),
            '`',
            `| ${item.name}${padding(width, item.name)}`,
            !isLocaleEn ? ` | ${item.name_en}${padding(width_en, item.name_en)}` : null,
            ' |` ',
            `<${item.link}>`,
        ].filter(e => e).join(''))).join('\n')
    ].join('\n')
}

const cmd = (msg, term) => {
    if (debug) {
        console.log([
            `[!search] ${msg.author.username} => ${term}`
        ].join('\n'))
    }

    rp(
        `https://bdocodex.com/ac.php?l=${locale}&term=${encodeURIComponent(term)}`
    ).then(res => {
        // Items data as an object.
        const data = JSON.parse(res.trim()).map(item => ({
            id:      item.value,
            name:    item.name,
            grade:   item.grade,
            link:    `https://bdocodex.com${item.link}`,
            link_en: `https://bdocodex.com${item.link.replace(locale, 'en')}`,
        }))

        BDOScraper.loadMultiple(data.map(item => item.link_en)).then(scrapers => {
            scrapers.forEach((scraper, i) => {
                if (!scraper)
                    return
                data[i].name_en = scraper.getName()
                data[i].type    = scraper.getType()
            })

            msg.channel.send(formatMsg(msg.author.toString(), term, data))
        })
    }).catch(err => console.error(err))
}

module.exports = cmd