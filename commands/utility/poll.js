const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Simple polling'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('Poll')
			.setTitle('New Poll');

        const pollTitle = new TextInputBuilder()
            .setCustomId('pollTitle')
            .setLabel('What would you like to call this poll?')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1000)
            .setMinLength(1)
            .setPlaceholder("Enter a title")
            .setRequired(true);

        // Create the text input components

        const firstChoice = new TextInputBuilder()
            .setCustomId('firstChoice')
            .setLabel('First Option')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1000)
            .setRequired(true);
            
        
        const secondChoice = new TextInputBuilder()
            .setCustomId('secondChoice')
            .setLabel('Second Option')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1000)
            .setRequired(true);

        const thirdChoice = new TextInputBuilder()
            .setCustomId('thirdPlayer')
            .setLabel('Third Option')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1000);

            // An action row only holds one text input,
            // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(pollTitle);
        const secondActionRow = new ActionRowBuilder().addComponents(firstChoice);
        const thirdActionRow = new ActionRowBuilder().addComponents(secondChoice);
        const fourthActionRow = new ActionRowBuilder().addComponents(thirdChoice);

            // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

            // Show the modal to the user
        await interaction.showModal(modal);
	},
};