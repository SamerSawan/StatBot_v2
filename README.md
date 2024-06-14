### Why make discord bots ?

* **Community related features**: Organize events, Moderate chat
* **Automate Repetitive Tasks**: Managing roles, Scheduling events, Handling routine tasks
* **Customizing Server Experience**: Custom commands, games, utilities
* **Build new skills**: Learn Javascript, Typescript or API Integration skills in useful and fun way

### Different options for creating discord bots

The most popular framework for creating discord bots is DiscordJS, which is a javascript library for interacting with the discord API. There are many other options if you don't know javascript or want to use another language, the most popular of which are **discord.py** and **pycord** for python and **DisCatSharp** for C#. For other options, you can refer to https://github.com/apacheli/discord-api-libs which has a nice list that contains many different libraries that work with the discord API. 
### What we're learning

To simplify the process of learning how to make a discord bot, we're going to cover the following topics by creating a simple polling command:

* Creating a discord bot in the Discord Developer Portal
* Securing your access token
* Creating the "main" file to launch your bot
* Command handling (registering and reloading commands)
* Creating and updating Modals
* Buttons and Saving user selections

### Getting Started

#### The Discord Developer Portal
https://discord.com/developers/applications

The first step is to create your "discord application" (discord bot) on the developer portal

![image](https://github.com/SamerSawan/StatBot_v2/assets/67536733/66a35af3-da7b-4ce1-aa69-00d06eb74486)


From here, you can customize your bot however you like with a custom description, profile picture and name!

Once done, you can head over to "Installation", where you will give your bot permissions and create an invite link to bring it into your server. It's important to have a server specifically for testing your bot and newly created commands, before releasing them for use by everyone. You can also do this from the OAuth2 section.

Finally, we need to create our token our bot's security token. This can be found in the "Bot" section of the portal. This is what it looks like: 
![image](https://github.com/SamerSawan/StatBot_v2/assets/67536733/1514d5ef-6a7f-4bb2-8654-d0a064095936)

Note: you should always protect your security token and make sure you don't share it with anyone! I reset my token immediately after taking the screenshot; Having your token leak can lead to other people creating their own functionality to your own bot and wreak havoc. 

Make sure you copy it to a notepad, as we will need it when we start creating our project.

#### Adding the discord bot to your server

![image](https://github.com/SamerSawan/StatBot_v2/assets/67536733/a31b23a1-edb6-45e5-8f20-6caac5379f4c)


Before we start coding, we have to add the bot to a server, or a testing environment, so we can test our code. I suggest doing this in a private server with maximum permissions (applications.commands and bot with administrator permissions) in your test environment, then removing permissions once you're ready to add it to a public server.
#### Configuration file

once we've created our bot, we can now get started with coding our bot. First and foremost, we must begin with a configuration file that holds our discord token. We do this so we can protect our application from other people, as leaked tokens can lead to other people defining behaviour for your bot that you dont necessarily want. 

Create a config.json file in your project directory and paste in your token. We're also going to need the clientID, which you can find in the Discord Developer Portal under General Information, as well as the guildID, which is the server ID for the server you'll be using as a testing environment. This can be found by enabling developer mode in your discord settings, then right clicking the server title and clicking on "Copy ID". You'll be able to access your token and IDs in other files using require()
```
{
	"token": "your-token-goes-here",
	"clientId": "your-application-id-goes-here",
	"guildId": "your-server-id-goes-here"
}
```

If you are planning on using git for version control, it's important to add config.json to your gitignore file, to avoid leaking your token in case you store your changes on Github or Gitlab.

#### Running your bot for the first time

Just to be sure we're on the right track, we're going to run the bot to make sure it's been created properly. For this, we can use the following template code straight from the discordjs.guide docs, which uses discord events to check when your bot is ready:

```
//index.js
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
```

Then, to actually run this, we can run ```node index.js``` in the terminal
If your bot is running, then great! you'll see it online in the server, and you'll also see the logged message.

#### Creating, loading and registering slash commands and handling events

In order for your bot to have functioning commands, we must first create, load and register our commands for our bot. Creating the command involves writing out the functionality for the specific command, loading the command loads it into your currently running instance of the bot and registering the command registers it either for an individual server (private test environment) or globally (for all servers). Let's create a "ping" command that allows users to check their ping. 

```
// index.js
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const pingCommand = {
  data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};

...
```

To create a command, we use SlashCommandBuilder, which allows us to set a name and description for the command. Command names must be between 1-32 characters and contain no capital letters, spaces, or symbols other than `-` and `_`. For every command, we also need a function that responds to the user in some way. If a command does not result in a response from the bot, Discord will show that the command failed even if your bot actually did something as a result of running the command. We will cover a few different types of responses we can send via our bot in the next section.

Now that our command is created, we have to actually deploy it either globally or to our specified test environment or server. Commands only need to be registered once and redeployed when we make changes to them. 
Since discord enforces a daily limit on the number of times you can "create" commands (redeploying a command counts as command creation), 
the recommended best practice is to write your deployment script in a new file, but since we're only going to be covering two commands, we'll handle deployment in index.js instead of creating a new script for it. 
```
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: [pingCommand.data] },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
```
Now, the command should show up when we try to run it, but the bot will not respond. This is because we have not handled what happens when the bot receives a command. Let's do that now.

```
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		try {
			await pingCommand.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
});
```
Discord actively listens for interactions, and we can handle what happens when we receive interactions.
With this implementation, we can now run the ping command.

![image](https://github.com/SamerSawan/StatBot_v2/assets/67536733/b267e0cb-922a-45a8-a8fc-aa0f0d6ba742)


### Creating a polling command

We're now going to look at creating a polling command `/poll` that will allow users to create polls and have people vote between three options. This will allow us to explore a few crucial parts of discordjs, such as modals, embeds, buttons and collectors. Let's first create a new constant called `pollCommand` inside of the `index.js` folder. 

```
const { SlashCommandBuilder } = require('discord.js');

const pollCommand = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Simple polling command'),
	async execute (interaction) {
		await interaction.reply('polling command received');
	}
```

We will be extending this functionality bit by bit until we have the behaviour we expect, but first, we'll modify our event handling and deployment to include pollCommand
```
(async () => {
	try {
		console.log(`Started refreshing application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: [pingCommand.data, pollCommand.data] },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();



client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		try {
			await pingCommand.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
	if (interaction.commandName === 'poll') {
        try {
            await pollCommand.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});
```

#### Modals

Modals are often referred to as overlays, dialogs or pop ups. We can use them as pop up alerts, or sometimes to let our user fill out some information, which is what we'll do in this case. We'll begin by creating a modal representing the poll, as well as the fields for each poll. We'll first update our imports:

```
const { ActionRowBuilder, TextInputBuilder, SlashCommandBuilder, ModalBuilder, TextInputStyle } = require('discord.js');
```

Next, we'll handle creating a new modal, adding fields and action rows to said modal then displaying it to the user

```
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
```

our ModalBuilder allows us to give our Modal a custom ID and title, as well as components. Components come in the form of ActionRows, which can be a few different things, among which are TextInputFields and Buttons. Each text input is created with a TextInputBuilder, which allows us to style our text inputs and add labels, placeholders and set their length, among other things. It also allows us to decide whether a text input field is required or not. Once we've created our fields, we can add each of them as an ActionRowBuilder. We create a new ActionRowBuilder for each one because we don't want multiple text inputs on the same row.

Finally, we add the Action Rows to our modal, show the modal to our user and then await their submission.

#### Embeds

![image](https://github.com/SamerSawan/StatBot_v2/assets/67536733/9fa48f42-a1af-4b5e-b785-ba879ce6c5ab)


Embeds are "fancier" messages that you can often see sent by bots. Some popular bots that use embeds are bots like Mudae Gacha, which is a card collecting bot for anime characters. 

![image](https://github.com/SamerSawan/StatBot_v2/assets/67536733/ebef4be8-db26-4471-9231-3530df7377d6)


We're going to create one for our poll, to display the options and their current votes. To do this, we'll update our imports and write a function called createPollEmbed, as well as some helper functions:
```
const { EmbedBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
```

We'll also add a dictionary to store the votes, and a set of voters to ensure that each user can vote only once

```
var votes = {

            firstChoice: 0,

            secondChoice: 0,

            thirdChoice: 0,

            total: 0

        }

const voters = new Set()
```

```
// Calculates the number of emoji squares to display

function calculateNumSquares(votes, total){

    return Math.floor(votes / total * 10)

}
```

```
//Calculates the percentage

function calculatePercentage(votes, total){

    return `${(votes / total) * 100}%`

}
```

```
function createPollEmbed(){

            console.log(votes)

            const pollEmbed = new EmbedBuilder()

                .setColor(0x0099FF)

                .setTitle(pollTitle)

                .setDescription('Choose one of the following options')

                .addFields(

                    { name: '\u200B', value: `${firstChoice} - 
                    ${calculatePercentage(votes.firstChoice, votes.total)}

                    ${':blue_square:'.repeat(calculateNumSquares(votes.firstChoice, votes.total))}${':black_large_square:'.repeat((10 - calculateNumSquares(votes.firstChoice, votes.total)))}

${secondChoice} - ${calculatePercentage(votes.secondChoice, votes.total)}

                    ${':blue_square:'.repeat(calculateNumSquares(votes.secondChoice, votes.total))}${':black_large_square:'.repeat((10 - calculateNumSquares(votes.secondChoice, votes.total)))}

${thirdChoice} - ${calculatePercentage(votes.thirdChoice, votes.total)}

                    ${':blue_square:'.repeat(calculateNumSquares(votes.thirdChoice, votes.total))}${':black_large_square:'.repeat((10 - calculateNumSquares(votes.thirdChoice, votes.total)))}` },

                );

            return pollEmbed;

        }
```

In order to create an embed, we use discordjs' built in EmbedBuilder method, which among other options, lets us set the color, title, description and fields within the embed. For our case, we show the poll title, then for each field, we show the field as well as it's corresponding percentage of votes. We add '\u200B' to set the name of the field to null, which gives us a nice spacing between the description and the fields. Each value is calculated using calculatePercentage and calculateNumSquares, which will display a fake progress bar that increments in 10%s. 

Now that we've created a function for our embed, we must first create buttons before we can actual display the embed, as the buttons will be a part of the embed.

#### Buttons

In order to create functional buttons, we first need to update our imports:
```
const { EmbedBuilder, ButtonBuilder} = require('@discordjs/builders');

const { ActionRowBuilder, ComponentType, ButtonStyle, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
```

Then, we fetch the choices that the poll creator gave:

```
const pollTitle = modalSubmission.fields.getTextInputValue('pollTitle');

        const firstChoice = modalSubmission.fields.getTextInputValue('firstChoice');

        const secondChoice = modalSubmission.fields.getTextInputValue('secondChoice');

        const thirdChoice = modalSubmission.fields.getTextInputValue('thirdChoice');
```

Then, using the button builder method provided by discordjs, we build our buttons with a custom id, a label and a style

```
const firstChoiceButton = new ButtonBuilder()

        .setCustomId('firstChoiceButton')

        .setLabel(firstChoice)

        .setStyle(ButtonStyle.Secondary)

  
const secondChoiceButton = new ButtonBuilder()

        .setCustomId('secondChoiceButton')

        .setLabel(secondChoice)

        .setStyle(ButtonStyle.Secondary)

  

const thirdChoiceButton = new ButtonBuilder()

        .setCustomId('thirdChoiceButton')

        .setLabel(thirdChoice)

        .setStyle(ButtonStyle.Secondary)

  

const row = new ActionRowBuilder()

        .addComponents(firstChoiceButton, secondChoiceButton, thirdChoiceButton)
```

and we can now put it all together with the following line:

```
const response = await modalSubmission.reply({ embeds: [createPollEmbed(votes)], components: [row], fetchReply: true });
```

The last thing we're going to do is cover collectors, so that we can add functionality to the buttons created with our embed

#### Collectors

Collectors are used to collect additional user input after the first command was sent. An example of this would be a quiz bot, or a poll bot. Collectors can either 'collect' or 'end', and here we'll need to use both.

```
const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600_000 });

collector.on('collect', i => {

            if (voters.has(i.user.id)) {

              i.reply({content: `You've already voted on this poll!`, ephemeral: true });

            }

            else {

                voters.add(i.user.id);

                switch(i.customId){

                    case 'firstChoiceButton':

                        votes.firstChoice = votes.firstChoice += 1;

                        votes.total = votes.total += 1;

                        console.log(votes);

                        i.update({embeds: [createPollEmbed(votes)], components: [row], fetchReply: true})

                        break;

                    case 'secondChoiceButton':

                        votes.secondChoice = votes.secondChoice += 1;

                        votes.total = votes.total += 1;

                        console.log(votes);

                        i.update({embeds: [createPollEmbed(votes)], components: [row], fetchReply: true})

                        break;

                    case 'thirdChoiceButton':

                        votes.thirdChoice = votes.thirdChoice += 1;

                        votes.total = votes.total += 1;

                        console.log(votes);

                        i.update({embeds: [createPollEmbed(votes)], components: [row], fetchReply: true})

                }

            }

  

        });

collector.on('end', i => {

	response.edit({content: 'The poll has ended!', embeds: [], components: [], })

})
```

First, we begin by creating a collector, which times out after 10 minutes. Throughout the 10 minutes, it'll be in "collect" mode, in which it will check if a user has already voted, and if they have, itll return an Ephemeral response, one only that specific user can see, to let them know that they've already voted. If they have not yet voted, it'll check which button they clicked, add the vote to that button, and then lock the user out of voting again. Once the 10 minutes are up, the embed message is edited and returns "The poll has ended".

### Conclusion

To recap, we covered how to create, load and deploy commands, and then we explored certain options for more complicated commands, including modals, buttons, embeds and collectors. For further reading, on any of the above subjects, you can refer to the official discord.js documentation. If you want to use discord's built in poll functionality, you can get more info here:
https://discord.js.org/docs/packages/discord.js/14.15.1/Poll:Class. To see what commands/utility/poll.js should look like, refer to this page: https://github.com/SamerSawan/StatBot_v2/blob/main/commands/utility/poll.js

### How can we take this particular command further?

* Storing user input in a remote database or a google doc,
* Allow users change their vote
* Allow poll creator to change the duration of the poll
* Allow the poll creator to end the poll using a button only they can see/use

### Other ideas for cool stuff you can do with a discord bot:

* Videogame Leaderboard for friends
* Time tracker that collects data based on discord activity (currently playing, voice channel join / duration of time spent in voice chat)
* Simple idle games
