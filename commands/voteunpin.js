const { minVotes } = require('../config');
const UserError = require('../UserError');
const { voteCollectorFactory, getMessageById } = require('../helpers');

let unpinMessage = null;
let voteCollector;

module.exports = {
  name: 'voteunpin',
  description: 'Vote for unpinning a message',
  needsArgs: () => {
    if (!voteCollector) return true;
    if (!voteCollector.ended) return false;
    return true;
  },
  get usage() {
    return `\`\`\`!${this.name} <message-link>\`\`\``;
  },
  async execute(message, { quoteID }) {
    if (!voteCollector || voteCollector.ended) {
      const chatMessage = await getMessageById(message, quoteID);
      if (!chatMessage.pinned) throw new UserError('message provided is not pinned');

      unpinMessage = chatMessage;
      voteCollector = voteCollectorFactory(this.name, message, minVotes);

      voteCollector.on('success', () => {
        unpinMessage.unpin({ reason: 'voted' });
      });
    }
  },
};
