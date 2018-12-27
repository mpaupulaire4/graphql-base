import { Router } from 'express'
import * as passport from 'passport'
import * as jwt from 'jsonwebtoken'
import * as Local from 'passport-local'
import * as JWT from 'passport-jwt'
import { User } from '../Data/User/User.entity'

passport.use(new Local.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email: string, password: string, done: Function) => {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return done(null, false, { messages: 'Incorrect username or password' })
    }

    const match = await user.isPassword(password)
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
}, async (data: JWTInfo, done: Function) => {
  try {
    const user = await User.findOne({ id: data.id }, { relations: ['organization'] })
    if (!user) {
      return done(null, false)
    }

    done(null, user)
  } catch (e) {
    done(e)
  }
}))

const router = Router()

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(400).json(info)
    }
    if (err) {
      console.error(err)
      return res.status(400).send(err)
    }
    const token = jwt.sign({ id: user.id } as JWTInfo, process.env.TOKEN_SECRET, { expiresIn: '7d' })
    res.set({
      Authorization : `Bearer ${token}`
    })
    return res.json({ token })
  })(req, res)
})

const authenticate = passport.authenticate('jwt', { session: false })

export {
  router,
  authenticate,
}

interface JWTInfo {
  id: number
}