import { NextFunction, Request, Response, Router } from 'express';
import * as passport from 'passport';

import { User } from '../Data/User/User.entity';
import { logger } from '../Logger';
import { mailer } from '../Mailer';
import { IJWTInfo, isAuthenticated } from './Passport';
import { AuthorizationService } from './Service';

const FORGOT_TOKEN_EXPIRE = process.env.FORGOT_TOKEN_EXPIRE;

function RequireFields(fields: string[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (fields.every((arg) => Object.keys(req.body).indexOf(arg) > -1)) {
      return next();
    } else {
      return res.sendStatus(400);
    }
  };
}

const router = Router();

router.post('/login',
  RequireFields(['email', 'password']),
  passport.authenticate('local', { session: false }),
  (req: any, res: Response) => {
    const token = AuthorizationService.signToken(
      { id: req.user.id }
    );

    res.set({
      Authorization : `Bearer ${token}`,
    });

    return res.json({ token });
  }
);

/**
 * /auth/register
 * Create a new user with:
 *  email: req.body.email
 *  password: req.body.password
 */
router.post('/register',
  RequireFields(['email', 'password', 'name']),
  async (req: Request, res: Response) => {
    if (!AuthorizationService.isValidPassword(req.body.password)) {
      return res.status(400).send("Password doesn't meet requirements");
    }
    try {
      await User.create({
        email: req.body.email,
        name: req.body.name,
        password: await AuthorizationService.hashPassword(req.body.password),
      }).save();
      return res.sendStatus(200);
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
);

/**
 * /auth/refresh
 * Return a refreshed, valid, signed JWT.
 * https://stackoverflow.com/a/26834685
 */
router.post('/refresh',
  isAuthenticated,
  (req: any, res: Response) => {
    const token = AuthorizationService.signToken(
      { id: req.user.id }
    );

    res.set({
      Authorization : `Bearer ${token}`,
    });

    return res.json({ token });
  }
);

/**
 * /auth/forgot
 * Send email to user email address with password reset token.
 */
router.post('/forgot',
  RequireFields(['email']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOneOrFail({ email: req.body.email });
      const token = AuthorizationService.signToken(
        { id: user.id },
        FORGOT_TOKEN_EXPIRE
      );

      await mailer.sendPasswordResest({email: user.email, token });
      res.send('Password reset message sent.');
    } catch (e) {
      logger.error(e);
      next(e);
    }
  }
);

/**
 * GET /auth/forgot/:token
 * checks to see if the provided token is valid.
 */
router.get('/forgot/:token',
  async (req: Request, res: Response) => {
    try {
      const data: IJWTInfo = AuthorizationService.verifyToken(req.params.token) as IJWTInfo;
      await User.findOneOrFail(data.id);
      res.send('Valid Token');
    } catch (e) {
      logger.error(e);
      res.status(400).send('Invalid Token');
    }
  }
);

/**
 * POST /auth/reset/:token
 */
router.post('/reset/:token',
  RequireFields(['password']),
  async (req: Request, res: Response) => {
    try {
      const data: IJWTInfo = AuthorizationService.verifyToken(req.params.token) as IJWTInfo;
      const user = await User.findOneOrFail(data.id);
      if (!AuthorizationService.isValidPassword(req.body.password)) {
        res.status(400).send("Password doesn't meet requirements");
      } else {
        user.password = await AuthorizationService.hashPassword(req.body.password);

        await mailer.sendPasswordHasBeenResest({email: user.email });

        res.send('Password has been reset');
      }
    } catch (e) {
      logger.error(e);
      res.status(400).send('Invalid Token');
    }
  }
);

export {
  router as AuthRouter
};
