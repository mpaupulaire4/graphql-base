const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Local = require('passport-local')
const JWT = require('passport-jwt')
const { ModelsPromise } = require('../Schema')

passport.use(new Local.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const Models = await ModelsPromise
    const user = await Models.user.findOne({ email })
    if (!user) {
      return done(null, false, { messages: 'Incorrect username or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return done(null, false, { messages: 'Incorrect username or password' })
    }
    done(null, user)

  } catch (e) {
    done(e)
  }
}))

passport.use(new JWT.Strategy({
  jwtFromRequest: JWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
}, async (data, done) => {
  try {
    const Models = await ModelsPromise
    const user = await Models.user.findOne({ id: data.id })
    if (!user) {
      return done(null, false)
    }

    done(null, user)
  } catch (e) {
    done(e)
  }
}))

const router = express.Router()

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(400).json(info)
    }
    if (err) {
      console.error(err)
      return res.status(400).send(err)
    }
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '7d' })
    res.set({
      Authorization : `Bearer ${token}`
    })
    return res.json({ token })
  })(req, res)
})

const authenticate = passport.authenticate('jwt', { session: false })

module.exports = {
  router,
  authenticate,
}
