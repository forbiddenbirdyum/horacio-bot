const { minVotes } = require('../config');
const UserError = require('../UserError');

let votesNeeded = minVotes;
let voteRunning = false;
let userVotes = [];
let unpinMessage = null;
let voteCollector;

const filter = (msg) => {
  if (msg.content.match(/^!voteunpin$/g)) {
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
  name: 'voteunpin',
  description: 'Vote for pinning a message',
  hasArgs: () => (!(voteRunning)),
  async execute(message, { args }) {
    if (!voteRunning) {
      const [messageLink] = args;
      const messageID = messageLink.split('/').pop();
      const chatMessage = await message.channel.messages.fetch(messageID)
        .catch(() => { throw new UserError('404 Message not found 🤷'); });
      if (!chatMessage.pinned) throw new UserError('message provided is not pinned.');
      unpinMessage = chatMessage;

      voteCollector = message.channel.createMessageCollector(filter, { time: 20000 });
      voteRunning = true;
      userVotes.push(message.author.tag);
      votesNeeded -= 1;
      message.channel.send(`Voting has started, type !voteunpin to vote (votes needed: ${votesNeeded})`);

      voteCollector.on('end', () => {
        if (voteCollector.collected.size < votesNeeded) {
          message.channel.send('Not enough votes, maybe next time 😉');
        } else {
          unpinMessage.unpin({ reason: 'voted' });
          message.channel.send('Vote passed, Congratulations! 🎊 🥳 🎊');
        }

        unpinMessage = null;
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
    }
  },
};
