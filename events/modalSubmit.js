const { Events } = require('discord.js');

// Apparently this is redundant!

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
    }
};