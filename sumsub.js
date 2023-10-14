const axios = require("axios")
const crypto = require("crypto")
const FormData = require("form-data")

const SUMSUB_SECRET_KEY = "______________________"
const SUMSUB_APP_TOKEN = "______________________"
const SUMSUB_BASE_URL = "https://api.sumsub.com"
const EXTERNAL_USER_ID = "______________________"

var config = {}
config.baseURL = SUMSUB_BASE_URL

axios.interceptors.request.use(createSignature, function (error) {
  console.log("interceptor...")
  return Promise.reject(error)
})

function createSignature(config) {
  console.log("Creating a signature for the request...")
  var ts = Math.floor(Date.now() / 1000)
  const signature = crypto.createHmac("sha256", SUMSUB_SECRET_KEY)
  signature.update(ts + config.method.toUpperCase() + config.url)
  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer())
  } else if (config.data) {
    signature.update(config.data)
  }
  config.headers["X-App-Access-Ts"] = ts
  config.headers["X-App-Access-Sig"] = signature.digest("hex")
  return config
}

function createAccessToken(externalUserId, levelName, ttlInSecs) {
  console.log("Creating an access token for initializng SDK...")
  var method = "post"
  var url = "/resources/accessTokens?userId=" + encodeURIComponent(externalUserId) + "&ttlInSecs=" + ttlInSecs + "&levelName=" + encodeURIComponent(levelName)
  var headers = {
    Accept: "application/json",
    "X-App-Token": SUMSUB_APP_TOKEN,
  }
  config.method = method
  config.url = url
  config.headers = headers
  config.data = null
  return config
}

const getAccessToken = async () => {
  try {
    const response = await axios(createAccessToken(EXTERNAL_USER_ID, "New-One", 600))
    console.log("TOKENX : ", response.data)
    return response.data
  } catch (error) {
    console.error("XERROR : ", error?.response?.data)
    return null
  }
}

module.exports = {
  getAccessToken,
}
