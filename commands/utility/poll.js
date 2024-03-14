const { EmbedBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

function calculateNumSquares(votes, total){
    return Math.floor(votes / total * 10)
}

function calculatePercentage(votes, total){
    return `${(votes / total) * 100}%`
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Simple polling'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('Poll')
			.setTitle('New Poll');
        
        const fields = {
            pollTitle: new TextInputBuilder()
            .setCustomId('pollTitle')
            .setLabel('What would you like to call this poll?')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1000)
            .setMinLength(1)
            .setPlaceholder("Enter a title")
            .setRequired(true),
            firstChoice: new TextInputBuilder()
            .setCustomId('firstChoice')
            .setLabel('First Option')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1000)
            .setRequired(true),
            secondChoice: new TextInputBuilder()
            .setCustomId('secondChoice')
            .setLabel('Second Option')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1000)
            .setRequired(true),
            thirdChoice: new TextInputBuilder()
            .setCustomId('thirdChoice')
            .setLabel('Third Option')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1000)
        }

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(fields.pollTitle);
        const secondActionRow = new ActionRowBuilder().addComponents(fields.firstChoice);
        const thirdActionRow = new ActionRowBuilder().addComponents(fields.secondChoice);
        const fourthActionRow = new ActionRowBuilder().addComponents(fields.thirdChoice);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);


        // Show the modal to the user
        await interaction.showModal(modal);

        const modalSubmission = await interaction.awaitModalSubmit({ time: 60000 })
            .catch(console.err);

        
        const pollTitle = modalSubmission.fields.getTextInputValue('pollTitle');
        const firstChoice = modalSubmission.fields.getTextInputValue('firstChoice');
        const secondChoice = modalSubmission.fields.getTextInputValue('secondChoice');
        const thirdChoice = modalSubmission.fields.getTextInputValue('thirdChoice');

        var votes = {
            firstChoice: 0,
            secondChoice: 0,
            thirdChoice: 0,
            total: 0
        }
        
        const pollEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(pollTitle)
        .setDescription('Choose one of the following options')
        .addFields(
            { name: '\u200B', value: `${firstChoice} - ${calculatePercentage(votes.firstChoice, votes.total)}
            ${':blue_square:'.repeat(calculateNumSquares(votes.firstChoice, votes.total))}${':black_large_square:'.repeat((10 - calculateNumSquares(votes.firstChoice, votes.total)))}
            ${secondChoice} - ${calculatePercentage(votes.secondChoice, votes.total)}
            ${':blue_square:'.repeat(calculateNumSquares(votes.secondChoice, votes.total))}${':black_large_square:'.repeat((10 - calculateNumSquares(votes.secondChoice, votes.total)))}
            ${thirdChoice} - ${calculatePercentage(votes.thirdChoice, votes.total)}
            ${':blue_square:'.repeat(calculateNumSquares(votes.thirdChoice, votes.total))}${':black_large_square:'.repeat((10 - calculateNumSquares(votes.thirdChoice, votes.total)))}` },
        );
            

        await modalSubmission.reply({ embeds: [pollEmbed] });
        
	},
};