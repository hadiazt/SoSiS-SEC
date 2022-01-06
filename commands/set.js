const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")
const Canvas = require('canvas');
Canvas.registerFont('./data/font/OpenSans-SemiBoldItalic.ttf', { family: 'OpenSans-SemiBoldItalic' })
const { OWNER } = require('../data/config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('Set Guild Limitation Config')
    .addStringOption(option =>
      option.setName('config')
        .setDescription('Type Of Config')
        .setRequired(true)
        .addChoice('Set Role Create Limit', 'setrolecreatelimit')
        .addChoice('Set Role Delete Limit', 'setroledeletelimit')
        .addChoice('Set Channel Create Limit', 'setchannelcreatelimit')
        .addChoice('Set Channel Delete Limit', 'setchanneldeletelimit')
        .addChoice('Set Ban Limit', 'setbanlimit')
        .addChoice('Set Kick Limit', 'setkicklimit'))
    .addNumberOption(option =>
      option.setName('num')
        .setDescription('Number Of Limit')
        .setRequired(true)),

  async execute(interaction, client) {

    var config = interaction.options.get('config').value
    var num = interaction.options.get('num').value

    let extraowners = db.get(`extraowners_${interaction.guild.id}`)
    var log = db.get(`acitonslogs_${interaction.guild.id}`)

    if (extraowners && extraowners.find(find => find.user == interaction.user.id)) {
      if (config === 'setrolecreatelimit') {
        db.set(`rolecreatelimt_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> RoleCreation limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setroledeletelimit') {
        db.set(`roledeletelimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> RoleDelete limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setchannelcreatelimit') {
        db.set(`channelcreatelimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> ChannelCreation limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setchanneldeletelimit') {
        db.set(`channeldeletelimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> ChannelDelete limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setbanlimit') {
        db.set(`banlimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> Ban limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setkicklimit') {
        db.set(`kicklimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> Kick limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }
      let setted = new Discord.MessageEmbed()
        .setColor('#85db61')
        .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
      if (log) client.channels.cache.get(log).send({ embeds: [setted] });

    } else if (interaction.user.id === interaction.guild.ownerId || interaction.user.id === OWNER) {
      if (config === 'setrolecreatelimit') {
        db.set(`rolecreatelimt_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> RoleCreation limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setroledeletelimit') {
        db.set(`roledeletelimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> RoleDelete limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setchannelcreatelimit') {
        db.set(`channelcreatelimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> ChannelCreation limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setchanneldeletelimit') {
        db.set(`channeldeletelimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> ChannelDelete limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setbanlimit') {
        db.set(`banlimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> Ban limits Has Been Set To ${num}`)
        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }

      if (config === 'setkicklimit') {
        db.set(`kicklimts_${interaction.guild.id}`, num)
        let done = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> Kick limits Has Been Set To ${num}`)

        const canvas = Canvas.createCanvas(1242, 703);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./data/bg.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '100px OpenSans-SemiBoldItalic';
        context.fillStyle = 'black';
        context.fillText(interaction.user.tag, 720, 270, 300, 250);
        context.fillText(`Changes ${config} Limits To ${num}`, 470, 640, 700, 250);
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.clip();
        const profile = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "set.png");

        let setted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **${config}** Has Been Edited To **${num}** By **${interaction.user.tag}**`)
          .setImage('attachment://set.png');


        if (log) client.channels.cache.get(log).send({ embeds: [setted], files: [wladdedimg] });

        return interaction.reply({
          embeds: [done]
        });
      }



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



