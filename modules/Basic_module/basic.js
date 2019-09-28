const ping = payload => {
  payload.message.reply('Pong!');
};

const echo = payload => {
  payload.message.reply(payload.args);
};

// This one is a little more complicated!

const help = payload => {
  console.log(payload.message.client);
  const { commands } = payload.message.client;

  let info = payload.discordInfo.setTitle('To Help you:');

  commands.forEach(cmd => {
    info.addField(cmd.use ? cmd.name + ' ' + cmd.use : cmd.name, cmd.description);
  });

  payload.message.author.send(info);
};

module.exports.ping = ping;
module.exports.echo = echo;
module.exports.help = help;
