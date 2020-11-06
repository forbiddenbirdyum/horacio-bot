const { minVotes } = require('../config');

let votesNeeded = minVotes;
let voteRunning = false;
let userVotes = [];
let pinMessage = null;
let voteCollector;

const filter = (msg) => {
  if (msg.content.match(/^!votepin$/g)) {
    if (userVotes.includes(msg.author.tag)) {
      msg.channel.send("Everyone only gets one vote, don't try to cheat 👮");
      return false;
    }
    userVotes.push(msg.author.tag);
    return true;
  }
  return false;
};

module.exports = {
  name: 'votepin',
  description: 'Vote for pinning a message',
  hasArgs: () => (!(voteRunning)),
  execute(message, { args }) {
    if (!voteRunning) {
      voteCollector = message.channel.createMessageCollector(filter, { time: 20000 });
      voteRunning = true;
      userVotes.push(message.author.tag);
      votesNeeded -= 1;
      message.channel.send(`Voting has started, type !votepin to vote (votes needed: ${votesNeeded})`);
      voteCollector.on('end', () => {
        if (voteCollector.collected.size < votesNeeded) {
          message.channel.send('Not enough votes, maybe next time 😉');
        } else {
          pinMessage.pin({ reason: 'voted' });
        }

        pinMessage = null;
        voteRunning = false;
        userVotes = [];
        votesNeeded = minVotes;
      });

      voteCollector.on('collect', () => {
        if (voteCollector.collected.size >= votesNeeded) {
          voteCollector.stop();
        } else {
          message.reply(`has voted, only ${votesNeeded - voteCollector.collected.size} more to go!`);
        }
      });

      const [messageLink] = args;
      const messageID = messageLink.split('/').pop();
      message.channel.messages.fetch(messageID)
        .then((foundMessage) => {
          pinMessage = foundMessage;
        })
        .catch((err) => console.error(err));
    }
  },
};
