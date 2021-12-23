const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trustedlist')
    .setDescription('Show The List Of WhiteList Users'),
  async execute(interaction) {


    let wordlist = new Discord.MessageEmbed()
      .setTitle(`${interaction.guild.name}'s WhiteList Users :`)
      .setColor('#85db61')
    let database = db.get(`trustedusers_${interaction.guild.id}`)
    if (database && database.length) {
      let array = []
      database.forEach(m => {
        array.push(`<@${m.user}>`)
      })

      wordlist.setDescription(array.join('\n\n'))
    }
    return interaction.reply({
      embeds: [wordlist]
    });

  },
};


