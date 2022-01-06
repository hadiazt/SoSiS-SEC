const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const { supportserver, INV } = require("../data/config.json")

module.exports = {
        data: new SlashCommandBuilder()
                .setName('info')
                .setDescription('Information About How Bot Works'),
        async execute(interaction, client) {
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
                        .setTitle(`${client.user.username}'s Panel : `)
                        .setDescription(`
**<:bell_emoji:914129896958205982> General Information :**
<:space:874678195843125278><:right:874690882417360986> Do Not Forget To Set AcitonLog For Server To Track What Trusted Users Are 
<:space:874678195843125278><:space:874678195843125278><:space:874678195843125278> Doing Or Informing About Users Warns Or Punishes
<:space:874678195843125278><:right:874690882417360986> Make Sure Bot Has `+ '`ADMINISTRATOR`' + ` Permission For Working Well
<:space:874678195843125278><:right:874690882417360986> All The Trusted Users Can Delete/Create/Ban/Kick And Extra Owners Can Modify Bot Guild Settings
**<:perm:923904697423777792> Commands Permission List :**`+
                                `\n\n<:space:874678195843125278><:right:874690882417360986> addtrusted (user) [Guild Owner] ` +
                                '\n`For Adding Guild Trusted Users`' +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> removetrusted (user) [Guild Owner]` +
                                '\n`For Removing Guild Trusted Users`' +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> set (type) (limit) [Guild Owner & Guild Extra Owners]` +
                                '\n`For Setting Aciton Limits`' +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> anti (type) (ON/OFF) [Guild Owner & Guild Extra Owners]` +
                                '\n`For Setting Anti Raid`' +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> acitonlog (channel) [Guild Owner & Guild Extra Owners]` +
                                '\n`For Tracking Users Acitons`' +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> clearuser (user) [Guild Owner & Guild Extra Owners]` +
                                '\n`For Removing User Active Warns (All Warns Resets Every Minute)`' +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> show [Guild Owner & Guild Extra Owners & Guild Trusted Users]` +
                                '\n`Shows Guild Aciton Limits And AcitonLog If Defined`' +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> trustedlist [everyone]`+
                                '\n`Shows Guild Trusted Users`' +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> status [everyone]`+
                                '\n`Shows Bot Status`' +
                                `\n\n<:space:874678195843125278><:right:874690882417360986> updatelog [everyone]`+
                                '\n`Shows Bot Update Log`' +
                                ``)
                return interaction.reply({ embeds: [infoembed], components: [infobtn] })
        }
}




