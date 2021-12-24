const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtrusted')
        .setDescription('Set Guild WhiteList')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Mention The User')
                .setRequired(true)),
    async execute(interaction, client) {

        if (interaction.user.id === interaction.guild.ownerId) {

            var user = interaction.options.getUser('user')
            var owneral = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`**GUILD Owners Are In WhiteList By Default**`)

            if (user.id === interaction.guild.ownerId) return interaction.reply({ embeds: [owneral] });

            var log = db.get(`acitonslogs_${interaction.guild.id}`)
            let trustedusers = db.get(`trustedusers_${interaction.guild.id}`)
            if (trustedusers && trustedusers.find(find => find.user == user.id)) {
                let existed = new Discord.MessageEmbed()
                    .setColor('#f67975')
                    .setTitle(`<:ignore:923151545569267752> **This User It's Already on Trusted List**`)
                return interaction.reply({
                    embeds: [existed]
                });
            }
            let data = {
                user: user.id
            }
            db.push(`trustedusers_${interaction.guild.id}`, data)

            let addedlog = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> **${user.tag} Added To Trusted List!**`)
            if (log) client.channels.cache.get(log).send({ embeds: [addedlog] });

            let added = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> **${user.tag} Added To Trusted List!**`)

            return interaction.reply({
                embeds: [added]
            });
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


