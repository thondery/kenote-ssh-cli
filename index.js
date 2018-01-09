/**
 * Command line entry [命令行入口]
 */
const program = require('commander')
const _ = require('lodash')
const path = require('path')
const pkg = require('./package.json')
const { list, create, remove } = require('./libs')
const version = pkg.version
const basename = path.basename(process.env._)

program
  .version(version)

program
  .name(basename === 'node' ? 'node-ssh' : basename)
  .usage('[command] [options]')

program
  .command('list')
  .alias('ls')
  .description('Show ssh key list')
  .action( list )

program
  .command('create')
  .alias('add')
  .description('Create a new SSH key')
  .action( create )

program
  .command('remove')
  .alias('delete')
  .description('Delete specific SSH key by alias name')
  .action( remove )

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
  program.help()
}