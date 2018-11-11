const Waterline = require('waterline')
const { merge } = require('lodash')
const { models: BaseModel } = require('../Data/waterline.config')

const WaterlineGraphQLTypeMap = {
  string: 'String',
  text: 'String',
  integer: 'Int',
  float: 'Float',
  date: 'Date',
  time: 'Time',
  datetime: 'DateTime',
  boolean: 'Boolean',
}

function getTypeFromAttr({ type, collection, model, GType, required }) {
  if (GType) {
    return GType
  }
  if (model) {
    return [capitalize(model), required ? '!' : ''].join('')
  }
  if (collection) {
    return `[${capitalize(collection)}!]!`
  }
  return [WaterlineGraphQLTypeMap[type], required ? '!' : ''].join('')
}

function waterlineToGQL(config, {defs ='', filter = []} = {}) {
  const { identity, attributes } = merge({}, BaseModel, config)
  const name = capitalize(identity)
  const base = `type ${name} {`
  const fields = Object.keys(attributes).map((key) => {
    if (filter.includes(key)) {
      return ''
    }
    const type = getTypeFromAttr(attributes[key])
    return `${key}:${type}`
  })
  if (defs){
    fields.push(defs)
  }
  return [base, ...fields, '}'].join('\n')
}


function capitalize(string='') {
  return string.replace(/^\w/, c => c.toUpperCase())
}

function setGType(obj) {
  return Object.keys(obj).reduce((agg, key) => {
    if (key === 'GType') {
      return agg
    } else if (typeof obj[key] === 'object') {
      agg[key] = setGType(obj[key])
    } else {
      agg[key] = obj[key]
    }
    return agg
  }, {})
}

function Collection(config) {
  return Waterline.Collection.extend(merge(
    {},
    setGType(BaseModel),
    setGType(config),
  ))
}

module.exports = {
  capitalize,
  waterlineToGQL,
  Collection,
}
