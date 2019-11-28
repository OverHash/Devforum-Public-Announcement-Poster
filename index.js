const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const rssParser = require('rss-parser')
const discord = require('discord.js');

require('dotenv').config();
const parser = new rssParser();
const feedSource = path.join(__dirname + '\\feed.rss')
const doneSource = path.join(__dirname + '\\done.json')

const client = new discord.Client();
let guild;

function newTopic(topicData) {
	console.log(JSON.stringify(topicData));

	if (guild) {
		const channel = guild.channels.get(process.env.announcements_channel_id)
		if (channel) {
			channel.send(`New post in **Public**.\n\n**${topicData.title}**\n${topicData.link}\n\n`)
		}
	}
}

// pull updates
setInterval(() => {
	parser.parseURL('https://devforum.roblox.com/c/public/public-updates-announcements.rss')
	.then(feed => {
		fs.writeFileSync(feedSource, JSON.stringify(feed), console.log)
		fs.readFile(doneSource, 'utf-8', (err, source) => {
			if (err) throw err;

			source = JSON.parse(source);
			source.latestPulled = Date.now();

			for (let i=0; i < feed.items.length; i++) {
				const item = feed.items[i];
				let done = false;

				// check if already done
				for (let k=0; k < source.doneItems.length; k++) {
					const doneItem = source.doneItems[k];

					if (doneItem.title === item.title) {
						done = true
					}
				}

				// check if not done, and do stuff!
				if (!done) {
					newTopic(item);
					source.doneItems.push({
						title: item.title,
						timestamp: Date.now()
					})
				}
			}

			fs.writeFileSync(doneSource, JSON.stringify(source, null, 4), console.log);
		})
	})
}, process.env.poll_time*1000);

// log in to discord client
client.on('ready', () => {
	guild = client.guilds.find(guild => guild.name === 'test')
	console.log('logged in at ' + new Date())
})

client.login(process.env.discord_token)