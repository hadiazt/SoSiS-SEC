const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trustedlist')
    .setDescription('Show The List Of WhiteList Users')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Mention The User')
        .setRequired(true)),
  async execute(interaction) {


    let wordlist = new Discord.MessageEmbed()
      .setTitle(`${interaction.guild.name}'s WhiteList Users :`)
    let database = db.get(`trustedusers_${message.guild.id}`)
    if (database && database.length) {
      let array = []
      database.forEach(m => {
        array.push(`<@${m.user}>`)
      })

      wordlist.description(`${array.join("\n")}`)
    }
    return interaction.reply({
      embeds: [wordlist]
    });

  },
};


