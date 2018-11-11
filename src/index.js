if (process.env.NODE_ENV !== 'production') require('dotenv').config();

require('./server')(process.env);
