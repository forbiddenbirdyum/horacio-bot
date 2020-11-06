function parseInputCommand(message) {
  const args = message.content.match(/^!.+/m)?.[0].slice(1).trim().split(/ +/);
  const command = args && args.shift().toLowerCase();

  return { args, command };
}

module.exports = {
  parseInputCommand,
};
