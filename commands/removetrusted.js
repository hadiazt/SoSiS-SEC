const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removetrusted')
    .setDescription('Remove Guild WhiteList')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Mention The User')
        .setRequired(true)),
  async execute(interaction) {

    if (message.author.id === message.guild.ownerId) {


      var user = interaction.options.get('user').value

      let database = db.get(`trustedusers_${message.guild.id}`)
      if (database) {
        let data = database.find(x => x.user === user.id)
        let unabletofind = new Discord.MessageEmbed()
          .setColor('#f67975')
          .setDescription(`<:ignore:923151545569267752>** Unable To Find That User On DataBase!** `)

        if (!data) return message.channel.send(unabletofind)

        let value = database.indexOf(data)
        delete database[value]

        var filter = database.filter(x => {
          return x != null && x != ''
        })

        db.set(`trustedusers_${message.guild.id}`, filter)
        let deleted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **Successfully Removed ${user} From Trusted Users!** `)

        return message.channel.send({
          embeds: [deleted]
        });

      } else {
        let notwl = new Discord.MessageEmbed()
          .setColor('#f67975')
          .setDescription(`<:ignore:923151545569267752> That User IS Not On Trusted List!`)
        return interaction.reply({
          embeds: [notwl]
        });
      }
    }

    let owneronly = new Discord.MessageEmbed()
      .setColor('#f67975')
      .setTitle(`You Can't Use This Command!`)
      .setDescription('<:ignore:923151545569267752> Only **Server Owner** Can Use This Command!')
    return interaction.reply({
      embeds: [owneronly]
    });

  },
};
