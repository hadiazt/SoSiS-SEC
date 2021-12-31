const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const db = require("quick.db")
const Canvas = require('canvas');
Canvas.registerFont('./data/font/OpenSans-SemiBoldItalic.ttf', { family: 'OpenSans-SemiBoldItalic' })
const { OWNER } = require('../data/config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removetrusted')
    .setDescription('Remove Guild WhiteList')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Mention The User')
        .setRequired(true)),
  async execute(interaction, client) {

    if (interaction.user.id === interaction.guild.ownerId || interaction.user.id === OWNER) {

      var user = interaction.options.getUser('user')

      var log = db.get(`acitonslogs_${interaction.guild.id}`)
      let database = db.get(`trustedusers_${interaction.guild.id}`)
      if (database && database.find(x => x.user === user.id)) {
        let data = database.find(x => x.user === user.id)

        let value = database.indexOf(data)
        delete database[value]

        var filter = database.filter(x => {
          return x != null && x != ''
        })

        db.set(`trustedusers_${interaction.guild.id}`, filter)


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
        const profile = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg', size: 2048 }));
        context.drawImage(profile, 50, 50, 400, 400);
        const wladdedimg = new Discord.MessageAttachment(canvas.toBuffer(), "trustremoved.png");

        let addedlog = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **Successfully Removed ${user.tag} From Trusted Users!** `)
          .setImage('attachment://trustremoved.png');
        if (log) client.channels.cache.get(log).send({ embeds: [addedlog], files: [wladdedimg] });

        let deleted = new Discord.MessageEmbed()
          .setColor('#85db61')
          .setDescription(`<:check:923151545401479179> **Successfully Removed ${user.tag} From Trusted Users!** `)

        return interaction.reply({
          embeds: [deleted]
        });

      } else {

        let notwl = new Discord.MessageEmbed()
          .setColor('#f67975')
          .setDescription(`<:ignore:923151545569267752> That User IS Not On **Trusted List**!`)
        return interaction.reply({
          embeds: [notwl]
        });
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
