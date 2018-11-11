const bcrypt = require('bcrypt')
const { waterlineToGQL, Collection } = require('../utils')

function validPassword(pswd) {
  return /\d/.test(pswd)
}

function hashPassword(pswd) {
  return bcrypt.hash(pswd, parseInt(process.env.SALT_ROUNDS || 5))
}

const User =  {
  identity: 'User',
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      GType: 'EmailAddress!'
    },
    password: {
      type: 'string',
      required: true,
    },
  },
  passwordValidation: async (user) => {
    if (user.password === user.passwordConfirm && validPassword(user.password) ) {
        delete user.passwordConfirm
        user.password = await hashPassword(user.password)
    } else {
      throw Error('Password does not meet requirements')
    }
  },
}

const Schema = `
  ${waterlineToGQL(User, null, ['password'])}

  extend type Query {
    users: [User!]!
  }

  extend type Mutation {
    # Create a User
    createUser(
      data: UserCreate!
    ): User

    # Update a User
    updateUser(
      data: UserUpdate!
    ): User

    # Delete a User
    deleteUser(id: ID!): Boolean

  }

  input UserCreate {
    name: String!
    email: EmailAddress!
    phonenumber: String
    password: String!
    passwordConfirm: String!
  }

  input UserUpdate {
    id: ID!
    name: String
    email: EmailAddress
    phonenumber: String
    password: String
    passwordConfirm: String
  }
`

module.exports = {
  schema: () => [Schema],
  collections: [
    Collection(User)
  ],
  resolvers: {
    Query: {
      users: (_, args, { Models }) => {
        return Models.user.find()
      }
    },
    Mutation: {

      createUser: async (_, { data }, { Models }) => {
        await Models.user.passwordValidation(data)
        return Models.user.create(data).fetch()
      },

      updateUser: async (_, { data: { id, ...data } }, { Models, current_user }) => {
        if (data.password || data.passwordConfirm) {
          await Models.user.passwordValidation(data)
        }
        return Models.user.update({
          id,
        }).set(data).fetch().then(users => users[0])
      },

      deleteUser: (_, { id }, { Models }) => {
        return Models.user.destroy({
          id,
        })
      }
    },
  }
}
