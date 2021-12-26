const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")
const Canvas = require('canvas');
Canvas.registerFont('./data/font/OpenSans-SemiBoldItalic.ttf', { family: 'OpenSans-SemiBoldItalic' })

module.exports = {
        data: new SlashCommandBuilder()
                .setName('clearuser')
                .setDescription('Clear Users Warns')
                .addUserOption(option =>
                        option.setName('user')
                                .setDescription('Mention The User')
                                .setRequired(true)),
        async execute(interaction, client) {

                var log = db.get(`acitonslogs_${interaction.guild.id}`)
                let trustedusers = db.get(`trustedusers_${interaction.guild.id}`)
                var user = interaction.options.getUser('user')
                if (trustedusers && trustedusers.find(find => find.user == interaction.user.id)) {
                        db.delete(`executer_${interaction.guild.id}_${user.id}_kicklimts`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_banlimts`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_rolecreate`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_roledelete`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_channelcreate`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_channeldelete`)

                        const canvas = Canvas.createCanvas(1242, 703);
                        const context = canvas.getContext('2d');
                        const background = await Canvas.loadImage(`./data/bg.png`);
                        context.drawImage(background, 0, 0, canvas.width, canvas.height);
                        context.font = '100px OpenSans-SemiBoldItalic';
                        context.fillStyle = 'black';
                       context.fillText(interaction.user.tag, 720, 270, 300, 250);                        context.fillText(`REMOVED WARNS FROM ${user.tag}`, 450, 640, 650, 550);
                        context.beginPath()
                        context.arc(250, 250, 200, 0, 2 * Math.PI);
                        context.clip();
                        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg', size: 2048 }));
                        context.drawImage(profile, 50, 50, 400, 400);
                        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "clear.png");

                        let removedwarn = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setDescription(`<:check:923151545401479179> Removed ${user.tag} **Warns** By ${interaction.user.tag}`)
                                .setImage('attachment://clear.png');

                        if (log) client.channels.cache.get(log).send({ embeds: [removedwarn], files: [wladdedimg] });


                        let restor = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setDescription(`<:check:923151545401479179> Removed ${user.tag} **Warns** By ${interaction.user.tag}`)

                        return interaction.reply({
                                embeds: [restor]
                        });
                } else if (interaction.user.id === interaction.guild.ownerId) {
                        db.delete(`executer_${interaction.guild.id}_${user.id}_kicklimts`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_banlimts`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_rolecreate`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_roledelete`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_channelcreate`)
                        db.delete(`executer_${interaction.guild.id}_${user.id}_channeldelete`)

                        const canvas = Canvas.createCanvas(1242, 703);
                        const context = canvas.getContext('2d');
                        const background = await Canvas.loadImage(`./data/bg.png`);
                        context.drawImage(background, 0, 0, canvas.width, canvas.height);
                        context.font = '100px OpenSans-SemiBoldItalic';
                        context.fillStyle = 'black';
                       context.fillText(interaction.user.tag, 720, 270, 300, 250);                        context.fillText(`REMOVED WARNS FROM ${user.tag}`, 450, 640, 650, 550);
                        context.beginPath();
                        context.arc(250, 250, 200, 0, 2 * Math.PI);
                        context.clip();
                        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg', size: 2048 }));
                        context.drawImage(profile, 50, 50, 400, 400);
                        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "clear.png");

                        let removedwarn = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setDescription(`<:check:923151545401479179> Removed ${user.tag} **Warns** By ${interaction.user.tag}`)
                                .setImage('attachment://clear.png');

                        if (log) client.channels.cache.get(log).send({ embeds: [removedwarn], files: [wladdedimg] });

                        let restor = new Discord.MessageEmbed()
                                .setColor('#85db61')
                                .setDescription(`<:check:923151545401479179> Removed ${user.tag} **Warns** By ${interaction.user.tag}`)

                        return interaction.reply({
                                embeds: [restor]
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
}




