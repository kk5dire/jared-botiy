const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

module.exports = {
    name: "volume",
    description: "Sets the volume of the song",
    args: true,
    cooldown: "10",
    usage: "<volume #>",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(isNaN(args[0])) return message.channel.send(`Invalid number.`)
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel != message.guild.members.cache.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");

        if(!player) return message.channel.send("No songs playing.")

        if(args[0].toLowerCase() == "reset") {
            player.setVolume(Number(client.settings.normal));
            return message.channel.send("Volume has been reseted back to normal.")
        }
        player.setVolume(Number(args[0]));
        return message.channel.send(`Set the volume to **${args[0]}**. (Default volume is 100)`)
    }
}