const axios = require('axios')
const Logger = require('../Logger')

class XimaLaya {
  constructor() { }

  cleanResult(item) {
    var { playCount, title, customTitle, coverPath, nickname } = item

    return {
      playCount,
      title,
      subtitle: customTitle || null,
      author: nickname || null,
      coverPath
    }
  }

  async search(kw) {
    var queryString = encodeURIComponent(kw)
    var url = `https://www.ximalaya.com/revision/search/main?core=all&kw=${queryString}`
    Logger.debug(`[XimaLaya] Search url: ${url}`)
    var items = await axios.get(url).then((res) => {
      Logger.debug(`[XimaLaya] Search result: ${JSON.stringify(res.data)}`)
      if (!res || !res.data || !res.data.album || !res.data.album.docs) return []
      return res.data.album.docs
    }).catch(error => {
      Logger.error('[XimaLaya] Volume search error', error)
      return []
    })
    return items.map(item => this.cleanResult(item))
  }
}

module.exports = XimaLaya