const { SlashCommandBuilder } = require('discord.js');
const { FactChecker } = require('../../ApiTest');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('factcheck')
		.setDescription('Fact Checks Your Message')
		.addStringOption(option =>
			option
			.setName('input')
			.setDescription('The message you wanted fact checked')
			.setRequired(true),
		),
		
	async execute(interaction) {

		const InputString = interaction.options.getString('input');

		FactChecker(InputString);

		await interaction.reply('Pong!');
	},
};