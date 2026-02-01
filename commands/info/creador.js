import PhoneNumber from 'awesome-phonenumber';

export default {
  command: ['owner', 'creador'],
  category: 'info',
  async run(client, m) {
    try {

      const number = '559296077349'
      const jid = number + '@s.whatsapp.net'

      const contact = {
        number,
        name: 'Creadora Principal 🥗',
        org: dev,
        email: 'danivelasco745@gmail.com',
        region: 'Brasil',
        website: 'https://api.stellarwa.xyz',
        note: '🐸 Creadora oficial de todo Nekotina'.'
      }

      const generateVCard = ({ number, name, org, email, region, website, note }) => {
        const phone = PhoneNumber('+' + number)
        const intl = phone.getNumber('international') || '+' + number
        const clean = (text) => String(text).replace(/\n/g, '\\n').trim()

        return `
BEGIN:VCARD
VERSION:3.0
FN:${clean(name)}
ORG:${clean(org)}
TEL;type=CELL;waid=${number}:${intl}
EMAIL:${clean(email)}
ADR:;;${clean(region)};;;;
URL:${clean(website)}
NOTE:${clean(note)}
END:VCARD`.trim()
      }

      const vcard = generateVCard(contact)

      await client.sendMessage(m.chat, {
        contacts: {
          displayName: contact.name,
          contacts: [{ vcard, displayName: contact.name }]
        }
      }, { quoted: m })

    } catch (e) {
      await client.reply(m.chat, msgglobal, m)
    }
  }
};
