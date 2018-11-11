const Disk = require('sails-disk')

module.exports = {
  adapters: {
    'disk': Disk
  },

  models: {
    datastore: 'default',
    primaryKey: 'id',
    attributes: {
      id: { type: 'number', GType: 'ID!', autoMigrations: { autoIncrement: true } },
      createdAt: { type: 'string', GType: 'DateTime!', autoCreatedAt: true },
      updatedAt: { type: 'string', GType: 'DateTime!', autoUpdatedAt: true },
    },
  },

  datastores: {
    default: {
      adapter: 'disk',
    }
  }
}
