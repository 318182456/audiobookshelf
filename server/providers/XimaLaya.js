const axios = require('axios')
const Logger = require('../Logger')

class XimaLaya {
  constructor() { }

  cleanResult(item) {
    var { uid, title, customTitle, coverPath, nickname, intro, createdAt, categoryTitle, richTitle } = item

    let series = []
    richTitle?.replace(/<(S*?)[^>]*>.*?|<.*? \/>/g, '').split("｜").split(" | ").split("|").forEach(element => {
      series.push({
        series: element,
        sequence: ""
      })
    });

    return {
      id: uid,
      title,
      subtitle: customTitle || null,
      author: nickname || null,
      cover: coverPath,
      description: intro,
      publishedYear: new Date(createdAt)?.getFullYear(),
      genres: categoryTitle,
      series: series
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
