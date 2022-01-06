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

client.on('ready', () => {
    setInterval(() => {
        client.user.setPresence({
            status: 'dnd',
            activities: [{
                type: 'WATCHING',
                name: `${client.guilds.cache.size} GUILDS | /info`,
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

        if(entry.id === role.guild.ownerId || entry.id === client.id) {
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

        if(entry.id === role.guild.ownerId || entry.id === client.id) {
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

        if(entry.id === channel.guild.ownerId || entry.id === client.id) {
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

        if(entry.id === channel.guild.ownerId || entry.id === client.id) {
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

            if(entry.id === member.guild.ownerId || entry.id === client.id) {
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

            if(entry.id === member.guild.ownerId || entry.id === client.id) {
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
                if(entry.id === member.guild.ownerId || entry.id === client.id) {
                    return;
                }
                if (extraowners && extraowners.find(find => find.user == entry.id)) {
                    let trustedac = new Discord.MessageEmbed()
                        .setColor('#85db61')
                        .setTitle(`<:check:923151545401479179> ${entry.tag} Added A Bot But He/She Is In Extra Owner`)
                        .setDescription(`<:bell_emoji:914129896958205982> **Details :**
<:space:874678195843125278><:right:874690882417360986> User : <@${entry.id}>` + '`[' + entry.tag + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Bot : <@${member.id}>` + '`[' + member.tag + ']`' + `
`)
                    return client.channels.cache.get(logs).send({ embeds: [trustedac] });
                }

                if (trustedusers && trustedusers.find(find => find.user == entry.id)) {
                    let trustedac = new Discord.MessageEmbed()
                        .setColor('#85db61')
                        .setTitle(`<:check:923151545401479179> ${entry.tag} Added A Bot But He/She Is In Trusted Users`)
                        .setDescription(`<:bell_emoji:914129896958205982> **Details :**
<:space:874678195843125278><:right:874690882417360986> User : <@${entry.id}>` + '`[' + entry.tag + ']`' + `
<:space:874678195843125278><:right:874690882417360986> Bot : <@${member.id}>` + '`[' + member.tag + ']`' + `
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