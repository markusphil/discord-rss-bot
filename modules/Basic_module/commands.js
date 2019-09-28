const { ping, echo, help } = require('./basic');

module.exports = {
  commands: [
    {
      name: 'ping',
      description: 'classic...',
      execute: ping,
    },
    {
      name: 'echo',
      use: '<Any>',
      description: 'returns any argument',
      execute: echo,
    },
    {
      name: 'help',
      description: 'lists all available commands',
      execute: help,
    },
  ],
};
