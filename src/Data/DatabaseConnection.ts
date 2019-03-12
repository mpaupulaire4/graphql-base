import { createConnection, getConnectionOptions } from 'typeorm'
import { User } from './User';

async function connect() {
  const options = await getConnectionOptions()
  return createConnection({
    ...options,
    entities: [
      User
    ],
  })
}

export const ConnectionPromise = connect()
