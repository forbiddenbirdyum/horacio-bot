const { minVotes } = require('../config');
const UserError = require('../UserError');
const { voteCollectorFactory } = require('../helpers');

let pinMessage = null;
let voteCollector;

module.exports = {
  name: 'votepin',
  description: 'Vote for pinning a message',
  get usage() {
    return `\`\`\`!${this.name} <message-link>\`\`\``;
  },
  hasArgs: () => {
    if (!voteCollector) return true;
    if (!voteCollector.ended) return false;
    return true;
  },
  async execute(message, { args }) {
    if (!voteCollector || voteCollector.ended) {
      const [messageLink] = args;
      const messageID = messageLink.split('/').pop();
      const chatMessage = await message.channel.messages.fetch(messageID)
        .catch(() => { throw new UserError('404 Message not found 🤷'); });
      if (chatMessage.pinned) throw new UserError('message provided is already pinned');

      pinMessage = chatMessage;
      voteCollector = voteCollectorFactory(this.name, message, minVotes);

      voteCollector.on('success', () => {
        pinMessage.pin({ reason: 'voted' });
      });
    }
  },
};
