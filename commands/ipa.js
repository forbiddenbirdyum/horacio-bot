const fetch = require('node-fetch');
const cheerio = require('cheerio');
const UserError = require('../UserError');

module.exports = {
  name: 'ipa',
  description: 'Get IPA notation for the specified word',
  needsArgs: () => true,
  get usage() {
    return `\`\`\`
!ipa word
\`\`\`
    `;
  },
  async execute(message, { args }) {
    console.log(args);
    const lang = args.pop();
    const word = args.join('_');
    const response = await fetch(`https://en.wiktionary.org/wiki/${encodeURI(word.toLowerCase())}`);
    if (response.status === 404) throw new UserError('Could not find matching Page');
    if (!response.ok) throw new Error(response.statusText);
    const html = await response.text();
    const $ = cheerio.load(html);
    if (!$(`#${lang}`).html()) throw new UserError('No entry for this language found');
    const langNode = $(`#${lang}`);
    let result = langNode
      .parent()
      .nextUntil('ul')
      .last()
      .next()
      .children()
      .find('.IPA')
      .text();
    if (!result) {
      result = $(`h2 > span#${lang}`)
        .parent()
        .next()
        .next()
        .next()
        .next()
        .next()
        .children()
        .find('.IPA')
        .first()
        .text();

      if (!result) throw new UserError('No entry for this language found');
    }
    message.channel.send(result);
    // slowly going insane
    // console.log(ipa);
  },
};
