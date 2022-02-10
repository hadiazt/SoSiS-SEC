const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const { supportserver, INV , SRC} = require("../data/config.json")

module.exports = {
        data: new SlashCommandBuilder()
                .setName('info')
                .setDescription('Information About How Bot Works')
                .addStringOption(option =>
                        option.setName('type')
                                .setDescription('Type Of Info')
                                .setRequired(true)
                                .addChoice('Bot', 'Bot')
                                .addChoice('Anti Raid', 'Anti Raid')
                                .addChoice('Join Gate', 'Join Gate')
                                .addChoice('Anti Nuke', 'Anti Nuke')

                ),
        async execute(interaction, client) {

                let type = interaction.options.get('type').value

                const infobtn = new Discord.MessageActionRow().addComponents(
                        new Discord.MessageButton()
                                .setLabel('INVITE BOT')
                                .setStyle('LINK')
                                .setURL(INV),
                        new Discord.MessageButton()
                                .setLabel('SUPPORT SERVER')
                                .setStyle('LINK')
                                .setURL(supportserver),
                        new MessageButton()
                                .setLabel('SOURCE')
                                .setStyle('LINK')
                                .setURL(SRC),
                )

                const infoembed = new Discord.MessageEmbed()
                        .setColor('#85db61')

                if (type === 'Bot') {
                        infoembed.setTitle(`<:bell_emoji:914129896958205982> ${client.user.username}'s ${type} Info : `)
                        infoembed.setDescription(`
<:space:874678195843125278><:right:874690882417360986> Do Not Forget To Set AcitonLog For Server To Track What Trusted Users Are 

<:space:874678195843125278><:space:874678195843125278><:space:874678195843125278> Doing Or Informing About Users Warns Or Punishes

<:space:874678195843125278><:right:874690882417360986> Make Sure Bot Has `+ '`ADMINISTRATOR`' + ` Permission For Working Well

<:space:874678195843125278><:right:874690882417360986> All The Trusted Users Are WhiteList For All Actions And Extra Owners Can Modify Bot Guild Settings

Open Source LICENSE : [MIT] (https://github.com/hadiazt/SoSiS-SEC/blob/main/LICENSE)

** PUNISHS TYPE : **`)
                        infoembed.addFields(
                                { name: '\u200B', value: '\u200B' },
                                { name: '** Anti Raid **', value: '** DELETE MESSAGE **', inline: true },
                                { name: '** Join Gate **', value: '** KICK **', inline: true },
                                { name: '** Anti Nuke **', value: '** BAN **', inline: true },
                        )

                }
                if (type === 'Anti Raid') {
                        infoembed.setTitle(`<:bell_emoji:914129896958205982> ${client.user.username}'s ${type} Options : `)
                        infoembed.setDescription(
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Bot` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Mention Everyone/Here` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Discord Invite` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Website Link` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Malware Link` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti NSFW Link`
                        )

                }
                if (type === 'Join Gate') {
                        infoembed.setTitle(`<:bell_emoji:914129896958205982> ${client.user.username}'s ${type} Options : `)
                        infoembed.setDescription(
                                `\n\n<:space:874678195843125278><:right:874690882417360986> No Avatar Filter` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Account Age Filter 1 - 7 Days`
                        )
                }
                if (type === 'Anti Nuke') {
                        infoembed.setTitle(`<:bell_emoji:914129896958205982> ${client.user.username}'s ${type} Options : `)
                        infoembed.setDescription(
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Role Creation` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Role Delete` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Channel Creation` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Channel Delete` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Ban` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Kick`
                        )
                }
                return interaction.reply({ embeds: [infoembed], components: [infobtn] })
        }
}

