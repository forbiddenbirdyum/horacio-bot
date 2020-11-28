const fetch = require('node-fetch');
const cheerio = require('cheerio');
const UserError = require('../UserError');

module.exports = {
  name: 'ipa',
  description: 'Get IPA notation for the specified word',
  needsArgs: () => true,
  get usage() {
    return `\`\`\`
!ipa word language
\`\`\`
    `;
  },
  async execute(message, { args }) {
    const [word, lang] = args;
    if (!lang) throw new UserError('language argument is missing');
    const response = await fetch(`https://www.howtopronounce.com/${lang.toLowerCase()}/${word.toLowerCase()}`);
    if (response.status === 404) throw new UserError('could not find anything related to your search');
    if (!response.ok) throw new Error(response.statusText);
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = $('div.toggleIpaHypenate.d-flex > span.languageTitle.whiteSpaceNoWrap:contains("IPA")')
      .next()
      .children()
      .map(function fn() {
        return $(this).text();
      })
      .get()
      .join(' ');
    if (!result) throw new UserError('could not find IPA for specified word');
    message.channel.send(result);
  },
};
