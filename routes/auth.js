const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const { registerValidation, loginValidation } = require("../validation")

router.post("/register", async (req, res) => {
  const payload = req.body

  const { error } = registerValidation(payload)
  if (error) return res.status(400).send(error.details[0].message)

  const emailExists = await User.findOne({ email: payload.email })
  if (emailExists) return res.status(400).send("Email already exists")

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(payload.password, salt)

  const user = new User({
    name: payload.name,
    email: payload.email,
    password: hashedPassword
  })

  try {
    const savedUser = await user.save()
    res.send({
      user: savedUser._id
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post("/login", async (req, res) => {
  const payload = req.body

  const { error } = loginValidation(payload)
  if (error) return res.status(400).send(error.details[0].message)

  const user = await User.findOne({ email: payload.email })
  if (!user) return res.status(400).send("Email or password is wrong")

  const validPass = await bcrypt.compare(payload.password, user.password)
  if (!validPass) return res.status(400).send("Email or password is wrong")

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  res.header("auth-token", token).send(token)
})

module.exports = router
