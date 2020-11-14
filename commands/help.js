module.exports = {
  name: 'help',
  description: 'List all available commands',
  aliases: ['h'],
  hasArgs: () => false,
  async execute(message) {
    message.channel.send(`\`\`\`\n!help - List all available commands\n
!votepin - Start vote to pin a message\n
!voteunpin - Start vote to unpin a message\n
!translate - Translate a quote or text to a specified language\n
!doubt - Doubt everything or user mentioned\n\`\`\`
`);
  },
};
