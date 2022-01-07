const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")
const Canvas = require('canvas');
Canvas.registerFont('./data/font/OpenSans-SemiBoldItalic.ttf', { family: 'OpenSans-SemiBoldItalic' })
const { OWNER } = require('../data/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti')
        .setDescription('Set Guild Anti Raid Config')
        .addStringOption(option =>
            option.setName('config')
                .setDescription('Type Of Config')
                .setRequired(true)
                .addChoice('Anti Bot', 'antibot')
                .addChoice('Anti Mention Everyone/Here', 'antievery/here')
                .addChoice('Anti Discord Invites', 'antiinvite')
                .addChoice('Anti Website Link', 'antiweblink')
                .addChoice('Anti Malware Link', 'antimalware')
                .addChoice('Anti NSFW Website', 'antinsfw')
        )
        .addStringOption(option =>
            option.setName('value')
                .setDescription('ON/OFF')
                .setRequired(true)
                .addChoice('ON', 'ON')
                .addChoice('OFF', 'OFF')
        ),

    async execute(interaction, client) {

        var config = interaction.options.get('config').value
        var value = interaction.options.get('value').value

        let extraowners = db.get(`extraowners_${interaction.guild.id}`)
        var log = db.get(`acitonslogs_${interaction.guild.id}`)

        if (extraowners && extraowners.find(find => find.user == interaction.user.id)) {
            if (config === 'antibot') {
                if (value === 'ON') {
                    db.set(`addbot_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`addbot_${interaction.guild.id}`, 'false')
                }
            }
            if (config === 'antievery/here') {
                if (value === 'ON') {
                    db.set(`every_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`every_${interaction.guild.id}`, 'false')
                }
            }
            if (config === 'antiinvite') {
                if (value === 'ON') {
                    db.set(`inv_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`inv_${interaction.guild.id}`, 'false')
                }
            }
            if (config === 'antiweblink') {
                if (value === 'ON') {
                    db.set(`weblink_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`weblink_${interaction.guild.id}`, 'false')
                }
            }
            if (config === 'antimalware') {
                if (value === 'ON') {
                    db.set(`malware_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`malware_${interaction.guild.id}`, 'false')
                }
            }
            if (config === 'antinsfw') {
                if (value === 'ON') {
                    db.set(`antinsfw_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`antinsfw_${interaction.guild.id}`, 'false')
                }
            }

            let done = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> **${config}** Has Been Turned **${value}**`)
            const canvas = Canvas.createCanvas(1242, 703);
            const context = canvas.getContext('2d');
            const background = await Canvas.loadImage(`./data/bg.png`);
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            context.font = '100px OpenSans-SemiBoldItalic';
            context.fillStyle = 'black';
            context.fillText(interaction.user.tag, 720, 270, 300, 250); context.fillText(`${config} Has Been Turned ${value}`, 470, 640, 700, 250);
            context.beginPath();
            context.arc(250, 250, 200, 0, 2 * Math.PI);
            context.clip();
            const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
            context.drawImage(profile, 50, 50, 400, 400);
            const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

            let setted = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> **${config}** Has Been Turned **${value}** By **${interaction.user.tag}**`)
                .setImage('attachment://set.png');
            if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

            return interaction.reply({
                embeds: [done]
            });

        } else if (interaction.user.id === interaction.guild.ownerId || interaction.user.id === OWNER) {
            if (config === 'antibot') {
                if (value === 'ON') {
                    db.set(`addbot_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`addbot_${interaction.guild.id}`, 'false')
                }
            }
            if (config === 'antievery/here') {
                if (value === 'ON') {
                    db.set(`every_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`every_${interaction.guild.id}`, 'false')
                }
            }
            if (config === 'antiinvite') {
                if (value === 'ON') {
                    db.set(`inv_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`inv_${interaction.guild.id}`, 'false')
                }
            }
            if (config === 'antiweblink') {
                if (value === 'ON') {
                    db.set(`weblink_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`weblink_${interaction.guild.id}`, 'false')
                }
            }
            if (config === 'antimalware') {
                if (value === 'ON') {
                    db.set(`malware_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`malware_${interaction.guild.id}`, 'false')
                }
            }

            if (config === 'antinsfw') {
                if (value === 'ON') {
                    db.set(`antinsfw_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`antinsfw_${interaction.guild.id}`, 'false')
                }
            }

            let done = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> **${config}** Has Been Turned **${value}**`)
            const canvas = Canvas.createCanvas(1242, 703);
            const context = canvas.getContext('2d');
            const background = await Canvas.loadImage(`./data/bg.png`);
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            context.font = '100px OpenSans-SemiBoldItalic';
            context.fillStyle = 'black';
            context.fillText(interaction.user.tag, 720, 270, 300, 250); context.fillText(`${config} Has Been Turned ${value}`, 470, 640, 700, 250);
            context.beginPath();
            context.arc(250, 250, 200, 0, 2 * Math.PI);
            context.clip();
            const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
            context.drawImage(profile, 50, 50, 400, 400);
            const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

            let setted = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> **${config}** Has Been Turned **${value}** By **${interaction.user.tag}**`)
                .setImage('attachment://set.png');
            if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

            return interaction.reply({
                embeds: [done]
            });

        }

        let owneronly = new Discord.MessageEmbed()
            .setColor('#f67975')
            .setTitle(`You Can't Use This Command!`)
            .setDescription('<:ignore:923151545569267752> Only **Server Owner** & **Extra Owners** Can Use This Command!')
        return interaction.reply({
            embeds: [owneronly]
        });

    },
};



