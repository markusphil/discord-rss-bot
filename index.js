require('dotenv').config();
const Discord = require('discord.js');
const RSSFeedEmitter = require('rss-feed-emitter');
const {
  prefix,
  rssUserAgent,
  rssInterval,
  feedChannel,
  maxFeedAge,
  initialFeeds,
  feedColor,
} = require('./config.json');

//init discord.js

const client = new Discord.Client();

let rssChannel = null;

const discordErr = new Discord.RichEmbed().setColor(0xde1738).setTitle('ERROR!');

client.once('ready', () => {
  console.log('Ready!');
  rssChannel = client.channels.find('name', feedChannel);
  rssChannel.send('I am alive!');
  rssChannel.send('...loading inital feeds');

  initialFeeds.forEach(feedURL => {
    try {
      feed.add({
        url: feedURL,
        refresh: rssInterval,
      });
    } catch (err) {
      console.log(err);
      rssChannel.send(discordErr.setDescription(err.message));
    }
  });
});

client.login(process.env.BOT_TOKEN);

//init feed emitter

const feed = new RSSFeedEmitter({ userAgent: rssUserAgent });

feed.on('new-item', item => {
  const feedAge = Date.now() - item.pubDate;

  if (feedAge < maxFeedAge) {
    const embed = new Discord.RichEmbed()
      .setTitle(item.title)
      .setURL(item.link)
      .setFooter('new post from: ' + item.author)
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

  console.log(command);

  if (command === 'ping') {
    message.channel.send('Pong.');
  } else if (command === 'echo') {
    message.channel.send(args);
  } else if (command === 'add') {
    if (!args.length || args.length > 2) {
      message.reply('Invalid number of arguments');
    } else {
      const feedObject = {
        url: args[0],
        refresh: args[1] || rssInterval,
      };
      try {
        const list = feed.add(feedObject);
        const rssLinks = list.map(item => item.url);
        message.reply(rssLinks || 'ups I failed');
      } catch (err) {
        console.log(err);
        rssChannel.send(discordErr.setDescription(err.message));
      }
    }
  } else if (command === 'list') {
    const list = feed.list();
    console.log(list);
    const rssLinks = list.map(item => item.url);
    message.reply(rssLinks || 'ups I failed');
  } else {
    message.reply("I don't understand you, sorry!");
  }
});
