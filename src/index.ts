/// <reference path="./declarations.d.ts" />
import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import 'reflect-metadata';
import { authenticate, router as authRouter} from './Auth';
import { SetUpGraqlQL } from './Data';

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(compression());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/auth', authRouter);
app.use('/graphql', authenticate);

SetUpGraqlQL(app);

export {
  app
};
