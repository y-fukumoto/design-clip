const config = require('../config')
const {google} = require('googleapis')
const OAuth2Client = google.auth.OAuth2;

/* Google Drive API */
const GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET
const GOOGLE_CALLBACK = config.GOOGLE_CALLBACK

const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK)

module.exports = {
  oAuth2Client,
  google
}