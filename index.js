const Discord = require('discord.js');
const UserError = require('./UserError.js');
const { prefix } = require('./config');

const startRegex = new RegExp(`(^${prefix})`);
const { parseInputCommand, getCommands } = require('./helpers');

const client = new Discord.Client();
client.commands = new Discord.Collection();

(() => {
  getCommands((command) => {
    client.commands.set(command.name, command);
  });
})();

client.on('message', async (message) => {
  if (!startRegex.test(message.content) || message.author.bot) return;
  console.log('GOT REQUEST');
  const input = parseInputCommand(message);

  try {
    const command = client.commands.get(input.command)
    || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(input.command));

    if (!command) {
      throw new UserError('unknown command');
    }

    if (command.needsArgs() && (!input.args.length && !input.quoteID)) {
      let reply = 'you didn\'t provide any arguments';
      if (command.usage) {
        reply += command.usage;
      }

      throw new UserError(reply);
    }

    await command.execute(message, input, client);
  } catch (err) {
    if (err instanceof UserError) {
      message.reply(err.message);
      return;
    }
    console.error(err);
    message.reply('error while trying to execute that command');
  }
});

client.login(process.env.AUTH_TOKEN);
