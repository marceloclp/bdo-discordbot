const rp = require('request-promise')
const BDOScraper = require('bdo-scraper')
const { debug, locale } = require('./../config.json')
const { map_type_to_icon, parseTable } = require('./lib')

const sendSuccess = (msg, term, data, author = msg.author.toString()) => {
    const isUs = locale === 'us'

    const table = parseTable([
        { header: 'ID', data: data.map(e => e.id) },
        { header: `Name (${locale.toUpperCase()})`, data: data.map(e => e.name) },
        { header: 'Name (US)', data: !isUs ? data.map(e => e.name_en) : [] }
    ]).split('\n').map((e, i) => {
        if (i === 0)
            return `${map_type_to_icon()}${e}`
        return `${map_type_to_icon(data[i-1].type)}${e} <${data[i-1].link}>`
    }).join('\n')

    const res = [
        author,
        `**Search Term:** ${term}`,
        `**Number of Results:** ${data.length}`,
        table,
    ].filter(e => e).join('\n')

    msg.channel.send(res)
}

const sendError = (msg, term, author = msg.author.toString()) => {
    msg.channel.send(
        `Sorry, ${author}, I couldn't find any items similar to **${term}**. Maybe try again with another term :(`
    )
}

module.exports = (msg, args) => {
    const term = args.join(' ')

    if (debug)
        console.log(`[!search] ${msg.author.username} => ${term}`)
    
    rp(
        `https://bdocodex.com/ac.php?l=${locale}&term=${encodeURIComponent(term)}`
    ).then(res => {
        // Items data array.
        const data = JSON.parse(res.trim()).map(item => ({
            id:      item.value,
            name:    item.name,
            grade:   item.grade,
            link:    `https://bdocodex.com${item.link}`,
            link_en: `https://bdocodex.com${item.link.replace(`/${locale}/`, '/us/')}`,
        }))
        
        if (!data.length)
            return sendError(msg, term)

        BDOScraper.loadMultiple(data.map(item => item.link_en)).then(scrapers => {
            scrapers.forEach((scraper, i) => {
                if (!scraper)
                    return
                data[i].name_en = scraper.getName()
                data[i].type    = scraper.getType()
            })

            sendSuccess(msg, term, data)
        })
    }).catch(err => console.error(err))
}