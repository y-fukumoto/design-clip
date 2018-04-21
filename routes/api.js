const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const crypto = require('crypto')
const User = require('../models/user')
const Design = require('../models/design')
const DesignTag = require('../models/designtag')
const Tag = require('../models/tag')
const authenticationEnsurer = require('./authentication-ensurer')

const imagePath = path.resolve("") + '/public/images/'

/**
 * @param id
 * @type INTEGER
 * @returns Object
 * ユーザーIDからユーザーの保存したデザイン一覧をJSONで返す
 */
router.get('/designs', authenticationEnsurer, (req, res, next) => {
  User.findOne({
    where: {
      id: req.user.id
    }
  })
  .then((user) => {
    if(!user) {
      const err = new Error('userじゃない');
      err.status = 404;
      next(err);
    }
    getAllDesign(user.userid, res, next)
  })
})

/**
 * @param url
 * @type STRING
 * @returns Object
 * 入力したurlのスクリーンショットを保存し、スクショの画像パスとサイトのタイトル、urlを返す
 */
router.post('/webshot', (req, res, next) => {
  const filename = require('crypto').randomBytes(8).toString('hex')
  
  const imageUrl = async () => {
    const browser = await puppeteer.launch()
    
    const page = await browser.newPage()
    await page.goto(req.body.url)
    await page.screenshot({
      width: 980,
      height: 600,
      type: 'jpeg',
      path: imagePath + filename + '.jpeg',
      fullPage: true,
      quality: 65
    })
    const pageTitle = await page.title()
    await browser.close()
    return {
      filename:  filename + '.jpeg',
      pageTitle: pageTitle,
      url: req.body.url
    }
  }
  
  imageUrl().then((page) => {
    res.send({
      image: page.filename,
      title: page.pageTitle,
      url: page.url
    })
  }).catch((err) => {
    //const err = new Error('指定されたURLがない、または通信エラーです');
    res.status(404).send({error: err, message: '指定されたURLがない、または通信エラーです'});
  })
})

/**
 * @param id,title,url,image
 * @type Object
 * @returns Object
 * タイトル、url、画像パス、ユーザーidでデザインを作成＆保存しデザイン一覧を返す
 */
router.post('/savedesign', authenticationEnsurer, (req, res, next) => {
  User.findOne({
    where: {
      id: req.user.id
    }
  })
  .then((user) => {
    Design.create({
      title: req.body.title,
      url: req.body.url,
      image: req.body.image,
      userid: user.userid
    })
    .then((design) => {
      let tagsFunction = []
      req.body.tags.forEach((tag) => {
        tagsFunction.push(new Promise(function(resolve, reject) {
          Tag.findOrCreate({
            where: { body: tag }
          })
          .spread((tag, created) => {
            DesignTag.create({
              designId: design.id,
              tagId: tag.id
            })
            .then(() => {
              resolve()
            })
          })
        }))
      })
      Promise.all(tagsFunction).then(() => {
        getAllDesign(user.userid, res, next)
      })
    })
  })
})

router.post('/deletedesign', authenticationEnsurer, (req, res, next) => {
  let filename = ''
  User.findOne({
    where: {
      id: req.user.id
    }
  })
  .then((user) => {
    Design.findOne({
      where: {
        id: req.body.id
      }
    })
    .then((design) => {
      filename = design.image
      return design.destroy()
    })
    .then(() => {
      return fs.unlink(imagePath + filename)
    })
    .then(() => {
      getAllDesign(user.userid, res, next)
    })
  })
})

router.post('/addtag', authenticationEnsurer, (req, res, next) => {
  console.log(req.body.tag)
  Tag.findOrCreate({
    where: { body: req.body.tag }
  }).spread((tag, created) => {
    DesignTag.create({
      designId: req.body.designId,
      tagId: tag.id
    })
    .then(() => {
      res.send(JSON.stringify(tag))
    })
  })
})

router.post('/deletetag/', authenticationEnsurer, (req, res, next) => {
  Tag.findOne({
    where: { id: req.body.tagId }
  }).then((tag) => {
    DesignTag.findOne({
      where: {
        designId: req.body.designId,
        tagId: tag.id
      }
    })
    .then((designTag) => {
      designTag.destroy()
    })
    .then(() => {
      res.send({message: '削除しました'})
    })
  })
})

router.post('/quitresult', authenticationEnsurer, (req, res, next) => [
  new Promise((resolve, rejected) => {
    fs.unlink(imagePath + req.body.image, (err) => {
      if(err) {
        rejected(err)
      } else {
        resolve()
      }
    })
  })
  .then(() => {
    res.status(200).send({message: '削除しました'})
  })    
])

getAllDesign = (userid, res, next) => {
  Design.findAll({
    where: {
      userid: userid
    }
  })
  .then((designs) => {
    if(!designs) {
      res.send({})
    }
    designsFunctions = []
    designs.forEach((design) => {
      designsFunctions.push(new Promise(function(designResolve, designReject) {
        DesignTag.findAll({
          include: [
            {
              model: Tag,
              attributes: ['id', 'body']
            }
          ],
          where: { designId: design.id }
        })
        .then((designTags) => {
          let tags = []
          designTags.forEach((tag) => {
            tags.push(tag.tag)
          })
          design.tags = tags
          designResolve()
        })
      }))
    })
    Promise.all(designsFunctions).then(() => {
      res.send(JSON.stringify(designs))
    })
  })
}



module.exports = router;