/**
 * Command line entry [命令行入口]
 */
const program = require('commander')
const _ = require('lodash')
const pkg = require('./package.json')
const version = pkg.version

program
  .version(version)

program
  .name(process.argv0 === 'node' ? 'node-ssh' : process.argv0)
  .usage('[command] [options]')


// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
  program.help()
}