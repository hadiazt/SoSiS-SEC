const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
        data: new SlashCommandBuilder()
                .setName('clearuser')
                .setDescription('Clear Users Warns')
                .addUserOption(option =>
                        option.setName('user')
                                .setDescription('Mention The User')
                                .setRequired(true)),
        async execute(interaction, client) {

                var log = db.get(`acitonslogs_${interaction.guild.id}`)
                let trustedusers = db.get(`trustedusers_${interaction.guild.id}`)
                var user = interaction.options.getUser('user')
                if (trustedusers && trustedusers.find(find => find.user == interaction.user.id)) {
                        db.delete(`executer_${interaction.guild.id}_${user.id}_kicklimts`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_banlimts`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_rolecreate`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_roledelete`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_channelcreate`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_channeldelete`)

                        let removedwarn = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setDescription(`<:check:923151545401479179> Removed ${user.tag} **Warns** By ${interaction.user.tag}`)
                        if (log) client.channels.cache.get(log).send({ embeds: [removedwarn] });


                        let restor = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setDescription(`<:check:923151545401479179> Removed ${user.tag} **Warns** By ${interaction.user.tag}`)

                        return interaction.reply({
                                embeds: [restor]
                        });
                } else if (interaction.user.id === interaction.guild.ownerId) {
                        db.delete(`executer_${interaction.guild.id}_${user.id}_kicklimts`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_banlimts`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_rolecreate`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_roledelete`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_channelcreate`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_channeldelete`)

                        let removedwarn = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setDescription(`<:check:923151545401479179> Removed ${user.tag} **Warns** By ${interaction.user.tag}`)
                        if (log) client.channels.cache.get(log).send({ embeds: [removedwarn] });

                        let restor = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setDescription(`<:check:923151545401479179> Removed ${user.tag} **Warns** By ${interaction.user.tag}`)

                        return interaction.reply({
                                embeds: [restor]
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




