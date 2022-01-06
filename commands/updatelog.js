const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
var { readFileSync } = require('fs');
var VER = require('../package.json').version

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updatelog')
    .setDescription('Bot Update Log'),
  async execute(interaction, client) {

    try {
      var data = readFileSync('./data/log.txt', 'utf8');
      const updateembed = new Discord.MessageEmbed()
        .setTitle(`${client.user.tag}'s Update Log`)
        .addFields({ name: 'Current Version :', value: VER })
        .setDescription('```\n' + data.toString() + '\n```')
        .setTimestamp()
      return interaction.reply({
        embeds: [updateembed]
      });
    } catch (e) {
      console.log('Error : ', e.stack);
    }

  },
};


