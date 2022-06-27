const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const Colors = require('colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Comando para borrar un rol temporal')
        .addRoleOption(option => option
            .setName('rol')
            .setDescription('rol temporal que quieres borrar de la lista')
            .setRequired(true)),
    /**
     * @param {CommandInteraction} interaction 
     */
    async start(interaction) {
        const client = interaction.client;
        const rol = interaction.options.getRole('rol', true);

        let timedRole = client.timedRoles.get(rol.id);
        if (!timedRole) { await interaction.reply({ content: 'Este rol nunca fue añadido\nUsa el /list para ver los roles temporales', ephemeral: true }); return; }
        const timeS = timedRole / 1000;

        client.timedRoles.delete(rol.id);
        client.loop.remove(rol);
        console.log(Colors.red('Rol ' + Colors.grey(rol.name + ` [${rol.id}]`) + ' fue eliminado, tenia timeout de ' + Colors.green(timeS + 's')));
        await interaction.reply({content: `El rol <@&${rol.id}> eliminado como temporal`, ephemeral: true});
    }
}