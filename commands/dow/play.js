import yts from 'yt-search';
import fetch from 'node-fetch';
import { getBuffer } from '../../lib/message.js';

export default {
  command: ['play', 'mp3', 'ytmp3', 'ytaudio', 'playaudio'],
  category: 'downloader',
  run: async (client, m, args) => {
    try {
      if (!args[0]) {
        return m.reply('🌵 Por favor, menciona el nombre o URL del video que deseas descargar')
      }

      const query = args.join(' ')
      let url, title, thumbBuffer

      if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query)) {
        const search = await yts(query)
        if (!search.all.length) {
          return m.reply('🥦 No se encontraron resultados')
        }

        const videoInfo = search.all[0]
        url = videoInfo.url
        title = videoInfo.title
        thumbBuffer = await getBuffer(videoInfo.image)

        const vistas = (videoInfo.views || 0).toLocaleString()
        const canal = videoInfo.author?.name || 'Desconocido'
        const infoMessage = `🍓✿⃘࣪◌ ֪  Descargando › ${title}

> 🍒✿⃘࣪◌ ֪ Canal › ${canal}
> 🍒✿⃘࣪◌ ֪ Duración › ${videoInfo.timestamp || 'Desconocido'}
> 🍒✿⃘࣪◌ ֪ Vistas › ${vistas}
> 🍒✿⃘࣪◌ ֪ Publicado › ${videoInfo.ago || 'Desconocido'}
> 🍒✿⃘࣪◌ ֪ Enlace › ${url}

𐙚 🌽 ｡ ↻ El archivo se está enviando, espera un momento... ˙𐙚`

        await client.sendContextInfoIndex(m.chat, infoMessage, {}, m, true, null, {
          banner: videoInfo.image,
          title: '仚 🎧 PLAY',
          body: title
        })
      } else {
        url = query
      }

      let result
      try {
        const res = await fetch(`${api.url}/dl/ytmp3?url=${encodeURIComponent(url)}&key=${api.key}`)
        result = await res.json()
        if (!result.status || !result.data || !result.data.dl) {
          throw new Error('Primera API falló')
        }
      } catch {
        try {
          const fallback = await fetch(`${api.url}/dl/youtubeplay?query=${query}&key=${api.key}`)
          result = await fallback.json()
          if (!result.status || !result.data || !result.data.download) {
            return m.reply('🌵 No se pudo descargar el *audio*, intenta más tarde.')
          }
        } catch {
          return m.reply('🌵 No se pudo procesar el enlace. El servidor no respondió correctamente.')
        }
      }

      const audioTitle = result.data.title
      const dlUrl = result.data.download || result.data.dl

      const audioBuffer = await getBuffer(dlUrl)
      let mensaje;

        mensaje = {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          fileName: `${audioTitle}.mp3`
        };

      await client.sendMessage(m.chat, mensaje, { quoted: m })

    } catch (e) {
      // console.log(e)
      await m.reply(msgglobal)
    }
  }
};
