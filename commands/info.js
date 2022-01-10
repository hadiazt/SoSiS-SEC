const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const { supportserver, INV } = require("../data/config.json")

module.exports = {
        data: new SlashCommandBuilder()
                .setName('info')
                .setDescription('Information About How Bot Works')
                .addStringOption(option =>
                        option.setName('type')
                                .setDescription('Type Of Info')
                                .setRequired(true)
                                .addChoice('Bot', 'bot')
                                .addChoice('Anti Raid', 'ar')
                                .addChoice('Join Gate', 'jg')
                                .addChoice('Anti Nuke', 'an')

                ),
        async execute(interaction, client) {

                let namev = interaction.option.get('type').name
                let type = interaction.option.get('type').value

                const infobtn = new Discord.MessageActionRow().addComponents(
                        new Discord.MessageButton()
                                .setLabel('INVITE BOT')
                                .setStyle('LINK')
                                .setURL(INV),
                        new Discord.MessageButton()
                                .setLabel('SUPPORT SERVER')
                                .setStyle('LINK')
                                .setURL(supportserver),
                )

                const infoembed = new Discord.MessageEmbed()
                        .setColor('#85db61')

                if (type === 'bot') {
                        infoembed.setTitle(`<:bell_emoji:914129896958205982> ${client.user.username}'s ${namev} Info : `)
                        infoembed.setDescription(`
<:space:874678195843125278><:right:874690882417360986> Do Not Forget To Set AcitonLog For Server To Track What Trusted Users Are 

<:space:874678195843125278><:space:874678195843125278><:space:874678195843125278> Doing Or Informing About Users Warns Or Punishes

<:space:874678195843125278><:right:874690882417360986> Make Sure Bot Has `+ '`ADMINISTRATOR`' + ` Permission For Working Well

<:space:874678195843125278><:right:874690882417360986> All The Trusted Users Are WhiteList For All Actions And Extra Owners Can Modify Bot Guild Settings

** PUNISHS TYPE : **`)
                        infoembed.addFields(
                                { name: '\u200B', value: '\u200B' },
                                { name: '** Anti Raid **', value: '** DELETE MESSAGE **', inline: true },
                                { name: '** Join Gate **', value: '** KICK **', inline: true },
                                { name: '** Anti Nuke **', value: '** BAN **', inline: true },
                        )

                }
                if (type === 'ar') {
                        infoembed.setTitle(`<:bell_emoji:914129896958205982> ${client.user.username}'s ${namev} Options : `)
                        infoembed.setDescription(
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Bot` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Mention Everyone/Here` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Discord Invite` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Website Link` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti Malware Link` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Anti NSFW Link`
                        )

                }
                if (type === 'jg') {
                        infoembed.setTitle(`<:bell_emoji:914129896958205982> ${client.user.username}'s ${namev} Options : `)
                        infoembed.setDescription(
                                `\n\n<:space:874678195843125278><:right:874690882417360986> No Avatar Filter` +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> Account Age Filter 1 - 7 Days`
                        )
                }
                if (type === 'an') {
                        infoembed.setTitle(`<:bell_emoji:914129896958205982> ${client.user.username}'s ${namev} Options : `)
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

