const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('Set Guild Anit Raid Config')
    .addStringOption(option =>
      option.setName('config')
        .setDescription('Type Of Config')
        .setRequired(true)
        .addChoice('Set Role Create Limit', 'setrolecreatelimit',)
        .addChoice('Set Role Delete Limit', 'setroledeletelimit')
        .addChoice('Set Channel Create Limit', 'setchannelcreatelimit')
        .addChoice('Set Channel Delete Limit', 'setchanneldeletelimit')
        .addChoice('Set Ban Limit', 'setbanlimit')
        .addChoice('Set Kick Limit', 'setkicklimit'))
    .addNumberOption(option =>
      option.setName('num')
        .setDescription('Number Of Limit')
        .setRequired(true)),

  async execute(interaction) {

    var config = interaction.options.get('config').value
    var num = interaction.options.get('num').value

    let trustedusers = db.get(`trustedusers_${interaction.guild.id}`)
    if (trustedusers && trustedusers.find(find => find.user == interaction.user.id)) {
      if (config === 'setrolecreatelimit') {
        db.set(`rolecreatelimt_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> RoleCreation limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setroledeletelimit') {
        db.set(`roledeletelimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> RoleDelete limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setchannelcreatelimit') {
        db.set(`channelcreatelimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> ChannelCreation limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setchanneldeletelimit') {
        db.set(`channeldeletelimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> ChannelDelete limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setbanlimit') {
        db.set(`banlimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> Ban limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setkicklimit') {
        db.set(`kicklimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> Kick limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      var log = db.get(`acitonslogs_${interaction.guild.id}`)
      if (log !== null) log.send(`**${config}** Edited To **${num}** By ${interaction.user.tag}`)
    } else if (interaction.user.id === interaction.guild.ownerId) {
      if (config === 'setrolecreatelimit') {
        db.set(`rolecreatelimt_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> RoleCreation limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setroledeletelimit') {
        db.set(`roledeletelimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> RoleDelete limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setchannelcreatelimit') {
        db.set(`channelcreatelimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> ChannelCreation limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setchanneldeletelimit') {
        db.set(`channeldeletelimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> ChannelDelete limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setbanlimit') {
        db.set(`banlimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> Ban limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setkicklimit') {
        db.set(`kicklimts_${interaction.guild.id}`, num)
        let = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> Kick limits Has Been Set To ${num}`)
        return interaction.reply({
          embeds: [done]
        });
      }

      var log = db.get(`acitonslogs_${interaction.guild.id}`)
      if (log !== null) log.send(`**${config}** Edited To **${num}** By ${interaction.user.tag}`)
    }

    let owneronly = new Discord.MessageEmbed()
      .setColor('#f67975')
      .setTitle(`You Can't Use This Command!`)
      .setDescription('<:ignore:923151545569267752> Only **Server Owner** & **Trusted Users** Can Use This Command!')
    return interaction.reply({
      embeds: [owneronly]
    });

  },
};



