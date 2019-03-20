/// <reference path="./declarations.d.ts" />
import 'reflect-metadata';

import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { createServer } from 'http';
import * as morgan from 'morgan';

import { AuthRouter, /* isAuthenticated */ } from './Auth';
import { GraphQLMiddleware, SubscriptionsSetup } from './Data';
import { ConnectionPromise } from './Data/DatabaseConnection';
import { logger } from './Logger';

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(compression());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/auth', AuthRouter);
app.use('/graphql', /* isAuthenticated, */ GraphQLMiddleware);

app.on('ready', async () => {
  await ConnectionPromise;
  const server = createServer(app);
  await SubscriptionsSetup(server, '/graphql');
  server.listen(3001, () => logger.info(`Server running on port: ${3001}`));
});

app.emit('ready');
