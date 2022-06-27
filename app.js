const Discord = require('discord.js');
const Colors = require('colors');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Loop = require('./loop');
require("dotenv").config();

const myArgs = process.argv.slice(2);
const reloadMode = myArgs[0]?.toLocaleLowerCase() == 'reloadcmds' || myArgs[0]?.toLocaleLowerCase() == 'reload'

const client = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MEMBERS'
    ],
    partials: ["GUILD_MEMBER"],
});

client.commands = new Discord.Collection();
client.timedRoles = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

{
    const onlyData = [];
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        onlyData.push(command.data);
    }

    if (reloadMode) {
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
        rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), { body: onlyData })
            .then(() => {
                console.log('Successfully registered application commands.');
            })
            .catch(console.error);
    }
}

client.on('interactionCreate', (interaction) => {
    if (!(interaction.isCommand())) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        interaction.reply({ content: 'No se localizo el comando (Error 404)', ephemeral: true });
    }

    command.start(interaction);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const newRoles = newMember.roles.cache
    if (oldMember.roles.cache.size == newRoles.size) return;

    console.log(Colors.magenta(newMember.user.tag + ' sufrio un cambio de rol, ahora tiene ' + Colors.red(oldMember.roles.cache.size) + ' -> ' + Colors.cyan(newRoles.size)));

    newRoles.forEach(role => {
        let timedRole = client.timedRoles.get(role.id);
        if (timedRole) {
            client.loop.add(role, newMember, timedRole);
        }
    });
});

client.once('ready', async () => {
    console.log('Bot online:'.green, client.user.tag.cyan);

    client.guilds.cache.get(process.env.GUILDID).members.fetch();
    var rand = Math.floor(Math.random() * 100) * 10 + 1000; //Entre 1s y 1,99s
    console.log('Loop establecido a'.green, Colors.gray(rand + 'ms'));
    client.loop = new Loop(client, rand);
});

if (!reloadMode) {
    client.login(process.env.TOKEN);
}