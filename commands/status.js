const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Shows Bot Status'),
    async execute(interaction, client) {

        function format(seconds) {
            function pad(s) {
                return (s < 10 ? '0' : '') + s;
            }
            var hours = Math.floor(seconds / (60 * 60));
            var minutes = Math.floor(seconds % (60 * 60) / 60);
            var seconds = Math.floor(seconds % 60);

            return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
        }
        var uptime = process.uptime();


        const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`
        const memoryData = process.memoryUsage()


        var startTime = process.hrtime()
        var startUsage = process.cpuUsage()
        var now = Date.now()
        while (Date.now() - now < 500)
            var elapTime = process.hrtime(startTime)
        var elapUsage = process.cpuUsage(startUsage)
        var elapTimeMS = secNSec2ms(elapTime)
        var elapUserMS = secNSec2ms(elapUsage.user)
        var elapSystMS = secNSec2ms(elapUsage.system)
        var cpuPercent = Math.round(100 * (elapUserMS + elapSystMS) / elapTimeMS)
        function secNSec2ms(secNSec) {
            if (Array.isArray(secNSec)) {
                return secNSec[0] * 1000 + secNSec[1] / 1000000;
            }
            return secNSec / 1000;
        }


        var MemberCount = 0;
        client.guilds.cache.forEach(Member => {
            MemberCount += Member.memberCount
        })

        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} Status`)
            .setColor('#85db61')
            .setDescription(`
<:Latency:923592402067918919> **Latency :** ${client.ws.ping}ms
<:Uptime:923592402302803998> **Uptime :** ${format(uptime)}

<:Resources:923592402256662558> **Resources**
<:space:874678195843125278> <:ram:923594665431793694> **RAM :** ${formatMemoryUsage(memoryData.heapUsed)}
<:space:874678195843125278> <:cpu:923592401820463136> **CPU :** ${cpuPercent}%

<:Size:923592402411876372> **Size**
<:space:874678195843125278> <:guild:923594665683456060> **Servers :** ${client.guilds.cache.size}
<:space:874678195843125278> <:user:923592406446772235> **Members :** ${MemberCount}
`)
        return interaction.reply({
            embeds: [embed]
        });


    },
};


