const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder, ButtonInteraction} = require('discord.js');
const { FactChecker } = require('../../GoogleAPI');

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
		let falseClaims;
		let count = 0;

		const nextButton = new ButtonBuilder()
			.setLabel('Next')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('next')

	    const backButton = new ButtonBuilder()
			.setLabel('Back')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('back')
			backButton.setDisabled(true);

		FactChecker(InputString)
			.then((data) => {
				if (!data || Object.keys(data).length === 0) {
					return interaction.reply("Sorry, I couldn't find a claim to fact check");
				}

			    falseClaims = data.claims.flatMap(claim => claim.claimReview).filter(review => review.textualRating === 'False');
				//falseClaims.forEach(review => console.log("This claim was rated as false: ", review));

				if (falseClaims.length === 0) {
					return interaction.reply("No false claims were found.");
				}

				if (falseClaims.length === 1) {
					nextButton.setDisabled(true);
				}

				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(falseClaims[count].title)
					.setDescription(`${falseClaims[count].publisher.name} - ${falseClaims[count].publisher.site}`)
					.setURL(falseClaims[count].url)
					.setThumbnail('https://i.imgur.com/8KDypZy.png')
					.setFooter({ text: `Page ${count + 1} of ${falseClaims.length}` })
					.addFields (
						{ name: 'Query', value: `${interaction.user} asked: ${InputString}` }
					)


				
				const buttonRow = new ActionRowBuilder().addComponents(backButton, nextButton);

				return interaction.reply({ embeds: [exampleEmbed], components: [buttonRow], fetchReply: true});

			})

			.then ((reply) => {

				const filter = (i) => i.customId === 'next' || i.customId === 'back';
           		const collector = reply.createMessageComponentCollector({ 
					ComponentType: ComponentType.Button,
					filter, 
					time: 120000 // 2 Minutes timer. 
				});

				collector.on('collect', async (buttonInteraction) => {

					if (buttonInteraction.user.id !== interaction.user.id) {
						
						return buttonInteraction.reply({ content: "You cannot use this button.", ephemeral: true });
					}

					if (buttonInteraction.customId === 'next') {
			
						count++;

						if (count === falseClaims.length - 1) {

							nextButton.setDisabled(true);
						} else {

							nextButton.setDisabled(false);
						}
						backButton.setDisabled(false);
					}

					if (buttonInteraction.customId === 'back') {

						count--;

						if (count === 0) {
							backButton.setDisabled(true);
						} else {
							backButton.setDisabled(false);
						}
						nextButton.setDisabled(false);
					}

					const updatedEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(falseClaims[count].title)
					.setDescription(`${falseClaims[count].publisher.name} - ${falseClaims[count].publisher.site}`)
					.setURL(falseClaims[count].url)
					.setThumbnail('https://i.imgur.com/8KDypZy.png')
					.setFooter({ text: `Page ${count + 1} of ${falseClaims.length}` })
					.addFields (
						{ name: 'Query', value: `${interaction.user} asked: ${InputString}` }
					);
					
					await buttonInteraction.update({embeds: [updatedEmbed], components: [new ActionRowBuilder().addComponents(backButton, nextButton)] })

				})
				
			})

		//console.log(ClaimObj)



		//await interaction.reply('Pong!');
	},
};