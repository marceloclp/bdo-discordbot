const BDOScraper = require('bdo-scraper')
const { debug, locale } = require('./../config.json')
const ICONS = require('./../icons.json')

const {
    map_grade_to_icon,
    map_type_to_icon,
    parseTable,
    parseList,
    parseHeader,
    parseIcon,
} = require('./lib')

const formatStats = (stats) => {
    const icons = Object.values(ICONS.stats)
    return parseHeader('Stats') + parseTable([
        { data: ['Damage (AP)', 'Defense (DP)', 'Accuracy', 'Evasion', 'Damage Reduction'] },
        { data: Object.values(stats) }
    ]).split('\n').map(
        (e, i) => `${parseIcon(icons[i])}${e}`
    ).join('\n')
}

const sendSuccess = (msg, item, author = msg.author.toString()) => {
    const res = [
        author + '\n',
        `**__${item.name}__**` + (item.name_en ? ` *(${item.name_en})*` : ''),
        item.description,
        [
            `**Type:** ${map_type_to_icon(item.type)}`,
            `**Grade:** ${map_grade_to_icon(item.grade)}`,
            `**Weight:** ${item.weight}\n`,
        ].join(' | '),
        parseList(item.item_effects, 'Item Effects', ICONS.list_effects) + '\n',
        parseList(item.enhanc_effects, 'Enhancement Effects', ICONS.list_enhancements) + '\n',
        formatStats(item.stats),
        item.link,
    ].filter(e => e).join('\n')

    msg.channel.send(res)
}

const sendError = (msg, id, uri, author = msg.author.toString()) => {
    const res = [
        `Oops, ${author}, it seems item **${id}** doesn't exist. Maybe check the link below :)`,
        `<${uri}>`
    ].join('\n')
    msg.channel.send(res)
}

module.exports = (msg, id) => {
    if (debug)
        console.log(`[!item] ${msg.author.username} => ${id}`)

    const uri = `https://bdocodex.com/${locale}/item/${id}`

    BDOScraper.loadMultiple([...new Set(
        [uri, `https://bdocodex.com/us/item/${id}`]
    )]).then(scrapers => {
        if (scrapers.every(e => e === null)) {
            // Item doesn't exist.
            sendError(msg, id, uri)
            return
        }

        let item = {}
        scrapers.forEach(scraper => {
            if (scraper._locale === locale) {
                item.name           = scraper.getName()
                item.grade          = scraper.getGrade()
                item.stats          = scraper.getStats()
                item.weight         = scraper.getWeight()
                item.item_effects   = scraper.getItemEffects()
                item.enhanc_effects = scraper.getEnhancementEffects()
                item.description    = scraper.getDescription()
                item.link           = scraper._uri
            }
            if (scraper._locale === 'us') {
                item.type           = scraper.getType()
                item.name_en        = scraper.getName()
            }
        })

        sendSuccess(msg, item)
    })
}