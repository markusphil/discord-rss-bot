require('dotenv').config();
const Discord = require('discord.js');
const { prefix, feedColor } = require('./config.json');

const RssModule = require('./modules/RSS_module/commands');
const BasicModule = require('./modules/Basic_module/commands');

//init discord.js
const client = new Discord.Client();

// create commands collection on the client. This allows us to access commands inside our Modules
client.commands = new Discord.Collection();

const moduleCommands = [...BasicModule.commands, ...RssModule.commands];

moduleCommands.forEach(command => {
  client.commands.set(command.name, command);
});

// Message templates => this part should be outsourced at some time
const discordErr = new Discord.RichEmbed().setColor(0xde1738).setTitle('ERROR!');
const discordMsg = new Discord.RichEmbed().setColor(0x00ff00);
const discordFeed = new Discord.RichEmbed().setColor(feedColor);
const discordInfo = new Discord.RichEmbed().setColor(0x24a0ed);

// init Bot
client.once('ready', () => {
  console.log('ready!');
  RssModule.init(client, discordErr, discordMsg);
});

client.login(process.env.BOT_TOKEN);

// init Feed Emitter
RssModule.startEmitter(discordFeed);

//listen to commands
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) {
    message.reply("I don't understand you, sorry!");
    return;
  }
  command.execute({ message, args, discordErr, discordMsg, discordInfo });
});
