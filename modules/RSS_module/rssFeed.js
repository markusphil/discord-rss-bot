const RSSFeedEmitter = require('rss-feed-emitter');

const {
  rssUserAgent,
  rssInterval,
  initialFeeds,
  feedChannel,
  maxFeedAge,
} = require('../../config.json');

const feed = new RSSFeedEmitter({ userAgent: rssUserAgent });

let rssChannel = null;

// TODO: initialze Rich-Message-Templates in Module scope

const initRssModule = (client, discordErr, discordMsg) => {
  // This function must be called in the client.once("ready") handler
  // find the channel where the Feeds will be posted to
  rssChannel = client.channels.find('name', feedChannel);
  rssChannel.send('...loading inital feeds');

  let feeds = [];

  initialFeeds.forEach(feedURL => {
    try {
      feeds.push(addFeedToList(feedURL));
    } catch (err) {
      console.log(err);
      rssChannel.send(discordErr.setDescription(feedURL + ': ' + err.message));
    }
  });
  rssChannel.send(discordMsg.setTitle('Added Feeds:').setDescription(feeds.join('\n')));
};

const startFeedEmitter = discordFeed => {
  // this function starts the eventEmitter and has to be called on the root level of your index file.
  console.log('start feed Emitter');
  return feed.on('new-item', item => {
    const feedAge = Date.now() - item.pubDate;

    if (feedAge < maxFeedAge) {
      rssChannel.send(
        discordFeed
          .setTitle(item.title)
          .setURL(item.link)
          .setFooter('from: ' + item.author)
          .setTimestamp(item.pubDate)
      );
    }
  });
};

const addFeed = payload => {
  if (!payload.args.length || payload.args.length > 2) {
    payload.message.reply('Invalid number of arguments');
  } else {
    try {
      rssChannel.send(
        payload.discordMsg.setTitle('Added Feed:').setDescription(addFeedToList(...payload.args))
      );
    } catch (err) {
      console.log(err);
      rssChannel.send(payload.discordErr.setDescription(err.message));
    }
  }
};

const listFeeds = payload => {
  rssChannel.send(
    payload.discordMsg.setTitle('Registered Feeds:').setDescription(
      feed
        .list()
        .map(item => item.url)
        .join('\n')
    )
  );
};

const removeFeed = payload => {
  if (!payload.args.length || payload.args.length > 2) {
    payload.message.reply('Invalid number of arguments');
  } else {
    try {
      rssChannel.send(
        payload.discordMsg
          .setTitle('Removed Feed:')
          .setDescription(removeFeedFromList(payload.args[0]))
      );
    } catch (err) {
      console.log(err);
      rssChannel.send(payload.discordErr.setDescription(err.message));
    }
  }
};

// helper functions only used in module

const addFeedToList = (feedURL, overwriteInterval) => {
  if (!checkUrl(feedURL)) {
    throw new TypeError('URL not valid!');
  }

  feed.add({
    url: feedURL,
    refresh: overwriteInterval || rssInterval,
  });
  return feedURL;
};

const removeFeedFromList = feedURL => {
  if (!checkUrl(feedURL)) {
    throw new TypeError('URL not valid!');
  }

  feed.remove(feedURL);
  return feedURL;
};

const checkUrl = feedURL => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  return regex.test(feedURL);
};

module.exports.feed = feed;
module.exports.addFeed = addFeed;
module.exports.listFeeds = listFeeds;
module.exports.startFeedEmitter = startFeedEmitter;
module.exports.initRssModule = initRssModule;
module.exports.removeFeed = removeFeed;
