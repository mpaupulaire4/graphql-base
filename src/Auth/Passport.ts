import * as passport from 'passport';
import * as JWT from 'passport-jwt';
import * as Local from 'passport-local';

import { User } from '../Data/User/User.entity';

type DoneCalback = (error: Error | null, user?: User | false, other?: any) => void;

passport.use(new Local.Strategy({
  passwordField: 'password',
  usernameField: 'email',
}, async (email: string, password: string, done: DoneCalback ) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { messages: 'Incorrect username or password' });
    }

    const match = await user.isPassword(password);
    if (!match) {
      return done(null, false, { messages: 'Incorrect username or password' });
    }
    done(null, user);

  } catch (e) {
    done(e);
  }
}));

passport.use(new JWT.Strategy({
  jwtFromRequest: JWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
}, async (data: IJWTInfo, done: DoneCalback) => {
  try {
    const user = await User.findOne({ id: data.id });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (e) {
    done(e);
  }
}));

export const isAuthenticated = passport.authenticate('jwt', { session: false });

export interface IJWTInfo {
  id: number;
}
