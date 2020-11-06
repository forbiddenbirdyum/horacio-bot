const fs = require('fs');
const Discord = require('discord.js');
const { prefix, quotePrefix } = require('./config.json');
const startRegex = new RegExp(`(^${quotePrefix}.+\n${prefix})|(^${prefix})`);

const client = new Discord.Client();
client.commands = new Discord.Collection();

(() => {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
})();

client.on('message', message => {
  if (!startRegex.test(message.content) || message.author.bot) return;

  const input = parseInputCommand();

	if (!client.commands.has(input.command)) return;

  const command = client.commands.get(input.command);

  if(command.args && !input.args.length) {
    return message.channel.send('You didn\'t provide any arguments');
  }

  try {
    command.execute(message, input, client);
  } catch (err) {
    console.error(err);

    if(err instanceof Error) {
      message.reply(err.message);
      return;
    }
    message.reply('Error while trying to execute that command');
  }

  function parseInputCommand() {
    const quote = message.content.match(/^>.+/)?.[0].slice(quotePrefix.length);
    const args = message.content.match(/^!.+/m)?.[0].slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    return { quote, args, command };
  }
})

client.login(process.env.AUTH_TOKEN);
