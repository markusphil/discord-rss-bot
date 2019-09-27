require('dotenv').config();
const Discord = require('discord.js');
const { prefix, feedChannel, maxFeedAge, initialFeeds, feedColor } = require('./config.json');

const { feed, addFeed, listFeeds } = require('./rssFeed');

//init discord.js

const client = new Discord.Client();

let rssChannel = null;

// Message templates
const discordErr = new Discord.RichEmbed().setColor(0xde1738).setTitle('ERROR!');
const discordMsg = new Discord.RichEmbed().setColor(0x00ff00);

// init Bot
client.once('ready', () => {
  rssChannel = client.channels.find('name', feedChannel);
  rssChannel.send('I am alive!');
  rssChannel.send('...loading inital feeds');

  let feeds = [];
  initialFeeds.forEach(feedURL => {
    try {
      feeds.push(addFeed(feedURL));
    } catch (err) {
      console.log(err);
      rssChannel.send(discordErr.setDescription(feedURL + ': ' + err.message));
    }
  });
  rssChannel.send(discordMsg.setTitle('Added Feeds:').setDescription(feeds.join('\n')));
});

client.login(process.env.BOT_TOKEN);

feed.on('new-item', item => {
  const feedAge = Date.now() - item.pubDate;

  if (feedAge < maxFeedAge) {
    const embed = new Discord.RichEmbed()
      .setTitle(item.title)
      .setURL(item.link)
      .setFooter('from: ' + item.author)
      .setColor(feedColor)
      .setTimestamp(item.pubDate);
    rssChannel.send(embed);
  }
});

//listen to commands
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'ping':
      message.channel.send('Pong.');
      break;
    case 'echo':
      message.channel.send(args);
      break;
    case 'add':
      if (!args.length || args.length > 2) {
        message.reply('Invalid number of arguments');
      } else {
        try {
          rssChannel.send(discordMsg.setTitle('Added Feeds:').setDescription(addFeed(...args)));
        } catch (err) {
          console.log(err);
          rssChannel.send(discordErr.setDescription(err.message));
        }
      }
      break;
    case 'list':
      rssChannel.send(
        discordMsg.setTitle('Registered Feeds:').setDescription(listFeeds().join('\n'))
      );
      break;
    default:
      message.reply("I don't understand you, sorry!");
      break;
  }
});
