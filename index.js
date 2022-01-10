const Discord = require('discord.js')
const client = new Discord.Client({
    intents: '14079',
    disableMentions: 'everyone',
})

const db = require('quick.db')
const { readdirSync } = require('fs');
const CONFIG = require('./data/config.json')
client.login(CONFIG.TOKEN)
const { GIFS } = require('./data/config.json')
const { NSFW } = require('./data/links.json')
var VER = require('./package.json').version

client.on('ready', () => {
    setInterval(() => {
        client.user.setPresence({
            status: 'dnd',
            activities: [{
                type: 'WATCHING',
                name: `${client.guilds.cache.size} GUILDS | /info | V ${VER}`,
            }]
        });
        // ------------------------------------
        var DATAS = db.all()
        DATAS.forEach(DATA => {
            if (DATA.ID.startsWith('executer_')) {
                db.delete(DATA.ID)
            }
        });
    }, 60000);



    console.log('--------------------------');
    console.log(`CONNECTED TO : ${client.user.tag}`);
});

// --------------------------------------------
client.on('guildCreate', async guild => {
    let JoinEmbed = new Discord.MessageEmbed()
        .setDescription('**<:space:874678195843125278><:right:874690882417360986> A New Guild Has Been Submited**')
        .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
        .setColor('#0fe694')
    client.channels.cache.get(CONFIG.JOIN).send({ embeds: [JoinEmbed] });
});
// --------------------------------------------
client.on('guildDelete', async guild => {
    let LeftEmbed = new Discord.MessageEmbed()
        .setDescription('**<:space:874678195843125278><:right:874690882417360986> A Guild Has Been Removed **')
        .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
        .setColor('#ff0000')
    client.channels.cache.get(CONFIG.JOIN).send({ embeds: [LeftEmbed] });
});
// --------------------------------------------

client.commands = new Discord.Collection();
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
console.log('------------- LOADING COMMANDS -------------');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(command.data.name + ' LOADED');
}

// --------------------------------------------

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    let logs = db.get(`acitonslogs_${interaction.guild.id}`)
    if (!command) return;
    try {
        if (interaction.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {
            if (logs) {
                await command.execute(interaction, client);
                client.channels.cache.get(CONFIG.ACTION).send('```\n' + `${interaction.commandName} Triggerd In ${interaction.guild.name} | ${interaction.channel.name} By ${interaction.user.tag}` + '\n```')
            } else if (command.data.name === 'actionlog') {
                await command.execute(interaction, client);
                client.channels.cache.get(CONFIG.ACTION).send('```\n' + `${interaction.commandName} Triggerd In ${interaction.guild.name} | ${interaction.channel.name} By ${interaction.user.tag}` + '\n```')
            } else {
                let setlog = new Discord.MessageEmbed()
                    .setColor('#f67975')
                    .setTitle(`<:ignore:923151545569267752> ${interaction.guild.name} Log Not Found`)
                    .setDescription('Please Use `/actionlog` For Setting Log')
                return interaction.reply({ embeds: [setlog] });

            }
        } else {
            let missingperm = new Discord.MessageEmbed()
                .setColor('#f67975')
                .setTitle(`<:ignore:923151545569267752> Missings Permission`)
                .setDescription('Please Make Sure I Have `ADMINISTRATOR` Permission')
            return interaction.reply({ embeds: [missingperm] });
        }
    } catch (error) {
        console.error(error);
        client.channels.cache.get(CONFIG.ERROR).send('```\n' + error + '\n```')
        return interaction.reply({ content: `There was an error while executing this command!\nAsk Developers In : ${CONFIG.supportserver}`, ephemeral: true });
    }
});

// -----------------------------------------

client.on("roleCreate", async role => {
    if (role.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {

        const user = await role.guild.fetchAuditLogs({
            type: 'ROLE_CREATE'
        }).then(audit => audit.entries.first())

        const entry = user.executor
        let trustedusers = db.get(`trustedusers_${role.guild.id}`)
        let extraowners = db.get(`extraowners_${role.guild.id}`)
        let logs = db.get(`acitonslogs_${role.guild.id}`)

        if (entry.id === role.guild.ownerId || entry.id === client.user.id) {
            return;
        }

        if (extraowners && extraowners.find(find => find.user == entry.id)) {
            let trustedac = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setTitle(`<:check:923151545401479179> ${entry.tag} Created An Role But He/She Is In Extra Owner`)
            return client.channels.cache.get(logs).send({ embeds: [trustedac] });
        }
        if (trustedusers && trustedusers.find(find => find.user == entry.id)) {
            let trustedac = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setTitle(`<:check:923151545401479179> ${entry.tag} Created An Role But He/She Is In Trusted Users`)
            return client.channels.cache.get(logs).send({ embeds: [trustedac] });
        }



        let author = db.get(`executer_${role.guild.id}_${entry.id}_rolecreate`)
        let limts = db.get(`rolecreatelimt_${role.guild.id}`)

        if (limts === null && logs) {
            let nolimit = new Discord.MessageEmbed()
                .setColor('#f67975')
                .setTitle(`<:ignore:923151545569267752> ${entry.tag} Created A Role But No Limit Found To Punish`)
                .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
            return client.channels.cache.get(logs).send({ embeds: [nolimit] });
        }

        if (author >= limts && logs) {
            db.delete(`executer_${role.guild.id}_${entry.id}_rolecreate`)
            role.guild.members.ban(entry.id).then(a => {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#00008b')
                    .setTitle(`<:perm:923904697423777792> ${entry.tag} Was Trying To Raid But Failed Miserabely [Breaking Roles Create Limits]`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            }).catch(e => {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#f67975')
                    .setTitle(`<:perm:923904697423777792> ${entry.tag} Is Raiding But Failed To Ban Him/Her`)
                    .setDescription('** **\n```\n' + e + '\n```')
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            })
        }

        db.add(`executer_${role.guild.id}_${entry.id}_rolecreate`, 1)
        if (logs) {
            let logsembed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(`<:erorr:878139495764090880> ${entry.tag} Is Creating Role [${author || 0} /${limts || 0}]`)
                .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
            return client.channels.cache.get(logs).send({ embeds: [logsembed] });
        }
    }
});

// --------------------------------------------

client.on("roleDelete", async role => {
    if (role.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {

        const user = await role.guild.fetchAuditLogs({
            type: 'ROLE_DELETE'
        }).then(audit => audit.entries.first())

        const entry = user.executor
        let trustedusers = db.get(`trustedusers_${role.guild.id}`)
        let extraowners = db.get(`extraowners_${role.guild.id}`)
        let logs = db.get(`acitonslogs_${role.guild.id}`)

        if (entry.id === role.guild.ownerId || entry.id === client.user.id) {
            return;
        }

        if (extraowners && extraowners.find(find => find.user == entry.id)) {
            let trustedac = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setTitle(`<:check:923151545401479179> ${entry.tag} Deleted An Role But He/She Is In Extra Owner`)
            return client.channels.cache.get(logs).send({ embeds: [trustedac] });
        }
        if (trustedusers && trustedusers.find(find => find.user == entry.id)) {
            let trustedac = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setTitle(`<:check:923151545401479179> ${entry.tag} Deleted An Role But He/She Is In Trusted Users`)
            return client.channels.cache.get(logs).send({ embeds: [trustedac] });
        }

        let author = db.get(`executer_${role.guild.id}_${entry.id}_roledelete`)
        let limts = db.get(`roledeletelimt_${role.guild.id}`)

        if (limts === null && logs) {
            let nolimit = new Discord.MessageEmbed()
                .setColor('#f67975')
                .setTitle(`<:ignore:923151545569267752> ${entry.tag} Deleted A Role But No Limit Found To Punish`)
                .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
            return client.channels.cache.get(logs).send({ embeds: [nolimit] });
        }

        if (author >= limts && logs) {
            db.delete(`executer_${role.guild.id}_${entry.id}_roledelete`)
            role.guild.members.ban(entry.id).then(a => {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#00008b')
                    .setTitle(`<:perm:923904697423777792> ${entry.tag} Was Trying To Raid But Failed Miserabely [Breaking Roles Delete Limits]`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            }).catch(e => {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#f67975')
                    .setTitle(`<:perm:923904697423777792> ${entry.tag} Is Raiding But Failed To Ban Him/Her`)
                    .setDescription('** **\n```\n' + e + '\n```')
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            })
        }

        db.add(`executer_${role.guild.id}_${entry.id}_roledelete`, 1)
        if (logs) {
            let logsembed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(`<:erorr:878139495764090880> ${entry.tag} Is Deleting Role [${author || 0} /${limts || 0}]`)
                .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
            return client.channels.cache.get(logs).send({ embeds: [logsembed] });
        }
    }
});

// --------------------------------------------

client.on("channelCreate", async channel => {
    if (channel.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {

        const user = await channel.guild.fetchAuditLogs({
            type: 'CHANNEL_CREATE'
        }).then(audit => audit.entries.first())

        const entry = user.executor
        let trustedusers = db.get(`trustedusers_${channel.guild.id}`)
        let extraowners = db.get(`extraowners_${channel.guild.id}`)
        let logs = db.get(`acitonslogs_${channel.guild.id}`)

        if (entry.id === channel.guild.ownerId || entry.id === client.user.id) {
            return;
        }

        if (extraowners && extraowners.find(find => find.user == entry.id)) {
            let trustedac = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setTitle(`<:check:923151545401479179> ${entry.tag} Created An Channel But He/She Is In Extra Owner`)
            return client.channels.cache.get(logs).send({ embeds: [trustedac] });
        }
        if (trustedusers && trustedusers.find(find => find.user == entry.id)) {
            let trustedac = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setTitle(`<:check:923151545401479179> ${entry.tag} Created An Channel But He/She Is In Trusted Users`)
            return client.channels.cache.get(logs).send({ embeds: [trustedac] });
        }

        let author = db.get(`executer_${channel.guild.id}_${entry.id}_channelcreate`)
        let limts = db.get(`channelcreatelimts_${channel.guild.id}`)

        if (limts === null && logs) {
            let nolimit = new Discord.MessageEmbed()
                .setColor('#f67975')
                .setTitle(`<:ignore:923151545569267752> ${entry.tag} Created A Channel But No Limit Found To Punish`)
                .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
            return client.channels.cache.get(logs).send({ embeds: [nolimit] });
        }

        if (author >= limts && logs) {
            db.delete(`executer_${channel.guild.id}_${entry.id}_channelcreate`)
            channel.guild.members.ban(entry.id).then(a => {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#00008b')
                    .setTitle(`<:perm:923904697423777792> ${entry.tag} Was Trying To Raid But Failed Miserabely [Breaking Channel Create Limits]`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            }).catch(e => {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#f67975')
                    .setTitle(`<:perm:923904697423777792> ${entry.tag} Is Raiding But Failed To Ban Him/Her`)
                    .setDescription('** **\n```\n' + e + '\n```')
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            })
        }

        db.add(`executer_${channel.guild.id}_${entry.id}_channelcreate`, 1)
        if (logs) {
            let logsembed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(`<:erorr:878139495764090880> ${entry.tag} Is Creating Channel [${author || 0} /${limts || 0}]`)
                .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
            return client.channels.cache.get(logs).send({ embeds: [logsembed] });
        }
    }
});

// --------------------------------------------

client.on("channelDelete", async channel => {
    if (channel.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {

        const user = await channel.guild.fetchAuditLogs({
            type: 'CHANNEL_DELETE'
        }).then(audit => audit.entries.first())

        const entry = user.executor
        let trustedusers = db.get(`trustedusers_${channel.guild.id}`)
        let extraowners = db.get(`extraowners_${channel.guild.id}`)
        let logs = db.get(`acitonslogs_${channel.guild.id}`)

        if (entry.id === channel.guild.ownerId || entry.id === client.user.id) {
            return;
        }

        if (extraowners && extraowners.find(find => find.user == entry.id)) {
            let trustedac = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setTitle(`<:check:923151545401479179> ${entry.tag} Deleted An Channel But He/She Is In Extra Owner`)
            return client.channels.cache.get(logs).send({ embeds: [trustedac] });
        }
        if (trustedusers && trustedusers.find(find => find.user == entry.id)) {
            let trustedac = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setTitle(`<:check:923151545401479179> ${entry.tag} Deleted An Channel But He/She Is In Trusted Users`)
            return client.channels.cache.get(logs).send({ embeds: [trustedac] });
        }


        let author = db.get(`executer_${channel.guild.id}_${entry.id}_channeldelete`)
        let limts = db.get(`channeldeletelimts_${channel.guild.id}`)

        if (limts === null && logs) {
            let nolimit = new Discord.MessageEmbed()
                .setColor('#f67975')
                .setTitle(`<:ignore:923151545569267752> ${entry.tag} Deleted A Channel But No Limit Found To Punish`)
                .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
            return client.channels.cache.get(logs).send({ embeds: [nolimit] });
        }

        if (author >= limts && logs) {
            db.delete(`executer_${channel.guild.id}_${entry.id}_channeldelete`)
            channel.guild.members.ban(entry.id).then(a => {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#00008b')
                    .setTitle(`<:perm:923904697423777792> ${entry.tag} Was Trying To Raid But Failed Miserabely [Breaking Channel Delete Limits]`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            }).catch(e => {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#f67975')
                    .setTitle(`<:perm:923904697423777792> ${entry.tag} Is Raiding But Failed To Ban Him/Her`)
                    .setDescription('** **\n```\n' + e + '\n```')
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            })


        }

        db.add(`executer_${channel.guild.id}_${entry.id}_channeldelete`, 1)
        if (logs) {
            let logsembed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(`<:erorr:878139495764090880> ${entry.tag} Is Deleting Channel [${author || 0} /${limts || 0}]`)
                .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
            return client.channels.cache.get(logs).send({ embeds: [logsembed] });
        }
    }
});

// --------------------------------------------

client.on("guildMemberRemove", async member => {
    if (member.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {
        const entry1 = await member.guild
            .fetchAuditLogs()
            .then(audit => audit.entries.first());
        if (entry1.action === "MEMBER_KICK") {
            const entry2 = await member.guild
                .fetchAuditLogs({
                    type: "MEMBER_KICK"
                })
                .then(audit => audit.entries.first());
            const entry = entry2.executor;

            let trustedusers = db.get(`trustedusers_${member.guild.id}`)
            let extraowners = db.get(`extraowners_${member.guild.id}`)
            let logs = db.get(`acitonslogs_${member.guild.id}`)

            if (entry.id === member.guild.ownerId || entry.id === client.user.id) {
                return;
            }

            if (extraowners && extraowners.find(find => find.user == entry.id)) {
                let trustedac = new Discord.MessageEmbed()
                    .setColor('#85db61')
                    .setTitle(`<:check:923151545401479179> ${entry.tag} Kicked An Member But He/She Is In Extra Owner`)
                return client.channels.cache.get(logs).send({ embeds: [trustedac] });
            }

            if (trustedusers && trustedusers.find(find => find.user == entry.id)) {
                let trustedac = new Discord.MessageEmbed()
                    .setColor('#85db61')
                    .setTitle(`<:check:923151545401479179> ${entry.tag} Kicked An Member But He/She Is In Trusted Users`)
                return client.channels.cache.get(logs).send({ embeds: [trustedac] });
            }

            let author = db.get(`executer_${member.guild.id}_${entry.id}_kicklimts`)
            let limts = db.get(`kicklimts_${member.guild.id}`)

            if (limts === null && logs) {
                let nolimit = new Discord.MessageEmbed()
                    .setColor('#f67975')
                    .setTitle(`<:ignore:923151545569267752> ${entry.tag} Kicked An Member But No Limit Found To Punish`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [nolimit] });
            }

            if (author >= limts && logs) {
                db.delete(`executer_${member.guild.id}_${entry.id}_kicklimts`)
                member.guild.members.ban(entry.id).then(a => {
                    let logsembed = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${entry.tag} Was Trying To Raid But Failed Miserabely [Breaking Kick Limits]`)
                        .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                    return client.channels.cache.get(logs).send({ embeds: [logsembed] });
                }).catch(e => {
                    let logsembed = new Discord.MessageEmbed()
                        .setColor('#f67975')
                        .setTitle(`<:perm:923904697423777792> ${entry.tag} Is Raiding But Failed To Ban Him/Her`)
                        .setDescription('** **\n```\n' + e + '\n```')
                    return client.channels.cache.get(logs).send({ embeds: [logsembed] });
                })
            }


            db.add(`executer_${member.guild.id}_${entry.id}_kicklimts`, 1)
            if (logs) {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle(`<:erorr:878139495764090880> ${entry.tag} Is Kicking Memeber [${author || 0} /${limts || 0}]`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            }
        }
    }
})

// --------------------------------------------

client.on("guildMemberRemove", async member => {
    if (member.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {

        const entry1 = await member.guild
            .fetchAuditLogs()
            .then(audit => audit.entries.first());
        if (entry1.action === "MEMBER_BAN_ADD") {
            const entry2 = await member.guild
                .fetchAuditLogs({
                    type: "MEMBER_BAN_ADD"
                })
                .then(audit => audit.entries.first());
            const entry = entry2.executor;

            if (entry.id === member.guild.ownerId || entry.id === client.user.id) {
                return;
            }

            let trustedusers = db.get(`trustedusers_${member.guild.id}`)
            let extraowners = db.get(`extraowners_${member.guild.id}`)
            let logs = db.get(`acitonslogs_${member.guild.id}`)

            if (extraowners && extraowners.find(find => find.user == entry.id)) {
                let trustedac = new Discord.MessageEmbed()
                    .setColor('#85db61')
                    .setTitle(`<:check:923151545401479179> ${entry.tag} Banned An Member But He/She Is In Extra Owner`)
                return client.channels.cache.get(logs).send({ embeds: [trustedac] });
            }

            if (trustedusers && trustedusers.find(find => find.user == entry.id)) {
                let trustedac = new Discord.MessageEmbed()
                    .setColor('#85db61')
                    .setTitle(`<:check:923151545401479179> ${entry.tag} Banned An Member But He/She Is In Trusted Users`)
                return client.channels.cache.get(logs).send({ embeds: [trustedac] });
            }

            let author = db.get(`executer_${member.guild.id}_${entry.id}_banlimts`)
            let limts = db.get(`banlimts_${member.guild.id}`)

            if (limts === null && logs) {
                let nolimit = new Discord.MessageEmbed()
                    .setColor('#f67975')
                    .setTitle(`<:ignore:923151545569267752> ${entry.tag} Banned A Member But No Limit Found To Punish`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [nolimit] });
            }

            if (author >= limts && logs) {
                db.delete(`executer_${member.guild.id}_${entry.id}_banlimts`)
                member.guild.members.ban(entry.id).then(a => {
                    let logsembed = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${entry.tag} Was Trying To Raid But Failed Miserabely [Breaking Ban Limits]`)
                        .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                    return client.channels.cache.get(logs).send({ embeds: [logsembed] });
                }).catch(e => {
                    let logsembed = new Discord.MessageEmbed()
                        .setColor('#f67975')
                        .setTitle(`<:perm:923904697423777792> ${entry.tag} Is Raiding But Failed To Ban Him/Her`)
                        .setDescription('** **\n```\n' + e + '\n```')
                    return client.channels.cache.get(logs).send({ embeds: [logsembed] });
                })
            }

            db.add(`executer_${member.guild.id}_${entry.id}_banlimts`, 1)
            if (logs) {
                let logsembed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle(`<:erorr:878139495764090880> ${entry.tag} Is Banning Member [${author || 0} /${limts || 0}]`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            }
        }
    }
})

// --------------------------------------------

client.on("guildMemberAdd", async member => {
    if (member.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {

        const entry1 = await member.guild
            .fetchAuditLogs()
            .then(audit => audit.entries.first());
        if (entry1.action === "BOT_ADD") {
            const entry2 = await member.guild
                .fetchAuditLogs({
                    type: "BOT_ADD"
                })
                .then(audit => audit.entries.first());
            const entry = entry2.executor;

            let trustedusers = db.get(`trustedusers_${member.guild.id}`)
            let extraowners = db.get(`extraowners_${member.guild.id}`)
            let logs = db.get(`acitonslogs_${member.guild.id}`)
            let value = db.get(`addbot_${member.guild.id}`)

            if (value === "true" && logs) {
                if (entry.id === member.guild.ownerId || entry.id === client.user.id) {
                    return;
                }
                if (extraowners && extraowners.find(find => find.user == entry.id)) {
                    let trustedac = new Discord.MessageEmbed()
                        .setColor('#85db61')
                        .setTitle(`<:check:923151545401479179> ${entry.tag} Added A Bot But He/She Is In Extra Owner`)
                        .setDescription(`<:bell_emoji:914129896958205982> **Details :**
<:space:874678195843125278><:right:874690882417360986> User : <@${entry.id}>` + '`[' + entry.tag + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Bot : <@${member.user.id}>` + '`[' + member.user.tag + ']`' + `
`)
                    return client.channels.cache.get(logs).send({ embeds: [trustedac] });
                }

                if (trustedusers && trustedusers.find(find => find.user == entry.id)) {
                    let trustedac = new Discord.MessageEmbed()
                        .setColor('#85db61')
                        .setTitle(`<:check:923151545401479179> ${entry.tag} Added A Bot But He/She Is In Trusted Users`)
                        .setDescription(`<:bell_emoji:914129896958205982> **Details :**
<:space:874678195843125278><:right:874690882417360986> User : <@${entry.id}>` + '`[' + entry.tag + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Bot : <@${member.user.id}>` + '`[' + member.user.tag + ']`' + `
`)
                    return client.channels.cache.get(logs).send({ embeds: [trustedac] });
                }

                member.guild.members.ban(member.id)
                member.guild.members.ban(entry.id).then(a => {
                    let logsembed = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${entry.tag} Was Trying To Raid But Failed Miserabely [Added A Bot]`)
                        .setDescription(`<:bell_emoji:914129896958205982> **Details :**
<:space:874678195843125278><:right:874690882417360986> User : <@${entry.id}>` + '`[' + entry.tag + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Bot : <@${member.user.id}>` + '`[' + member.user.tag + ']`' + `
`)
                        .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                    return client.channels.cache.get(logs).send({ embeds: [logsembed] });
                }).catch(e => {
                    let logsembed = new Discord.MessageEmbed()
                        .setColor('#f67975')
                        .setTitle(`<:perm:923904697423777792> ${entry.tag} Is Adding Bot But Failed To Ban Him/Her`)
                        .setDescription('** **\n```\n' + e + '\n```')
                    return client.channels.cache.get(logs).send({ embeds: [logsembed] });
                })

            }
        }
    }
})

// --------------------------------------------

client.on("messageCreate", async (message) => {
    if (message.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {

        var antievery = db.get(`every_${message.guild.id}`)
        var antiinv = db.get(`inv_${message.guild.id}`)
        var antiweb = db.get(`weblink_${message.guild.id}`)
        var antimaleware = db.get(`malware_${message.guild.id}`)
        var antiNSFW = db.get(`antinsfw_${message.guild.id}`)

        let logs = db.get(`acitonslogs_${message.guild.id}`)
        let trustedusers = db.get(`trustedusers_${message.guild.id}`)
        let extraowners = db.get(`extraowners_${message.guild.id}`)

        if (antievery === 'true' && logs) {
            if (message.content.includes('@here') || message.content.includes('@everyone')) {
                if (trustedusers && trustedusers.find(find => find.user == message.author.id) || extraowners && extraowners.find(find => find.user == message.author.id) || message.author.id === message.guild.ownerId || message.author.id === client.user.id) {
                    return;
                }
                message.delete()
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#00008b')
                    .setTitle(`<:perm:923904697423777792> ${message.author.tag} Pinged Everyone/Here | Successfully Deleted`)
                    .setDescription(`<:bell_emoji:914129896958205982> **Details :**
<:space:874678195843125278><:right:874690882417360986> User : <@${message.author.id}>` + '`[' + message.author.tag + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Channel : <#${message.channel.id}>` + '`[' + message.channel.name + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Content : \n${message.content}

`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            };
        }

        if (antiinv === 'true' && logs) {
            if (message.content.includes('https://discord.gg') || message.content.includes('http://discord.gg') || message.content.includes('https://discord.com/invite/')) {
                if (trustedusers && trustedusers.find(find => find.user == message.author.id) || extraowners && extraowners.find(find => find.user == message.author.id) || message.author.id === message.guild.ownerId || message.author.id === client.user.id) {
                    return;
                }
                message.delete()
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#00008b')
                    .setTitle(`<:perm:923904697423777792> ${message.author.tag} Shared Discord Invite | Successfully Deleted`)
                    .setDescription(`<:bell_emoji:914129896958205982> **Details :**
<:space:874678195843125278><:right:874690882417360986> User : <@${message.author.id}>` + '`[' + message.author.tag + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Channel : <#${message.channel.id}>` + '`[' + message.channel.name + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Content : \n${message.content}

`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            };
        }

        if (antiweb === 'true' && logs) {
            if (message.content.includes('www.') || message.content.includes('http') || message.content.includes('.com') || message.content.includes('.ir') || message.content.includes('.me') || message.content.includes('.tv')) {
                if (trustedusers && trustedusers.find(find => find.user == message.author.id) || extraowners && extraowners.find(find => find.user == message.author.id) || message.author.id === message.guild.ownerId || message.author.id === client.user.id) {
                    return;
                }
                if (message.content.endsWith('.gif') || message.content.endsWith('.png') || message.content.endsWith('.jpg') || message.content.endsWith('.jpeg') || message.content.endsWith('.webp')) {
                    return;
                }
                message.delete()
                let logsembed = new Discord.MessageEmbed()
                    .setColor('#00008b')
                    .setTitle(`<:perm:923904697423777792> ${message.author.tag} Shared Website Link | Successfully Deleted`)
                    .setDescription(`<:bell_emoji:914129896958205982> **Details :**
<:space:874678195843125278><:right:874690882417360986> User : <@${message.author.id}>` + '`[' + message.author.tag + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Channel : <#${message.channel.id}>` + '`[' + message.channel.name + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Content : \n${message.content}

`)
                    .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                return client.channels.cache.get(logs).send({ embeds: [logsembed] });
            };
        }

        if (antiNSFW === 'true' && logs) {
            if (message.content) {
                NSFW.forEach(link => {
                    if (message.content.includes(link)) {
                        if (trustedusers && trustedusers.find(find => find.user == message.author.id) || extraowners && extraowners.find(find => find.user == message.author.id) || message.author.id === message.guild.ownerId || message.author.id === client.user.id) {
                            return;
                        }
                        message.delete()
                        let logsembed = new Discord.MessageEmbed()
                            .setColor('#00008b')
                            .setTitle(`<:perm:923904697423777792> ${message.author.tag} Shared NSFW Website | Successfully Deleted`)
                            .setDescription(`<:bell_emoji:914129896958205982> **Details :**
<:space:874678195843125278><:right:874690882417360986> User : <@${message.author.id}>` + '`[' + message.author.tag + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Channel : <#${message.channel.id}>` + '`[' + message.channel.name + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Content : \n${message.content}
`)
                            .setImage(GIFS[Math.floor(GIFS.length * Math.random())])
                        return client.channels.cache.get(logs).send({ embeds: [logsembed] });
                    }
                });
            }
        }
    }

})

// --------------------------------------------

client.on("guildMemberAdd", async member => {
    if (member.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR")) {
        let logs = db.get(`acitonslogs_${member.guild.id}`)

        let noprfiltter = db.get(`noprofilefilter_${member.guild.id}`)
        let agefilter1 = db.get(`agefilter1_${member.guild.id}`)
        let agefilter2 = db.get(`agefilter2_${member.guild.id}`)
        let agefilter3 = db.get(`agefilter3_${member.guild.id}`)
        let agefilter4 = db.get(`agefilter4_${member.guild.id}`)
        let agefilter5 = db.get(`agefilter5_${member.guild.id}`)
        let agefilter6 = db.get(`agefilter6_${member.guild.id}`)
        let agefilter7 = db.get(`agefilter7_${member.guild.id}`)

        var AGE = member.user.createdTimestamp
        var ONEDAY = member.user.createdTimestamp + 86400000
        var TWODAY = member.user.createdTimestamp + 172800000
        var THREEDAY = member.user.createdTimestamp + 259200000
        var FOURDAY = member.user.createdTimestamp + 345600000
        var FIVEDAY = member.user.createdTimestamp + 432000000
        var SIXDAY = member.user.createdTimestamp + 518400000
        var SEVENDAY = member.user.createdTimestamp + 604800000

        if (logs) {
            if (noprfiltter === 'true') {
                if (member.user.avatar === null) {
                    let joinav = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${member.user.tag} Has Been Kicked`)
                    member.send(`You Has Been Kicked From ${member.guild.name} | Join Gate (No Avatar Filter)`).then(a => {
                        member.kick()
                        joinav.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : No Avatar Filter\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:check:923151545401479179>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joinav] });
                    }).catch(e => {
                        member.kick()
                        joinav.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : No Avatar Filter\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:ignore:923151545569267752>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joinav] });
                    })
                }
            }
            // -----------------------------------

            if (agefilter1 === 'true') {
                if (AGE < ONEDAY) {
                    let joingate = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${member.user.tag} Has Been Kicked`)
                    member.send(`You Has Been Kicked From ${member.guild.name} | Join Gate (Account Age Filter 1 Day)`).then(a => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 1 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:check:923151545401479179>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    }).catch(e => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 1 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:ignore:923151545569267752>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    })
                }
            }

            if (agefilter2 === 'true') {
                if (AGE < TWODAY) {
                    let joingate = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${member.user.tag} Has Been Kicked`)
                    member.send(`You Has Been Kicked From ${member.guild.name} | Join Gate (Account Age Filter 1 Day)`).then(a => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 2 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:check:923151545401479179>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    }).catch(e => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 2 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:ignore:923151545569267752>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    })
                }
            }

            if (agefilter3 === 'true') {
                if (AGE < THREEDAY) {
                    let joingate = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${member.user.tag} Has Been Kicked`)
                    member.send(`You Has Been Kicked From ${member.guild.name} | Join Gate (Account Age Filter 1 Day)`).then(a => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 3 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:check:923151545401479179>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    }).catch(e => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 3 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:ignore:923151545569267752>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    })
                }
            }

            if (agefilter4 === 'true') {
                if (AGE < FOURDAY) {
                    let joingate = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${member.user.tag} Has Been Kicked`)
                    member.send(`You Has Been Kicked From ${member.guild.name} | Join Gate (Account Age Filter 1 Day)`).then(a => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 4 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:check:923151545401479179>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    }).catch(e => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 4 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:ignore:923151545569267752>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    })
                }
            }

            if (agefilter5 === 'true') {
                if (AGE < FIVEDAY) {
                    let joingate = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${member.user.tag} Has Been Kicked`)
                    member.send(`You Has Been Kicked From ${member.guild.name} | Join Gate (Account Age Filter 1 Day)`).then(a => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 5 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:check:923151545401479179>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    }).catch(e => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 5 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:ignore:923151545569267752>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    })
                }
            }

            if (agefilter6 === 'true') {
                if (AGE < SIXDAY) {
                    let joingate = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${member.user.tag} Has Been Kicked`)
                    member.send(`You Has Been Kicked From ${member.guild.name} | Join Gate (Account Age Filter 1 Day)`).then(a => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 6 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:check:923151545401479179>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    }).catch(e => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 6 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:ignore:923151545569267752>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    })
                }
            }

            if (agefilter7 === 'true') {
                if (AGE < SEVENDAY) {
                    let joingate = new Discord.MessageEmbed()
                        .setColor('#00008b')
                        .setTitle(`<:perm:923904697423777792> ${member.user.tag} Has Been Kicked`)
                    member.send(`You Has Been Kicked From ${member.guild.name} | Join Gate (Account Age Filter 1 Day)`).then(a => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 7 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:check:923151545401479179>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    }).catch(e => {
                        member.kick()
                        joingate.setDescription(`<:bell_emoji:914129896958205982> **Details :**\n<:space:874678195843125278><:right:874690882417360986> Member : <@${member.user.id}> **[${member.user.id}]**\n<:space:874678195843125278><:right:874690882417360986> Reasson : Account Age Filter 7 Day\n<:space:874678195843125278><:right:874690882417360986> Member Direct Messaged ? : <:ignore:923151545569267752>\n`)
                        return client.channels.cache.get(logs).send({ embeds: [joingate] });
                    })
                }
            }

        }
    }


})

// --------------------------------------------

process.on('unhandledRejection', err => {

    var errembed = new Discord.MessageEmbed()
        .setTitle(':warning: New Error')
        .setColor('YELLOW')
        .addFields(
            { name: ':pushpin: Type: ', value: `\`\`\`${err.name + "".split("", 150).join("") || "N/A"}\`\`\`` },
            {
                name: ':page_with_curl: Reason: ',
                value: `\`\`\`${err.message + "".split("", 150).join("") || "N/A"}\`\`\``
            },
        )
        .setTimestamp()
    client.channels.cache.get(CONFIG.ERROR).send({ embeds: [errembed] })
});