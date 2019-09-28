const RSSFeedEmitter = require('rss-feed-emitter');

const { rssUserAgent, rssInterval } = require('./config.json');

const feed = new RSSFeedEmitter({ userAgent: rssUserAgent });

const addFeed = (feedURL, overwriteInterval) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  if (!regex.test(feedURL)) throw new TypeError('URL not valid!');

  console.log(overwriteInterval);

  feed.add({
    url: feedURL,
    refresh: overwriteInterval || rssInterval,
  });
  return feedURL;
};

const listFeeds = () => {
  return feed.list().map(item => item.url);
};

module.exports.feed = feed;
module.exports.addFeed = addFeed;
module.exports.listFeeds = listFeeds;
