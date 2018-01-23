
const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const ini = require('ini')
const ora = require('ora')
const { sshRoot, ksshRoot } = require('./base')

module.exports = () => {
  console.log('')
  let spinner = ora('    Initial configuration ...').start()
  let rootPath = process.env.HOME || process.env.HOMEPATH
  !fs.existsSync(rootPath) && fs.mkdirpSync(rootPath)
  !fs.existsSync(sshRoot) && fs.mkdirpSync(sshRoot)
  !fs.existsSync(ksshRoot) && fs.mkdirpSync(ksshRoot)
  let ksshConfigFile = path.resolve(ksshRoot, 'config')
  let ksshConfig = {
    repository: {
      github: {
        host: 'github.com',
        user: 'git'
      },
      gitee: {
        host: 'gitee.com',
        user: 'git'
      },
      coding: {
        host: 'git.coding.net',
        user: 'git'
      }
    }
  }
  fs.writeFileSync(ksshConfigFile, ini.stringify(ksshConfig), 'utf-8')
  setTimeout(() => {
    spinner.stop()
    console.log(`    Initial configuration is completed !\n`)
  }, 500)
}