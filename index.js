const { token, clientID, guildID } = require('./config.json');
const { resolve, path } = require('path');
const {
	Client,
	GatewayIntentBits,
	SlashCommandBuilder,
	VoiceState,
} = require('discord.js');

const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	AudioPlayerStatus
} = require('@discordjs/voice');
const { error } = require('console');
const { disconnect } = require('process');
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});


client.on('messageCreate', (message) => {
	console.log(message.content);
});

function isFapy(user) {
	return user.id === '441448978782093313'
}

const audios = [
	{ audio: './audio/ainn-cafezinho.mp3', volume: 1 },
	{ audio: './audio/aughhhh.mp3', volume: 1 },
	//{ audio: './audio/cala-boca-bando-de-corno.mp3', volume: .4},
	{ audio: './audio/sinto-cheiro-de-xoxota.mp3', volume: 1 },
	{ audio: './audio/cavalo.mp3', volume: .5 },
	{ audio: './audio/tema-triste-toguro.mp3', volume: 1 },
	{ audio: './audio/bora-filho-do-bill.mp3', volume: 1 },
	{ audio: './audio/bora-mae-do-bill.mp3', volume: 1 },
	{ audio: './audio/bora-bill.mp3', volume: 1 },
	{ audio: './audio/bora-mulher-do-bill.mp3', volume: 1 },
	{ audio: './audio/batida-de-porta-troll.mp3', volume: 1 },
	{ audio: './audio/ele-gosta.mp3', volume: 1 },
]

let isRunning = false;

function getRandomTime(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function connectBot(voiceState) {
	if (isRunning) { return };

	if (isFapy(voiceState.member.user)) {
			isRunning = true;

			const connection = joinVoiceChannel({
				channelId: voiceState.channel.id,
				guildId: voiceState.guild.id,
				adapterCreator: voiceState.channel.guild.voiceAdapterCreator,
				selfDeaf: false,
				selfMute: false,
			});

			const player = createAudioPlayer();
			player.on(AudioPlayerStatus.Playing, () => {
				console.log('playing!');
			});
			
			player.on(AudioPlayerStatus.Idle, () => {
				console.log('gone');
				disconnectBot(connection);
			});

			player.on('error', err => { console.err(error.message) })
			//const resource = createAudioResource(resolve('./audio/aughhhh.mp3'));
			const chosenMeme = audios[Math.floor(Math.random() * audios.length)]
			const resource = createAudioResource(chosenMeme.audio);
			// resource.volume.setVolume(chosenMeme.volume);
			player.play(resource);
			// Subscribe the connection to the audio player (will play audio on the voice connection)
			const subscription = connection.subscribe(player);

			let rndTime = (getRandomTime(6, 50) * 1000 * 60)
			setTimeout(()=>{
				isRunning = false;
				connectBot(voiceState)
			}, rndTime)
			console.log(`-----------------------------------------------`)
			console.log(`next entry in ${rndTime / 60000} minute(s)`)
			console.log(`-----------------------------------------------`)
	}
}
function disconnectBot(connection) {
	connection.disconnect();
}

// connect or disconnect bot on my voiceStateUpdate
client.on('voiceStateUpdate', (oldState, newState) => {
	if (!oldState && newState) {

		connectBot(newState)

	}

	if (oldState.channelId != newState.channelId) {

		connectBot(newState)

	}
	//bot enter the chat when i mute or unmute
	// if ((oldState.selfMute) && (newState.selfMute)) {
	// 	connectBot(newState)

	// }

	if (oldState && !newState) {
		disconnectBot(oldState)
	}

})

// connect or disconnect bot with slash command
// client.on('interactionCreate', (interaction) => {
// 	if (interaction.isChatInputCommand()) {
// 		console.log('running');
// 		interaction.reply({content: `let's go`})
// 		connectBot();
// 	}
// })

async function main() {

	try {
		console.log(`🚀 Starting this shit`)
		// console.log('Started refreshing application (/) commands.');
		// await rest.put(
		// 	Routes.applicationCommands(clientID, guildID), 
		// 	{ 
		// 		body: [
		// 			new SlashCommandBuilder()
		// 			.setName('Scream')
		// 			.setDescription('join the guild')
		// 			.addChannelOption((option => option.setName('channel').setDescription('Channel to join')
		// 			.setRequired(true)
		// 			.addChannelTypes(ChannelType.GuildVoice)
		// 			))
		// 			.toJSON()
		// 		]
		// });
		client.login(token).then(() => {
			console.log(`${client.user.tag} is ready`);
		});
	} catch (err) { }
}

client.login(token);
main();