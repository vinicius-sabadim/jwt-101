const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const verify = require("./routes/verifyToken")

dotenv.config()

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to database")
)

const app = express()

app.use(express.json())

const authRoute = require("./routes/auth")
app.use("/api/user", authRoute)

app.get("/api/posts", verify, (req, res) => {
  res.json({
    posts: [{ title: "Post 1", body: "bla bla bla" }]
  })
})

app.listen(3000, () => console.log("Server up and running"))
