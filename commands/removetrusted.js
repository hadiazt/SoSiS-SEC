const Discord = require("discord.js")
const db = require("quick.db")
const ms = require('parse-ms');
const { truncate } = require("fs");
module.exports = {
  name: "removetrusted",
  description: "Set Guild Anit Raid Config",
  run: async (client, message, args) => {
    const guildicon = message.guild.iconURL();
    if (message.author.id === message.guild.ownerId) {

      let user = message.mentions.users.first()
      if (!user) {
        let usermention = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`
          **Mention User!** 
          `)
          .setFooter(message.guild.name, guildicon)

        return message.channel.send({
          embeds: [usermention]
        });
      }

      let database = db.get(`trustedusers_${message.guild.id}`)
      if (database) {
        let data = database.find(x => x.user === user.id)
        let unabletofind = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`
          ** Unable To Find That User On DataBase!** 
          `)
          .setFooter(message.guild.name, guildicon)

        if (!data) return message.channel.send(unabletofind)

        let value = database.indexOf(data)
        delete database[value]

        var filter = database.filter(x => {
          return x != null && x != ''
        })

        db.set(`trustedusers_${message.guild.id}`, filter)
        let deleted = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`
          **Removed ${user} From Trusted Users!** 
          `)
          .setFooter(message.guild.name, guildicon)

        return message.channel.send({
          embeds: [deleted]
        });

      } else {
        message.channel.send(`That User IS Not On Trusted List`)
      }
    }

    message.channel.send(`Only Ownership Of The Guild Can Use That CMD!`)
  }
}

