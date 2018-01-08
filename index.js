/**
 * Command line entry [命令行入口]
 */
const program = require('commander')
const _ = require('lodash')
const path = require('path')
const pkg = require('./package.json')
const version = pkg.version
const basename = path.basename(process.env._)

program
  .version(version)

program
  .name(basename === 'node' ? 'node-ssh' : basename)
  .usage('[command] [options]')

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
  program.help()
}