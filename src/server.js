const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { router, authenticate } = require('./Auth/')
const { setUpGraphQL } = require('./Schema');

// Arguments usually come from env vars
async function run({
  PORT: portFromEnv = 3100,
} = {}) {

  const port = parseInt(portFromEnv, 10);

  const app = express();

  app.use(compression());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('/auth', router)
  // app.use(authenticate)

  const addSubscriptions = await setUpGraphQL(app)
  const server = createServer(app);
  addSubscriptions(server)


  server.listen(port, () => {
    console.log(`Server is running on port ${port} 🚀`);
  });

  return server;
}

module.exports = run