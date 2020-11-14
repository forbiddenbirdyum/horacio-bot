module.exports = {
  name: 'doubt',
  description: 'Doubts everything or user mentioned',
  aliases: ['x'],
  hasArgs: () => false,
  async execute(message) {
    const user = message.mentions.users.values().next().value;
    message.channel.send(`${user || ''}`, { files: ['https://images-ext-1.discordapp.net/external/f7fd9W1EJODquwL0hUEOoL-cHeVzOGnJ1uMplXPsL0M/https/i.kym-cdn.com/entries/icons/original/000/023/021/e02e5ffb5f980cd8262cf7f0ae00a4a9_press-x-to-doubt-memes-memesuper-la-noire-doubt-meme_419-238.png'] });
  },
};
