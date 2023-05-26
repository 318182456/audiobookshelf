const axios = require('axios')
const Logger = require('../Logger')

class XimaLaya {
  constructor() { }

  cleanResult(item) {
    var { uid, title, customTitle, coverPath, nickname, intro, createdAt, categoryTitle, richTitle } = item

    return {
      id: uid,
      title: title.split("｜").split(" | ").split("|")[0],
      subtitle: customTitle || null,
      // author: nickname || null,
      narrator: nickname || null,
      cover: coverPath,
      description: intro,
      publishedYear: new Date(updatedAt)?.getFullYear(),
      genres: categoryTitle,
      series: [{
        series: richTitle?.replace(/<(S*?)[^>]*>.*?|<.*? \/>/g, '').split("｜").split(" | ").split("|")[0],
        sequence: ""
      }]
    }
  }

  async search(kw) {
    var queryString = encodeURIComponent(kw)
    var url = `https://www.ximalaya.com/revision/search/main?core=all&kw=${queryString}`
    Logger.debug(`[XimaLaya] Search url: ${url}`)
    var items = await axios.get(url).then((res) => {
      if (!res || !res.data || !res.data.data || !res.data.data.album || !res.data.data.album.docs) return []
      return res.data.data.album.docs
    }).catch(error => {
      Logger.error('[XimaLaya] Volume search error', error)
      return []
    })
    return items.map(item => this.cleanResult(item))
  }
}

module.exports = XimaLaya
