const { initRssModule, startFeedEmitter, addFeed, listFeeds, removeFeed } = require('./rssFeed');

module.exports = {
  commands: [
    {
      name: 'add',
      use: '<URL, ?refreshInterval>',
      description: 'adds rss feed to watchlist',
      execute: addFeed,
    },
    {
      name: 'list',
      description: 'show all followed feeds',
      execute: listFeeds,
    },
    {
      name: 'remove',
      use: '<URL>',
      description: 'removes feed if exists',
      execute: removeFeed,
    },
  ],
  init: initRssModule,
  startEmitter: startFeedEmitter,
};
