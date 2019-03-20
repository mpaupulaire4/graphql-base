import { createConnection, getConnectionOptions } from 'typeorm';
// Entity Imports
import { Message } from './Message';
import { User } from './User';

async function connect() {
  const options = await getConnectionOptions();
  return createConnection({
    ...options,
    entities: [
      User,
      Message,
    ],
  });
}

export const ConnectionPromise = connect();
