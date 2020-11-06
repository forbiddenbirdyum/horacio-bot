module.exports = {
  name: 'votepin',
  description: 'Vote for pinning a message',
  execute(message, { quote, args }, client) {
    if(!quote || args.length) throw new Error('no quote or arguments provided')

    const channel = client.channels.cache.get(message.channel.id);
    channel.messages.fetch({ limit: 25 }).then(messages => {
      const target = messages.filter(msg => {
        const stringWithNoQuote = msg.content.replace(/(^>.+\n)(.+)/, '$2');
        if(stringWithNoQuote === quote) return msg;
      }).values().next().value;
      target.pin({ reason: 'voted' });
    })
  },
};