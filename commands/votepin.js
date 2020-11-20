const { minVotes } = require('../config');
const UserError = require('../UserError');
const { voteCollectorFactory, getMessageById } = require('../helpers');

let pinMessage = null;
let voteCollector;

module.exports = {
  name: 'votepin',
  description: 'Vote for pinning a message',
  get usage() {
    return `\`\`\`!${this.name} <message-link>\`\`\``;
  },
  needsArgs: () => {
    if (!voteCollector) return true;
    if (!voteCollector.ended) return false;
    return true;
  },
  async execute(message, { quoteID }) {
    if (!voteCollector || voteCollector.ended) {
      const chatMessage = await getMessageById(message, quoteID);
      if (chatMessage.pinned) throw new UserError('message provided is already pinned');

      pinMessage = chatMessage;
      voteCollector = voteCollectorFactory(this.name, message, minVotes);

      voteCollector.on('success', () => {
        pinMessage.pin({ reason: 'voted' });
      });
    }
  },
};
