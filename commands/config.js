const Discord = require("discord.js")
const db = require("quick.db")
const ms = require('parse-ms');
const { truncate } = require("fs");
module.exports = {
  name: "config",
  description: "set guild anit raid config",
  run: async (client, message, args) => {
    let cmd = args[0];
    const guildicon = message.guild.iconURL();
    if (!cmd) {
      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`
        ** Available Keys**
   > **config setrolecreatelimit
   > conifg setactionlogs
   > config setroledeletelimit
   > config setchannelcreatelimit
   > config setchanneldeletelimit
   > config setbanlimit
   > config setkicklimit
   > config clearuser**     
   `)
        .setFooter(message.guild.name, guildicon)
      return message.channel.send({
        embeds: [embed]
      });
    }
    if (cmd.toLowerCase() === 'show') {
      let rolelimt = db.get(`rolecreatelimt_${message.guild.id}`)
      if (rolelimt === null) rolelimt = "Disabled :x:"
      let roledelete = db.get(`roledeletelimts_${message.guild.id}`)
      if (roledelete === null) roledelete = "Disabled :x:"
      let logschannel = db.get(`acitonslogs_${message.guild.id}`)
      let logschannel2 = db.get(`acitonslogs_${message.guild.id}`)
      if (logschannel === null) logschannel = "Disabled :x:"
      else logschannel = `<#${logschannel2}>`
      let channelcreatelimts = db.get(`channelcreatelimts_${message.guild.id}`)
      if (channelcreatelimts === null) channelcreatelimts = "Disabled :x:"
      let channeldeletelimts = db.get(`channeldeletelimts_${message.guild.id}`)
      if (channeldeletelimts === null) channeldeletelimts = "Disabled :x:"
      let banlimts = db.get(`banlimts_${message.guild.id}`)
      if (banlimts === null) banlimts = "Disabled :x:"
      let kicklimts = db.get(`kicklimts_${message.guild.id}`)
      if (kicklimts === null) kicklimts = "Disabled :x:"

      let showembed = new Discord.MessageEmbed()

        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .addField('Role Create Limits', rolelimt, true)
        .addField('Role Delete Limits', roledelete, true)
        .addField(`Channel Create Limits`, channelcreatelimts, true)
        .addField(`Channel Delete Limits`, channeldeletelimts, true)
        .addField(`Ban Limits`, banlimts, true)
        .addField(`Kick Limits`, kicklimts, true)
        .addField(`Aciton Log Channel`, logschannel, true)
        .setFooter(message.guild.name, guildicon)
      return message.channel.send({
        embeds: [showembed]
      });
    }
    if (cmd.toLowerCase() === 'setrolecreatelimit') {
      let rolecreate = args.slice(1).join(" ");
      if (!rolecreate) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage**\nconfig setrolecreatelimt (number)`)
          .setFooter(message.guild.name, guildicon)

        return message.channel.send({
          embeds: [missing]
        });
      }
      if (isNaN(rolecreate)) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage (Cannot Be Words Only Numbers)**\nconfig setrolecreatelimt (number)`)
          .setFooter(message.guild.name, guildicon)
        return message.channel.send({
          embeds: [missing]
        });
      }
      db.set(`rolecreatelimt_${message.guild.id}`, rolecreate)
      let done = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`Done SetRoleCreation limits Has Been Set To ${rolecreate} ✅`)
        .setFooter(message.guild.name, guildicon)
      return message.channel.send({
        embeds: [done]
      });
    }
    if (cmd.toLowerCase() === 'setroledeletelimit') {
      let roledelete = args.slice(1).join(" ");
      if (!roledelete) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage**\nconfig setroledeletelimt (number)`)
          .setFooter(message.guild.name, guildicon)

        return message.channel.send({
          embeds: [missing]
        });
      }
      if (isNaN(rolecreate)) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage (Cannot Be Words Only Numbers)**\nconfig setroledeletelimt (number)`)
          .setFooter(message.guild.name, guildicon)
        return message.channel.send({
          embeds: [missing]
        });
      }
      db.set(`roledeletelimts_${message.guild.id}`, rolecreate)
      let done = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`Done SetRoleDelete limits Has Been Set To ${rolecreate} ✅`)
        .setFooter(message.guild.name, guildicon)
      return message.channel.send({
        embeds: [done]
      });

    }
    if (cmd.toLowerCase() === 'setchannelcreatelimit') {
      let rolecreate = args.slice(1).join(" ");
      if (!rolecreate) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage**\nconfig setchannelcreatelimt (number)`)
          .setFooter(message.guild.name, guildicon)

        return message.channel.send({
          embeds: [missing]
        });
      }
      if (isNaN(rolecreate)) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage (Cannot Be Words Only Numbers)**\nconfig setchannelcreatelimt (number)`)
          .setFooter(message.guild.name, guildicon)
        return message.channel.send({
          embeds: [missing]
        });
      }
      db.set(`channelcreatelimts_${message.guild.id}`, rolecreate)
      let done = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`Done Channel Create limits Has Been Set To ${rolecreate} ✅`)
        .setFooter(message.guild.name, guildicon)
      return message.channel.send({
        embeds: [done]
      });
    }
    if (cmd.toLowerCase() === 'setchanneldeletelimit') {
      let rolecreate = args.slice(1).join(" ");
      if (!rolecreate) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage**\nconfig setchanneldeletelimt (number)`)
          .setFooter(message.guild.name, guildicon)

        return message.channel.send({
          embeds: [missing]
        });
      }
      if (isNaN(rolecreate)) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage (Cannot Be Words Only Numbers)**\nconfig setchanneldeletelimt (number)`)
          .setFooter(message.guild.name, guildicon)
        return message.channel.send({
          embeds: [missing]
        });
      }
      db.set(`channeldeletelimts_${message.guild.id}`, rolecreate)
      let done = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`Done Channel Delete limits Has Been Set To ${rolecreate} ✅`)
        .setFooter(message.guild.name, guildicon)
      return message.channel.send({
        embeds: [done]
      });
    }
    if (cmd.toLowerCase() === 'setbanlimit') {
      let rolecreate = args.slice(1).join(" ");
      if (!rolecreate) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage**\nconfig setbanlimt (number)`)
          .setFooter(message.guild.name, guildicon)

        return message.channel.send({
          embeds: [missing]
        });
      }
      if (isNaN(rolecreate)) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage (Cannot Be Words Only Numbers)**\nconfig setbanlimt (number)`)
          .setFooter(message.guild.name, guildicon)
        return message.channel.send({
          embeds: [missing]
        });
      }
      db.set(`banlimts_${message.guild.id}`, rolecreate)
      let done = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`Done Channel Ban limits Has Been Set To ${rolecreate} ✅`)
        .setFooter(message.guild.name, guildicon)
      return message.channel.send({
        embeds: [done]
      });
    }
    if (cmd.toLowerCase() === 'setkicklimit') {
      let rolecreate = args.slice(1).join(" ");
      if (!rolecreate) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage**\nconfig setbanlimt (number)`)
          .setFooter(message.guild.name, guildicon)

        return message.channel.send({
          embeds: [missing]
        });
      }
      if (isNaN(rolecreate)) {
        let missing = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`** An Invaild Usage (Cannot Be Words Only Numbers)**\nconfig setkicklimt (number)`)
          .setFooter(message.guild.name, guildicon)
        return message.channel.send({
          embeds: [missing]
        });
      }
      db.set(`kicklimts_${message.guild.id}`, rolecreate)
      let done = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`Done Channel Kick limits Has Been Set To ${rolecreate} ✅`)
        .setFooter(message.guild.name, guildicon)
      return message.channel.send({
        embeds: [done]
      });
    }
    if (cmd.toLowerCase() === 'setactionlogs') {
      let logs = message.mentions.channels.first();
      if (!logs) {
        let logsembed = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`Please Mention an vaild channel`)
          .setFooter(message.guild.name, guildicon)
        return message.channel.send({
          embeds: [logsembed]
        });
      }
      logs.send(`** Anit-Raid Logs Channel **`)
      db.set(`acitonslogs_${message.guild.id}`, logs.id)
      let done = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`well done aciton-logs channel has been set to ${logs}`)
        .setFooter(message.guild.name, guildicon)
      return message.channel.send({
        embeds: [done]
      });
    }

    if (cmd.toLowerCase() === 'clearuser') {
      let user = message.mentions.users.first()
      if (!user) {
        return message.channel.send(`** Mention User **`);
      }
      db.delete(`executer_${message.guild.id}_${user.id}_kicklimts`)
      db.delete(`executer_${message.guild.id}_${user.id}_banlimts`)
      db.delete(`executer_${message.guild.id}_${user.id}_rolecreate`)
      db.delete(`executer_${message.guild.id}_${user.id}_roledelete`)
      db.delete(`executer_${message.guild.id}_${user.id}_channelcreate`)
      db.delete(`executer_${message.guild.id}_${user.id}_channeldelete`)
      return message.channel.send(`Reseted User Limts`);
    }
  }
}

