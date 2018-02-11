/**
 * Command line entry [命令行入口]
 */
const program = require('commander')
const _ = require('lodash')
const path = require('path')
const unzip = require('unzip')
const pkg = require('./package.json')
const { init, list, create, remove, upload, connect, backup, restore } = require('./build/main')
const version = pkg.version
const basename = path.basename(process.env._ || process.title.replace(/^(\S+)(\s\-\s)(\S+)$/, '$3'))

program
  .version(version)

program
  .name(basename === 'node' ? 'node-ssh' : basename)
  .usage('[command] [options]')

program
  .command('init')
  .description(`Initial ${basename === 'node' ? 'node-ssh' : basename} Configure`)
  .action( init )

program
  .command('list')
  .alias('ls')
  .option('-t, --type <type-name>', 'Only relevant types are displayed')
  .description('Show ssh-key list')
  .action( () => {
    list(program.args[0].type || 'all')
  })

program
  .command('create')
  .alias('add')
  .option('-t, --type <ssh-type>', 'Input SSH key type')
  .description('Create a new SSH key')
  .action( () => {
    create(program.args[0].type)
  })

program
  .command('remove')
  .alias('rm')
  .option('-b, --bak', 'Select the backup directory')
  .description('Delete ssh key or backup file')
  .action( () => remove(program.args[0].bak) )

program
  .command('upload')
  .alias('copy')
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