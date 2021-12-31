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
                let roledelete = db.get(`roledeletelimts_${interaction.guild.id}`)
                let channelcreatelimts = db.get(`channelcreatelimts_${interaction.guild.id}`)
                let channeldeletelimts = db.get(`channeldeletelimts_${interaction.guild.id}`)
                let banlimts = db.get(`banlimts_${interaction.guild.id}`)
                let kicklimts = db.get(`kicklimts_${interaction.guild.id}`)
                let logschannel = db.get(`acitonslogs_${interaction.guild.id}`)

                if (rolelimt) rolelimt = '<:enable:923158125790494761> ' + rolelimt; else rolelimt = "<:disable:923158125878575144>"
                if (roledelete) roledelete = '<:enable:923158125790494761> ' + roledelete; else roledelete = "<:disable:923158125878575144>"
                if (channelcreatelimts) channelcreatelimts = '<:enable:923158125790494761> ' + channelcreatelimts; else channelcreatelimts = "<:disable:923158125878575144>"
                if (channeldeletelimts) channeldeletelimts = '<:enable:923158125790494761> ' + channeldeletelimts; else channeldeletelimts = "<:disable:923158125878575144>"
                if (banlimts) banlimts = '<:enable:923158125790494761> ' + banlimts; else banlimts = "<:disable:923158125878575144>"
                if (kicklimts) kicklimts = '<:enable:923158125790494761> ' + kicklimts; else kicklimts = "<:disable:923158125878575144>"

                if (logschannel) logschannel = `<:enable:923158125790494761> <#${logschannel}>`; else logschannel = "<:disable:923158125878575144>"


                if (trustedusers && trustedusers.find(find => find.user == interaction.user.id)) {
                        let showembed = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setTitle('Anti-Nuke Limits:')
                                .addFields(
                                        { name: 'Role Create Limits', value: '** **' + rolelimt, inline: true },
                                        { name: 'Role Delete Limits', value: '** **' + roledelete, inline: true },
                                        { name: 'Channel Create Limits', value: '** **' + channelcreatelimts, inline: true },
                                        { name: 'Channel Delete Limits', value: '** **' + channeldeletelimts, inline: true },
                                        { name: 'Ban Limits', value: '** **' + banlimts, inline: true },
                                        { name: 'Kick Limits', value: '** **' + kicklimts, inline: true },
                                        { name: 'Aciton Log Channel', value: '** **' + logschannel, inline: true },
                                )
                        return interaction.reply({
                                embeds: [showembed]
                        });
                } else if (interaction.user.id === interaction.guild.ownerId || interaction.user.id === OWNER) {
                        let showembed = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setTitle('Anti-Nuke Limits:')
                                .addFields(
                                        { name: 'Role Create Limits', value: '** **' + rolelimt, inline: true },
                                        { name: 'Role Delete Limits', value: '** **' + roledelete, inline: true },
                                        { name: 'Channel Create Limits', value: '** **' + channelcreatelimts, inline: true },
                                        { name: 'Channel Delete Limits', value: '** **' + channeldeletelimts, inline: true },
                                        { name: 'Ban Limits', value: '** **' + banlimts, inline: true },
                                        { name: 'Kick Limits', value: '** **' + kicklimts, inline: true },
                                        { name: 'Aciton Log Channel', value: '** **' + logschannel, inline: true },
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


