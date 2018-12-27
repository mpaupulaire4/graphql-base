import 'reflect-metadata';
import * as express from 'express';
import * as cors from 'cors';
import * as compression from 'compression';
import { urlencoded, json } from 'body-parser';
import { router as authRouter, authenticate} from './Auth';
import { SetUpGraqlQL } from './Data';

export interface ENV {
  PORT: number | string
}

// Arguments usually come from env vars
export async function run({
  PORT = 3100,
}: ENV) {
  if (typeof PORT === 'string') {
    PORT = parseInt(PORT, 10);
  }

  const app = express();

  app.use(compression());
  app.use(cors());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use('/auth', authRouter)
  app.use('/graphql', authenticate)

  SetUpGraqlQL(app);
}
