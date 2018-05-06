const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const request = require('request-promise')
const puppeteer = require('puppeteer')
const crypto = require('crypto')
const {oAuth2Client} = require('./oAuth2Client')
const {google} = require('./oAuth2Client')
const User = require('../models/user')
const Design = require('../models/design')
const DesignTag = require('../models/designtag')
const Tag = require('../models/tag')
const authenticationEnsurer = require('./authentication-ensurer')
const axios = require('axios')

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
    const device = req.body.device
    let width, height, isMobile, userAgent
    if (device === 'sp') {
      userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
      width = 375
      height = 667
      deviceScaleFactor = 1.2
      isMobile = true
    } else {
      userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
      width = 980
      height = 600
      deviceScaleFactor = 1.2
      isMobile = false
    }
    
    const page = await browser.newPage()
    await page.setViewport({
      width: width,
      height: height,
      deviceScaleFactor: deviceScaleFactor
    })
    await page.setUserAgent(userAgent)
    await page.goto(req.body.url, { waitUntil: 'networkidle2' })
    const pageSize = await page.evaluate(() => {
      const body = document.querySelector('body')
      const width = body.clientWidth
      const height = body.clientHeight
      return { width, height }
    })
    let options = {
      type: 'jpeg',
      path: imagePath + filename + '.jpeg',
      quality: 100
    }
    console.log(pageSize)
    if(pageSize.height > 13500) {
      options.fullPage = false
      options.clip = {
        x: 0,
        y: 0,
        width: pageSize.width,
        height: pageSize.height
      }
    } else {
      options.fullPage = true
    }
    console.log(options)
    await page.screenshot(options)
    const pageTitle = await page.title()
    await browser.close()
    return {
      filename:  filename + '.jpeg',
      pageTitle: pageTitle,
      url: req.body.url
    }
  }
  
  imageUrl().then((page) => {
    User.findOne({
      where: {
        id: req.user.id
      }
    })
    .then((user) => {
      const image =  fs.createReadStream(imagePath + page.filename)

      oAuth2Client.setCredentials({access_token: user.token})
      const drive = google.drive({version: 'v3', auth: oAuth2Client})

      //フォルダがあるか確認
      drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder'" +  " and name='" + "Stock" + "'",
        spaces: 'drive',
        fields: 'files(id, name)'
      }, function(err, res) {
        if (err) {
          // Handle error
          res.status(404).send({error: err, message: 'Google Driveのフォルダの検索に失敗しました。'});
        } else {
          if(res.data.files.length) {
            //フォルダが存在する場合
            uploadFile(res.data.files[0].id)
          } else {
            //フォルダを作成
            createFolder()
          }
        }
      })

      function createFolder () {
        const fileMetadata = {
          'name': 'Stock',
          'mimeType': 'application/vnd.google-apps.folder'
        };
        drive.files.create({
          resource: fileMetadata,
          fields: 'id'
        }, function (err, file) {
          if (err) {
            // Handle error
            res.status(404).send({error: err, message: 'Google Driveへのフォルダの作成が失敗しました。'});
          } else {
            uploadFile(file.id)
          }
        });
      }

      function uploadFile(folderId) {
        const fileMetadata = {
          'name': filename,
          'parents': [folderId]
        };
        drive.files.create({
          resource: fileMetadata,
          media: {
            mimeType: 'image/jpeg',
            body: image
          },
          fields: 'id'
        }, function(err, file) {
          if (err) {
            // Handle error
            res.status(404).send({error: err, message: 'Google Driveへのアップローでエラーが発生しました。容量が上限の場合は保存が行なえません'});
          } else {
            res.send({
              image: file.data.id,
              title: page.pageTitle,
              url: page.url
            })
            fs.unlinkSync(imagePath + page.filename)
          }
        })
      }


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
  //const account = req.user.emails[0].value.split('@')[0]
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
      /*return fs.unlink(imagePath + filename)*/
      const options = {
        method: 'DELETE',
        uri: 'https://www.googleapis.com/drive/v3/files/' + filename,
        headers: {
          'Authorization': 'Bearer' + ' ' + user.token,
        }
      }
      request(options)
      .then((body) => {
        getAllDesign(user.userid, res, next)
      })
    })
  })
})

router.post('/addtag', authenticationEnsurer, (req, res, next) => {
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

router.post('/quitresult', authenticationEnsurer, (req, res, next) => {
  User.findOne({
    where: {
      id: req.user.id
    }
  })
  .then((user) => {
    const options = {
      method: 'DELETE',
      uri: 'https://www.googleapis.com/drive/v3/files/' + req.body.image,
      headers: {
        'Authorization': 'Bearer' + ' ' + user.token,
      }
    }
    request(options)
    .then((body) => {
      res.status(200).send({message: '削除しました'})
    })
    .catch((err) => {
      res.status(400).send({message: 'Google Driveのファイルの削除に失敗しました'})
    })
  })
})

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