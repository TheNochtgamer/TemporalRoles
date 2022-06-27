const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Te dice pong y la version.'),
    /**
     * @param {CommandInteraction} interaction 
     */
    async start(interaction) {
        console.log('ping by', interaction.user.tag);

        const package = require('../package.json');
        await interaction.reply({ content: `<@!${interaction.user.id}> - ${interaction.client.ws.ping}ms Pong!\nVer: ${package.version}`, ephemeral: true });
    },
};