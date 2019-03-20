const path = require('path')

module.exports = function (plop) {
  const dataPointsDir = 'src/Data'
  const loader = 'src/Data/DatabaseConnection.ts'
  let modulePath = path.relative(path.dirname(loader), path.resolve(dataPointsDir, '{{pascalCase DataPoint}}'))
  if (modulePath[0] !== '.') {
    modulePath = './' + modulePath
  }

  plop.setGenerator('data-point', {
    description: 'generates a controller, entity, resolver, and some gql inputs',
    prompts: [
      {
        type: 'input',
        name:'DataPoint',
        message:'Data Poont Name',
      }
    ], // array of inquirer prompts
    actions: [
      {
        type: 'add',
        templateFile: '../templates/DataPoint/entity.hbs',
        path: path.resolve(dataPointsDir, '{{pascalCase DataPoint}}', '{{pascalCase DataPoint}}.entity.ts'),
      },
      {
        type: 'add',
        templateFile: '../templates/DataPoint/controller.hbs',
        path: path.resolve(dataPointsDir, '{{pascalCase DataPoint}}', '{{pascalCase DataPoint}}.controller.ts'),
      },
      {
        type: 'add',
        templateFile: '../templates/DataPoint/resolver.hbs',
        path: path.resolve(dataPointsDir, '{{pascalCase DataPoint}}', '{{pascalCase DataPoint}}.resolver.ts'),
      },
      {
        type: 'add',
        templateFile: '../templates/DataPoint/gql.hbs',
        path: path.resolve(dataPointsDir, '{{pascalCase DataPoint}}', '{{pascalCase DataPoint}}.inputs.gql'),
      },
      {
        type: 'add',
        templateFile: '../templates/DataPoint/index.hbs',
        path: path.resolve(dataPointsDir, '{{pascalCase DataPoint}}', 'index.ts'),
      },
      {
        type: 'append',
        abortOnFail: false,
        template: `import { {{pascalCase DataPoint}} } from '${modulePath}';`,
        pattern: /\/\/ Entity Imports/,
        path: path.resolve(loader)
      },
      {
        type: 'append',
        unique: true,
        template: '      {{pascalCase DataPoint}},',
        pattern: /entities: \[\n(\s*\w+,)*/,
        path: path.resolve(loader)
      },
    ]  // array of actions
  });
};
