const axios = require('axios')
const Logger = require('../Logger')

class XimaLaya {
  constructor() { }



  cleanResult(item, author) {
    var { uid, title, customTitle, coverPath, nickname, intro, updatedAt, categoryTitle, richTitle } = item
    var array = ['｜', ' | ', '|']
    var richTitle = richTitle?.replace(/<(S*?)[^>]*>.*?|<.*? \/>/g, '')
    array.forEach(item => {
      if (title.includes(item)) {
        title = title.split(item)[0]
      }
      if (richTitle.includes(item)) {
        richTitle = richTitle.split(item)[0]
      }
    })

    return {
      id: uid,
      title: title,
      subtitle: customTitle || null,
      author: author || null,
      narrator: nickname || null,
      cover: coverPath,
      description: intro,
      publishedYear: new Date(updatedAt)?.getFullYear(),
      genres: categoryTitle,
      series: [{
        series: richTitle,
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
    let author = this.getAuthor(kw)
    return items.map(item => this.cleanResult(item, author))
  }

  /**
   * 取得作者
   * @param {*} kw 
   */
  getAuthor(kw) {
    if (kw.includes('作者') || kw.includes('原著')) {
      let list = kw.match(/[\u4e00-\u9fa5]+/g)
      if (list.findIndex(x => x == '作者') > -1) {
        return list[list.findIndex(x => x == '作者') + 1]
      }
      if (list.findIndex(x => x == '原著') > -1) {
        return list[list.findIndex(x => x == '原著') + 1]
      }
    }
  }
}

module.exports = XimaLaya
