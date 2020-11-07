const fs = require('fs');
const Discord = require('discord.js');
const UserError = require('./UserError.js');
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
  if (message.author.bot) return;

  const input = parseInputCommand(message);

  if (!client.commands.has(input.command)) return;

  const command = client.commands.get(input.command);

  try {
    if (command.hasArgs() && !input.args.length) {
      throw new UserError('you didn\'t provide any arguments');
    }

    await command.execute(message, input, client);
  } catch (err) {
    if (err instanceof UserError) {
      message.reply(err.message);
      return;
    }
    console.error(err);
    message.reply('Error while trying to execute that command');
  }
});

client.login(process.env.AUTH_TOKEN);
