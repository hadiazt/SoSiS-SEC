const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")
const { OWNER } = require('../data/config.json')

module.exports = {
        data: new SlashCommandBuilder()
                .setName('show')
                .setDescription('Show The List Of Limits & Configs'),
        async execute(interaction) {

                let trustedusers = db.get(`trustedusers_${interaction.guild.id}`)
                let extraowners = db.get(`extraowners_${interaction.guild.id}`)

                let logschannel = db.get(`acitonslogs_${interaction.guild.id}`)
                if (logschannel) logschannel = `<:enable:923158125790494761> <#${logschannel}>`; else logschannel = "<:disable:923158125878575144>"

                let rolelimt = db.get(`rolecreatelimt_${interaction.guild.id}`)
                let roledelete = db.get(`roledeletelimts_${interaction.guild.id}`)
                let channelcreatelimts = db.get(`channelcreatelimts_${interaction.guild.id}`)
                let channeldeletelimts = db.get(`channeldeletelimts_${interaction.guild.id}`)
                let banlimts = db.get(`banlimts_${interaction.guild.id}`)
                let kicklimts = db.get(`kicklimts_${interaction.guild.id}`)
                if (rolelimt) rolelimt = '<:enable:923158125790494761> ' + rolelimt; else rolelimt = "<:disable:923158125878575144>"
                if (roledelete) roledelete = '<:enable:923158125790494761> ' + roledelete; else roledelete = "<:disable:923158125878575144>"
                if (channelcreatelimts) channelcreatelimts = '<:enable:923158125790494761> ' + channelcreatelimts; else channelcreatelimts = "<:disable:923158125878575144>"
                if (channeldeletelimts) channeldeletelimts = '<:enable:923158125790494761> ' + channeldeletelimts; else channeldeletelimts = "<:disable:923158125878575144>"
                if (banlimts) banlimts = '<:enable:923158125790494761> ' + banlimts; else banlimts = "<:disable:923158125878575144>"
                if (kicklimts) kicklimts = '<:enable:923158125790494761> ' + kicklimts; else kicklimts = "<:disable:923158125878575144>"

                let antibot = db.get(`addbot_${interaction.guild.id}`)
                let antievery = db.get(`every_${interaction.guild.id}`)
                let antiinv = db.get(`inv_${interaction.guild.id}`)
                let intiweblink = db.get(`weblink_${interaction.guild.id}`)
                let antimalware = db.get(`malware_${interaction.guild.id}`)
                if (antibot === 'true') antibot = '<:enable:923158125790494761> ** **'; else antibot = "<:disable:923158125878575144>";
                if (antievery === 'true') antievery = '<:enable:923158125790494761> ** **'; else antievery = "<:disable:923158125878575144>";
                if (antiinv === 'true') antiinv = '<:enable:923158125790494761> ** **'; else antiinv = "<:disable:923158125878575144>";
                if (intiweblink === 'true') intiweblink = '<:enable:923158125790494761> ** **'; else intiweblink = "<:disable:923158125878575144>";
                if (antimalware === 'true') antimalware = '<:enable:923158125790494761> ** **'; else antimalware = "<:disable:923158125878575144>";



                if (extraowners && extraowners.find(find => find.user == interaction.user.id)) {
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
                                        { name: '\u200B', value: '\u200B' },
                                        { name: 'Anti Bot', value: '** **' + antibot, inline: true },
                                        { name: 'Anti Everyone/here', value: '** **' + antievery, inline: true },
                                        { name: 'Anti Invite Link', value: '** **' + antiinv, inline: true },
                                        { name: 'Anti Website Link', value: '** **' + intiweblink, inline: true },
                                        { name: 'Anti Malware Link', value: '** **' + antimalware, inline: true },
                                )
                        return interaction.reply({
                                embeds: [showembed]
                        });
                } else if (trustedusers && trustedusers.find(find => find.user == interaction.user.id)) {
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
                                        { name: '\u200B', value: '\u200B' },
                                        { name: 'Anti Bot', value: '** **' + antibot, inline: true },
                                        { name: 'Anti Everyone/here', value: '** **' + antievery, inline: true },
                                        { name: 'Anti Invite Link', value: '** **' + antiinv, inline: true },
                                        { name: 'Anti Website Link', value: '** **' + intiweblink, inline: true },
                                        { name: 'Anti Malware Link', value: '** **' + antimalware, inline: true },
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
                                        { name: '\u200B', value: '\u200B' },
                                        { name: 'Anti Bot', value: '** **' + antibot, inline: true },
                                        { name: 'Anti Everyone/here', value: '** **' + antievery, inline: true },
                                        { name: 'Anti Invite Link', value: '** **' + antiinv, inline: true },
                                        { name: 'Anti Website Link', value: '** **' + intiweblink, inline: true },
                                        { name: 'Anti Malware Link', value: '** **' + antimalware, inline: true },
                                )
                        return interaction.reply({
                                embeds: [showembed]
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
};


