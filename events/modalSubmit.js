const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        console.log("printing interaction");
	    console.log(interaction);
        console.log("print complete");
    }
};