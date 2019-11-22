# Discord Bot Variant
This is a discord bot variant of the devforum puller. Whenever a post is made in public announcements, the bot will post in a specific channel.

## Installation
* Node must be downloaded, `v12.13.0` is what I use
* Download repo
* Edit the ".env" to your configuration
* Run `npm install` in command line
* Start the program by running `node .`

## Configuration
* **`discord_token`** - the token of the discord bot
* **`announcements_channel_id`** - the channel ID where new posts should be made
* **`announcements_guild_id`** - the guild ID where posts are made
* **`poll_time`** - time in seconds to poll. Default is 60, I wouldn't go any lower to avoid rate limits.
