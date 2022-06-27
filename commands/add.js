const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const Colors = require('colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Comando para añadir un rol temporal')
        .addRoleOption(option => option
            .setName('rol')
            .setDescription('rol para establecer como temporal')
            .setRequired(true))
        .addNumberOption(option => option
            .setName('tiempo')
            .setDescription('tiempo que un usuario podra llevar el rol (segundos)')
            .setRequired(true)),
    /**
     * @param {CommandInteraction} interaction 
     */
    async start(interaction) {
        const client = interaction.client;
        const rol = interaction.options.getRole('rol', true);
        const timeS = interaction.options.getNumber('tiempo', true);
        const time = timeS * 1000;

        if (client.timedRoles.get(rol.id)) { await interaction.reply({ content: 'Este rol ya fue añadido', ephemeral: true }); return; }
        if (!rol.editable) { await interaction.reply({ content: 'Error, no puedo modificar este rol (Falta de permisos)', ephemeral: true }); return; }

        client.timedRoles.set(rol.id, time);
        console.log(Colors.yellow('Rol ' + Colors.grey(rol.name + ` [${rol.id}]`) + ' añadido como temporal de ' + Colors.green(timeS + 's')));
        await interaction.reply({ content: `Rol <@&${rol.id}> añadido como temporal`, ephemeral: true });
    },
};