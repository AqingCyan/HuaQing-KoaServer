const { Op } = require('sequelize')
const { flatten } = require('lodash')
const { Movie, Music, Sentence } = require('./classic')

// 通过flow查询来查询对应类型的期刊：音乐，电影，句子
class Art {
  static async getData(artId, type, useScope = true) {
    let art = null
    const finder = {
      where: {
        id: artId,
      },
    }
    const scope = useScope ? 'bh' : null
    switch (type) {
      case 100:
        art = await Movie.scope(scope).findOne(finder)
        break
      case 200:
        art = await Music.scope(scope).findOne(finder)
        break
      case 300:
        art = await Sentence.scope(scope).findOne(finder)
        break
      case 400:
        break
      default:
        break
    }
    return art
  }

  // in查询数据库
  static async getList(artInfoList) {
    const artInfoObj = {
      100: [],
      200: [],
      300: [],
    }
    const arts = []
    for (const key of artInfoList) {
      artInfoObj[key.type].push(key.art_id)
    }
    for (let key in artInfoObj) {
      const ids = artInfoObj[key]
      if (ids.length === 0) {
        continue
      }
      key = parseInt(key, 10)
      arts.push(await Art.getListByType(ids, key))
    }
    return flatten(arts)
  }

  static async getListByType(ids, type) {
    let arts = []
    const finder = {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    }
    const scope = 'bh'
    switch (type) {
      case 100:
        arts = await Movie.scope(scope).findOne(finder)
        break
      case 200:
        arts = await Music.scope(scope).findOne(finder)
        break
      case 300:
        arts = await Sentence.scope(scope).findOne(finder)
        break
      case 400:
        break
      default:
        break
    }
    return arts
  }
}

module.exports = {
  Art,
}
