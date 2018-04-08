const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const crypto = require('crypto')
const User = require('../models/user')
const Design = require('../models/design')
const authenticationEnsurer = require('./authentication-ensurer')

const imagePath = path.resolve("") + '/public/images/'

router.get('/designs', authenticationEnsurer, (req, res, next) => {
  User.findOne({
    where: {
      id: req.user.id
    }
  })
  .then((user) => {
    if(!user) {
      return new Error('userじゃない')
    }
    Design.findAll({
      where: {
        userid: user.userid
      }
    })
    .then((designs) => {
      if(!designs) {
        res.send({})
      }
      res.send(JSON.stringify(designs))
    })
  })
})

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
  })  
})

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
    .then(() => {
      Design.findAll({
        where: {
          userid: user.userid
        }
      })
      .then((designs) => {
        res.send(JSON.stringify(designs))
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
      Design.findAll({
        where: {
          userid: user.userid
        }
      })
      .then((designs) => {
        res.send(JSON.stringify(designs))
      })
    })
  })
})



module.exports = router;