const { getCommands } = require('../helpers');

module.exports = {
  name: 'help',
  description: 'List all available commands',
  aliases: ['h'],
  needsArgs: () => false,
  async execute(message) {
    const commandsArray = [];
    getCommands((command) => {
      commandsArray.push(command);
    });

    const textCommand = commandsArray.map((c) => `!${c.name} – ${c.description}`);

    message.channel.send(`\`\`\`${textCommand.join('\n')}\`\`\``);
  },
};
