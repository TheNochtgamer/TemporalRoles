const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Te da una lista de todos los roles temporales disponibles'),
    /**
     * @param {CommandInteraction} interaction 
     */
    async start(interaction) {
        const client = interaction.client;
        const embed = new MessageEmbed()
            .setColor('DARK_GREEN').setTitle('Roles temporales').setTimestamp().setDescription('');

        if (client.timedRoles.size == 0) {
            embed.setDescription('No hay ningun rol temporal :/');
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        let count = 1;
        client.timedRoles.forEach((time, roleId) => {
            let timeS = time / 1000;
            embed.setDescription(embed.description + `${count}°- <@&${roleId}> | ${timeS}s\n`);

            count++;
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};