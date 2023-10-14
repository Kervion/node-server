const express = require("express")
const cors = require("cors")
const port = 3000
const { getAccessToken } = require("./sumsub")

const app = express()

const allowedOrigins = ["http://localhost:8081", "exp://192.168.0.171:8081", "http://127.0.0.1:5500", "http://192.168.0.171:5500", "http://192.168.0.171:3001"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin."
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
}
app.use(cors(corsOptions))

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get("/sumsub-access-token", async (req, res) => {
  try {
    const token = await getAccessToken()
    console.log("GETTOKEN : ", token.token)
    if (token) {
      res.json({ token })
    } else {
      res.status(500).send("Could not retrieve access token")
    }
  } catch (error) {
    console.error("Error occurred:", error)
    res.status(500).send("An error occurred")
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
