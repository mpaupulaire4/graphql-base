/// <reference path="./declarations.d.ts" />
import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import 'reflect-metadata';
import { AuthRouter, /* isAuthenticated */ } from './Auth';
import { GraphQLMiddleware } from './Data';

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(compression());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/auth', AuthRouter);
app.use('/graphql', GraphQLMiddleware);


app.listen(3001, () => console.log('statrted'))

