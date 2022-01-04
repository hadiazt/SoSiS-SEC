const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")
const Canvas = require('canvas');
Canvas.registerFont('./data/font/OpenSans-SemiBoldItalic.ttf', { family: 'OpenSans-SemiBoldItalic' })
const { OWNER } = require('../data/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtrusted')
        .setDescription('Set Guild WhiteList')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type Of WhiteList')
                .setRequired(true)
                .addChoice('Extra Owner', 'eo')
                .addChoice('Trusted User', 'tu')
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Mention The User')
                .setRequired(true)),
    async execute(interaction, client) {

        if (interaction.user.id === interaction.guild.ownerId || interaction.user.id === OWNER) {
            var user = interaction.options.getUser('user')
            var type = interaction.options.get('type').value
            var owneral = new Discord.MessageEmbed()
                .setColor('#85db61')
                .setDescription(`**GUILD Owners Are In WhiteList By Default**`)

            if (user.id === interaction.guild.ownerId) return interaction.reply({ embeds: [owneral] });

            var log = db.get(`acitonslogs_${interaction.guild.id}`)

            if (type === 'tu') {
                let trustedusers = db.get(`trustedusers_${interaction.guild.id}`)

                if (trustedusers && trustedusers.find(find => find.user == user.id)) {
                    let existed = new Discord.MessageEmbed()
                        .setColor('#f67975')
                        .setTitle(`<:ignore:923151545569267752> **This User It's Already on Trusted List**`)
                    return interaction.reply({
                        embeds: [existed]
                    });
                }
                let data = {
                    user: user.id
                }
                db.push(`trustedusers_${interaction.guild.id}`, data)

                const canvas = Canvas.createCanvas(1242, 703);
                const context = canvas.getContext('2d');
                const background = await Canvas.loadImage(`./data/bg.png`);
                context.drawImage(background, 0, 0, canvas.width, canvas.height);
                context.font = '100px OpenSans-SemiBoldItalic';
                context.fillStyle = 'black';
                context.fillText(user.tag, 720, 270, 300, 250);
                context.fillText(`ADDED TO TRUST LIST`, 670, 640, 300, 250);
                context.beginPath();
                context.arc(250, 250, 200, 0, 2 * Math.PI);
                context.clip();
                const profile = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 2048 }));
                context.drawImage(profile, 50, 50, 400, 400);
                const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "trustadded.png");

                let addedlog = new Discord.MessageEmbed()
                    .setColor('#85db61')
                    .setDescription(`<:check:923151545401479179> **${user.tag} Added To Trusted List!**`)
                    .setImage('attachment://trustadded.png');
                if (log) client.channels.cache.get(log).send({ embeds: [addedlog], files: [wladdedimg] });

                let added = new Discord.MessageEmbed()
                    .setColor('#85db61')
                    .setDescription(`<:check:923151545401479179> **${user.tag} Added To Trusted List!**`)

                return interaction.reply({ embeds: [added] });
            }

            if (type === 'eo') {
                let extraowners = db.get(`extraowners_${interaction.guild.id}`)
            
                if (extraowners && extraowners.find(find => find.user == user.id)) {
                    let existed = new Discord.MessageEmbed()
                        .setColor('#f67975')
                        .setTitle(`<:ignore:923151545569267752> **This User It's Already on Extra Owner**`)
                    return interaction.reply({
                        embeds: [existed]
                    });
                }
                let data = {
                    user: user.id
                }
                db.push(`extraowners_${interaction.guild.id}`, data)
    
                const canvas = Canvas.createCanvas(1242, 703);
                const context = canvas.getContext('2d');
                const background = await Canvas.loadImage(`./data/bg.png`);
                context.drawImage(background, 0, 0, canvas.width, canvas.height);
                context.font = '100px OpenSans-SemiBoldItalic';
                context.fillStyle = 'black';
                context.fillText(user.tag, 720, 270, 300, 250);
                context.fillText(`ADDED TO EXTRA OWNER`, 670, 640, 300, 250);
                context.beginPath();
                context.arc(250, 250, 200, 0, 2 * Math.PI);
                context.clip();
                const profile = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 2048 }));
                context.drawImage(profile, 50, 50, 400, 400);
                const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "trustadded.png");
    
                let addedlog = new Discord.MessageEmbed()
                    .setColor('#85db61')
                    .setDescription(`<:check:923151545401479179> **${user.tag} Added To Extra Owner!**`)
                    .setImage('attachment://trustadded.png');
                if (log) client.channels.cache.get(log).send({ embeds: [addedlog], files: [wladdedimg] });
    
    
    
                let added = new Discord.MessageEmbed()
                    .setColor('#85db61')
                    .setDescription(`<:check:923151545401479179> **${user.tag} Added To Extra Owner!**`)
    
                return interaction.reply({ embeds: [added] });
            }
        }

        let owneronly = new Discord.MessageEmbed()
            .setColor('#f67975')
            .setTitle(`You Can't Use This Command!`)
            .setDescription('<:ignore:923151545569267752> Only **Server Owner** Can Use This Command!')
        return interaction.reply({
            embeds: [owneronly]
        });

    },
};


