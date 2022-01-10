const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")
const Canvas = require('canvas');
Canvas.registerFont('./data/font/OpenSans-SemiBoldItalic.ttf', { family: 'OpenSans-SemiBoldItalic' })
const { OWNER } = require('../data/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joingate')
        .setDescription('Set Guild Join Gate Config')
        .addStringOption(option =>
            option.setName('config')
                .setDescription('Type Of Config')
                .setRequired(true)
                .addChoice('No Avatar Filter', 'naf')
                .addChoice('Account Age Filter 1 Day', 'acc1')
                .addChoice('Account Age Filter 2 Day', 'acc2')
                .addChoice('Account Age Filter 3 Day', 'acc3')
                .addChoice('Account Age Filter 4 Day', 'acc4')
                .addChoice('Account Age Filter 5 Day', 'acc5')
                .addChoice('Account Age Filter 6 Day', 'acc6')
                .addChoice('Account Age Filter 7 Day', 'acc7')
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
        var name = interaction.options.get('value').name
        var value = interaction.options.get('value').value

        let extraowners = db.get(`extraowners_${interaction.guild.id}`)
        var log = db.get(`acitonslogs_${interaction.guild.id}`)

        if (extraowners && extraowners.find(find => find.user == interaction.user.id) || interaction.user.id === interaction.guild.ownerId || interaction.user.id === OWNER) {
            if (config === 'naf') {
                if (value === 'ON') {
                    db.set(`noprofilefilter_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`noprofilefilter_${interaction.guild.id}`, 'false')
                }
            }

            if (config === 'acc1') {
                if (value === 'ON') {
                    db.set(`agefilter1_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`agefilter1_${interaction.guild.id}`, 'false')
                }
            }

            if (config === 'acc2') {
                if (value === 'ON') {
                    db.set(`agefilter2_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`agefilter2_${interaction.guild.id}`, 'false')
                }
            }

            if (config === 'acc3') {
                if (value === 'ON') {
                    db.set(`agefilter3_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`agefilter3_${interaction.guild.id}`, 'false')
                }
            }

            if (config === 'acc4') {
                if (value === 'ON') {
                    db.set(`agefilter4_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`agefilter4_${interaction.guild.id}`, 'false')
                }
            }

            if (config === 'acc5') {
                if (value === 'ON') {
                    db.set(`agefilter5_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`agefilter5_${interaction.guild.id}`, 'false')
                }
            }

            if (config === 'acc6') {
                if (value === 'ON') {
                    db.set(`agefilter6_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`agefilter6_${interaction.guild.id}`, 'false')
                }
            }

            if (config === 'acc7') {
                if (value === 'ON') {
                    db.set(`agefilter7_${interaction.guild.id}`, 'true')
                }
                if (value === 'OFF') {
                    db.set(`agefilter7_${interaction.guild.id}`, 'false')
                }
            }

            let done = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> **${name}** Has Been Turned **${value}**`)
            const canvas = Canvas.createCanvas(1242, 703);
            const context = canvas.getContext('2d');
            const background = await Canvas.loadImage(`./data/bg.png`);
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            context.font = '100px OpenSans-SemiBoldItalic';
            context.fillStyle = 'black';
            context.fillText(interaction.user.tag, 720, 270, 300, 250); context.fillText(`${name} Has Been Turned ${value}`, 470, 640, 700, 250);
            context.beginPath();
            context.arc(250, 250, 200, 0, 2 * Math.PI);
            context.clip();
            const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
            context.drawImage(profile, 50, 50, 400, 400);
            const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

            let setted = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`<:check:923151545401479179> **${name}** Has Been Turned **${value}** By **${interaction.user.tag}**`)
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



