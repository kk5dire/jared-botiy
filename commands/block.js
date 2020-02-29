const Discord = require("discord.js");
const { loading } = require("../data/emojis.json");
const colors = require("../data/colors.json")
const users = require("../models/user.js");
const mongoose = require("mongoose");
const { modlog } = require("../data/channels.json");
const { mongoUsername, mongoPass } = require("../tokens.json");
const emojis = require("../data/emojis.json");

mongoose.connect(`mongodb+srv://${mongoUsername}:${mongoPass}@tetracyl-unhxi.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = {
    name: "block",
    description: "Prevents a user from using the bot on any server.",
    usage: "<user> <reason>",
    args: true,
    permission: "dev",
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send("Please specifiy a user.")
        const reason = args.slice(1).join(" ");
        if (!reason) return message.channel.send(`Please specify a reason for blocking this user.`);

        const msg = await message.channel.send(`${emojis.loading} Blocked user from bot...`);

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return msg.edit("Not a valid user.");

        users.findOne({
            authorID: user.id
        }, async (err, u) => {
            if (err) console.log(err);
            if (!u) {
                const newUser = new users({
                    authorID: user.id,
                    authorName: user.tag,
                    bio: "",
                    songsPlayed: 0,
                    commandsUsed: 0,
                    blocked: true,
                    supporter: false,
                    supporterPlus: false,
                    supporterPlusPlus: false,
                    supporterInfinite: false,
                    developer: false,
                });
                newUser.save().catch(e => console.log(e));
            } else {
                //if (u.blocked == null) u.blocked = false;
                if (u.blocked) {
                    return msg.edit("That user is already blocked.");
                } else if (!u.blocked) {
                    u.blocked = true;
                }
            }

            const username = await client.users.fetch(u.authorID);
            msg.edit(`Blocked **${user.user.tag}** from the bot.`)
            client.channels.get(modlog).send(`${emojis.blacklist} **${message.author.tag}** (${message.author.id}) blocked **${user.user.tag}** (${user.id}). Reason: ${reason}`);
            await u.save().catch(e => console.log(e));
        });
    },
};