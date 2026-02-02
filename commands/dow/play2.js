import yts from 'yt-search'
import fetch from 'node-fetch'
import { getBuffer } from '../../lib/message.js'

export default {
  command: ['play2', 'mp4', 'ytmp4', 'ytvideo', 'playvideo'],
  category: 'downloader',
  run: async (client, m, args) => {
    try {
      if (!args[0]) {
        return m.reply('🌵 Por favor, menciona el nombre o URL del video que deseas descargar')
      }

      const query = args.join(' ')
      let url, title

      if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query)) {
        const search = await yts(query)
        if (!search.all.length) {
          return m.reply('🌵 No se *encontraron* resultados')
        }

        const videoInfo = search.all[0]
        url = videoInfo.url
        title = videoInfo.title

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

      const res = await fetch(`${api.url}/dl/ytmp4?url=${encodeURIComponent(url)}&quality=144&key=${api.key}`)
      const result = await res.json()

      if (!result.data || !result.data.dl) {
        return m.reply('🌵 No se pudo descargar el *video*, intenta más tarde.')
      }

      const videoTitle = result.data.title
      const dlUrl = result.data.dl

      const videoRes = await fetch(dlUrl)
      const videoBuffer = await videoRes.buffer()

      const mensaje = {
        video: videoBuffer,
        fileName: `${videoTitle}.mp4`,
        mimetype: 'video/mp4'
      }

      await client.sendMessage(m.chat, mensaje, { quoted: m })
    } catch (e) {
      console.log(e)
      await m.reply(msgglobal)
    }
  }
}
