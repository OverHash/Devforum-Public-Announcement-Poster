const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const rssParser = require('rss-parser')

const parser = new rssParser();
const feedSource = path.join(__dirname + '\\feed.rss')
const doneSource = path.join(__dirname + '\\done.json')

/**
 * 
 * @param {Parser.Output} topicData 
 */
function newTopic(topicData) {
	console.log(topicData.title);
}

parser.parseURL('https://devforum.roblox.com/c/public/public-updates-announcements.rss')
	.then(feed => {
		fs.writeFileSync(feedSource, feed, console.log)
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