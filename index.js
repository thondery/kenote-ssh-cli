/**
 * Command line entry [命令行入口]
 */
const program = require('commander')
const _ = require('lodash')
const path = require('path')
const pkg = require('./package.json')
const { list, create, remove, upload, connect, backup, restore } = require('./libs')
const version = pkg.version
const basename = path.basename(process.env._ || process.title.replace(/^(\S+)(\s\-\s)(\S+)$/, '$3'))

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

program
  .command('upload')
  .alias('up')
  .description('Upload SSH key to the server')
  .action( upload )

program
  .command('connect')
  .alias('link')
  .description('Connect to the server')
  .action( connect )

program
  .command('backup')
  .alias('bak')
  .option('-y, --yes ', 'Confirm the implementation ...')
  .description('Backup SSH key ...')
  .action( () => backup(program.args[0].yes) )

program
  .command('restore')
  .alias('unbak')
  .description('Restore SSH key ...')
  .action( restore )

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
  program.help()
}