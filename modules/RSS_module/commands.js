const { initRssModule, startFeedEmitter, addFeed, listFeeds, removeFeed } = require('./rssFeed');

module.exports = {
  commands: [
    {
      command: 'add',
      use: '<URL, ?refreshInterval>',
      description: 'adds rss feed to watchlist',
      execute: addFeed,
    },
    {
      command: 'list',
      description: 'show all followed feeds',
      execute: listFeeds,
    },
    {
      command: 'remove',
      use: '<URL>',
      execute: removeFeed,
    },
  ],
  init: initRssModule,
  startEmitter: startFeedEmitter,
};
