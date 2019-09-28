const { prefix } = require('../../config.json');

// those are pretty basic, right?

const ping = payload => {
  // the payload is an Object, wich holds all the data passed from the index.js
  // here we need to access the message to make an reply
  payload.message.reply('Pong!');
};

const echo = payload => {
  // in this case we also need the arguments
  payload.message.reply(payload.args);
};

// This one is a little more complicated!

const help = payload => {
  // This one is a little more complicated!
  // we are using the commands collection which we can access through the reference to the client on the message object.
  const { commands } = payload.message.client;

  // discordInfo is a prestyled discord RichEmbed Object which we send with our payload (this should be refactored later)
  let info = payload.discordInfo.setTitle('Available Commands');

  commands.forEach(cmd => {
    // the fancy  (x ? y : z) syntax is called ternary and allows to do if checks in place
    info.addField(cmd.use ? prefix + cmd.name + ' ' + cmd.use : prefix + cmd.name, cmd.description);
  });

  payload.message.author.send(info);
};

// finaly we need to export our fuctions to pass them to our modules commands file
module.exports.ping = ping;
module.exports.echo = echo;
module.exports.help = help;

// whith this basic setup you should allready be able to use most of discord.js' features =)
