const { quotePrefix } = require('./config');

function parseInputCommand(message) {
  const quote = message.content.match(/^>.+/)?.[0].slice(quotePrefix.length);
  const args = message.content.match(/^!.+/m)?.[0].slice(1).trim().split(/ +/);
  const command = args && args.shift().toLowerCase();

  return { quote, args, command };
}

/**
 * @param  {string} command
 * @param  {Message} message
 * @param  {number} votesNeeded
 * @param  {CollectorFilter} filter
 * @param  {CollectorOptions} opts
 */
function voteCollectorFactory(command, message, votesNeeded, filter, opts = { time: 20000 }) {
  if (!command) throw new Error('No Command specified');
  if (!message) throw new Error('No Message specified');
  if (!votesNeeded) throw new Error('No votesNeeded specified');
  let userVotes = [message.author.tag];
  const actualVotesNeeded = votesNeeded - 1;
  const commandRgx = new RegExp(`^!${command}$`);
  const filterWrapper = (msg) => {
    if (msg.content.match(commandRgx)) {
      if (userVotes.includes(msg.author.tag)) {
        console.log('cheats');
        msg.channel.send("Everyone only gets one vote, don't try to cheat 👮");
        return false;
      }

      userVotes.push(msg.author.tag);
      return filter ? filter.call(null, msg) : true;
    }
    return false;
  };

  const voteCollector = message.channel.createMessageCollector(filterWrapper, opts);

  // Custom events make it easier to use this interface
  voteCollector.on('end', () => {
    if (voteCollector.collected.size < actualVotesNeeded) {
      message.channel.send('Not enough votes, maybe next time 😉');
      voteCollector.emit('failure');
    } else {
      message.channel.send('Vote passed, Congratulations! 🎊 🥳 🎊');
      voteCollector.emit('success');
    }

    userVotes = [];
  });

  voteCollector.on('collect', () => {
    if (voteCollector.collected.size >= actualVotesNeeded) {
      voteCollector.stop();
      voteCollector.emit('success');
    } else {
      message.channel.send(`+1 vote, only ${actualVotesNeeded - voteCollector.collected.size} more to go!`);
    }
  });

  // Making sure setup time is taken into account
  voteCollector.resetTimer();

  message.channel.send(`Voting has started, type !${command} to vote (votes needed: ${actualVotesNeeded})`);
  return voteCollector;
}

module.exports = {
  parseInputCommand,
  voteCollectorFactory,
};
