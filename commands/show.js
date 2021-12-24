const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
        data: new SlashCommandBuilder()
                .setName('show')
                .setDescription('Show The List Of Limits & Configs'),
        async execute(interaction) {

                let trustedusers = db.get(`trustedusers_${interaction.guild.id}`)

                let rolelimt = db.get(`rolecreatelimt_${interaction.guild.id}`)
                if (rolelimt === null) rolelimt = "<:disable:923158125878575144>"
                let roledelete = db.get(`roledeletelimts_${interaction.guild.id}`)
                if (roledelete === null) roledelete = "<:disable:923158125878575144>"
                let logschannel = db.get(`acitonslogs_${interaction.guild.id}`)
                if (logschannel === null) logschannel = "<:disable:923158125878575144>"
                else logschannel = `<#${logschannel}>`
                let channelcreatelimts = db.get(`channelcreatelimts_${interaction.guild.id}`)
                if (channelcreatelimts === null) channelcreatelimts = "<:disable:923158125878575144>"
                let channeldeletelimts = db.get(`channeldeletelimts_${interaction.guild.id}`)
                if (channeldeletelimts === null) channeldeletelimts = "<:disable:923158125878575144>"
                let banlimts = db.get(`banlimts_${interaction.guild.id}`)
                if (banlimts === null) banlimts = "<:disable:923158125878575144>"
                let kicklimts = db.get(`kicklimts_${interaction.guild.id}`)
                if (kicklimts === null) kicklimts = "<:disable:923158125878575144>"

                if (trustedusers && trustedusers.find(find => find.user == interaction.user.id)) {
                        let showembed = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setTitle('Anti-Nuke Limits:')
                                .addFields(
                                        { name: 'Role Create Limits', value: rolelimt, inline: true },
                                        { name: 'Role Delete Limits', value: roledelete, inline: true },
                                        { name: 'Channel Create Limits', value: channelcreatelimts, inline: true },
                                        { name: 'Channel Delete Limits', value: channeldeletelimts, inline: true },
                                        { name: 'Ban Limits', value: banlimts, inline: true },
                                        { name: 'Kick Limits', value: kicklimts, inline: true },
                                        { name: 'Aciton Log Channel', value: logschannel, inline: true },
                                )
                        return interaction.reply({
                                embeds: [showembed]
                        });
                } else if (interaction.user.id === interaction.guild.ownerId) {
                        let showembed = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setTitle('Anti-Nuke Limits:')
                                .addFields(
                                        { name: 'Role Create Limits', value: rolelimt, inline: true },
                                        { name: 'Role Delete Limits', value: roledelete, inline: true },
                                        { name: 'Channel Create Limits', value: channelcreatelimts, inline: true },
                                        { name: 'Channel Delete Limits', value: channeldeletelimts, inline: true },
                                        { name: 'Ban Limits', value: banlimts, inline: true },
                                        { name: 'Kick Limits', value: kicklimts, inline: true },
                                        { name: 'Aciton Log Channel', value: logschannel, inline: true },
                                )
                        return interaction.reply({
                                embeds: [showembed]
                        })
                }

                let owneronly = new Discord.MessageEmbed()
                        .setColor('#f67975')
                        .setTitle(`You Can't Use This Command!`)
                        .setDescription('<:ignore:923151545569267752> Only **Server Owner** & **Trusted Users** Can Use This Command!')
                return interaction.reply({
                        embeds: [owneronly]
                });
        }
};


