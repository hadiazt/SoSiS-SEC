const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('actionlog')
        .setDescription('Set Server Aciton Log')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Mention The Channel')
                .setRequired(true)),
    async execute(interaction) {

        let trustedusers = db.get(`trustedusers_${interaction.guild.id}`)
        var logs = interaction.options.getChannel('channel')

        if (trustedusers && trustedusers.find(find => find.user == interaction.user.id)) {
            db.set(`acitonslogs_${interaction.guild.id}`, logs.id)
            let done = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> Well Done Aciton-Logs Channel Has Been Set To <#${logs.id}>`)
            return interaction.reply({
                embeds: [done]
            });
        } else if (interaction.user.id === interaction.guild.ownerId) {
            db.set(`acitonslogs_${interaction.guild.id}`, logs.id)
            let done = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> Well Done Aciton-Logs Channel Has Been Set To <#${logs.id}>`)
            return interaction.reply({
                embeds: [done]
            });
        }


        let owneronly = new Discord.MessageEmbed()
            .setColor('#f67975')
            .setTitle(`You Can't Use This Command!`)
            .setDescription('<:ignore:923151545569267752> Only **Server Owner** & **Trusted Users** Can Use This Command!')
        return interaction.reply({
            embeds: [owneronly]
        });
    }
}




