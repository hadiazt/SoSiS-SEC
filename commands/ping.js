const Discord = require("discord.js")
module.exports = {
    name: "ping",
    description: "Shows Ping",

    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
        .setDescription(`**${client.ws.ping}ms**`)
        message.channel.send({embeds: [embed] })
}}