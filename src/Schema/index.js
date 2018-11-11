const { ApolloServer, gql } = require('apollo-server-express')
const {
  EmailAddress,
  NegativeFloat,
  NegativeInt,
  PhoneNumber,
  PostalCode,
  UnsignedFloat,
  UnsignedInt,
  URL,
} = require('@okgrow/graphql-scalars')
const Waterline = require('waterline')
const WaterlineConfig = require('./waterline.config')
const { merge } = require('lodash')
const PubSub = require('../Subscriptions')
const fs = require('fs')
const path = require('path')

// DATE TYPES
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require('graphql-iso-date')

// TEMPORARY
const MESSAGE_ADDED_TOPIC = 'message_added';
const messages = [];
// END TEMPORARY

const RootSchema = `
  scalar DateTime
  scalar Date
  scalar Time
  scalar EmailAddress
  scalar NegativeFloat
  scalar NegativeInt
  scalar PhoneNumber
  scalar PostalCode
  scalar UnsignedFloat
  scalar UnsignedInt
  scalar URL

  type Query {
    # Get the currently logged in user (null if none)
    current_user: User
    # Get all messages
    messages: [String!]!
  }

  type Mutation {
    # Add a message
    addMessage(text: String!): [String]
  }

  type Subscription {
    # Subscribe to when a message is added
    messageAdded: String
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;


const RootResolvers = {
  Query: {
    current_user: (_, args, {current_user}) => current_user,
    messages: (_, args, {}) => messages
  },
  Mutation: {
    addMessage: (_, { text }, context) => {
      messages.push(text)
      PubSub.publish(MESSAGE_ADDED_TOPIC, { messageAdded: text });
      return messages
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: () => PubSub.asyncIterator(MESSAGE_ADDED_TOPIC),
    },
  },
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  EmailAddress,
  NegativeFloat,
  NegativeInt,
  PhoneNumber,
  PostalCode,
  UnsignedFloat,
  UnsignedInt,
  URL,
};


const resolvers = RootResolvers
const schema = [RootSchema]
const collections = []

// Load other defs from folder in the current directory
fs.readdirSync(path.resolve(__dirname)).forEach((p) => {
  const dir = path.resolve(__dirname, p)
  if (fs.lstatSync(dir).isDirectory()) {
    const def = require(dir)
    if (def) {
      merge(resolvers, def.resolvers)
      schema.push(def.schema)
      collections.push(...def.collections)
    }
  }
})

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expect

const waterline = new Waterline();
collections.forEach((collection) => waterline.registerModel(collection))

const ModelsPromise = new Promise((resole, reject) => {
  waterline.initialize(WaterlineConfig, (err, ontology) => {
    if (err) {
      return reject(err)
    }
    resole(ontology.collections)
  })
})

async function setUP(app) {
  const Models = await ModelsPromise;
  const apollo = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req }) => {
      return ({
        current_user: req.user,
        Models,
      })
    },
  })

  apollo.applyMiddleware({ app })

  return (server) => {
    apollo.installSubscriptionHandlers(server)
  }
}

module.exports = {
  ModelsPromise,
  setUpGraphQL: setUP,
}
