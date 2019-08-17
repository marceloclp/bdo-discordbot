const config  = require('./config.json')
const Discord = require('discord.js')
const cmds    = require('./commands')

const client  = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (msg) => {
    if (msg.author.bot || msg.content[0] !== config.prefix)
        return
    
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g)
    const cmd  = args.shift().toLowerCase()
    const key  = Object.keys(cmds).find(k => k === cmd)

    if (key)
        cmds[key](msg, args)
})

try {
    client.login(config.token)
} catch(err) {
    console.log(err)
}