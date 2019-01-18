import { ENV, run } from './server'

run(process.env as unknown as ENV)
