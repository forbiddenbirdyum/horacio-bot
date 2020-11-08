const fs = require('fs');
const Discord = require('discord.js');
const UserError = require('./UserError.js');
const { prefix, quotePrefix } = require('./config');

const startRegex = new RegExp(`(^${quotePrefix}.+\n${prefix})|(^${prefix})`);
const { parseInputCommand } = require('./helpers');

const client = new Discord.Client();
client.commands = new Discord.Collection();

(() => {
  const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
})();

client.on('message', async (message) => {
  if (!startRegex.test(message.content) || message.author.bot) return;

  const input = parseInputCommand(message);

  try {
    if (!client.commands.has(input.command)) {
      throw new UserError('unknown command');
    }

    const command = client.commands.get(input.command);

    if (command.hasArgs() && !input.args.length) {
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
