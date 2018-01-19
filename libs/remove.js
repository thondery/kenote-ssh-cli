
const inquirer = require('inquirer')
const runscript = require('runscript')
const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const { sshRoot, getList, saveConfig, init } = require('./base')

const remove = () => {
  let options = null
  init()
  let sshList = getList()
  return inquirer.prompt([
    {
      type: 'checkbox',
      name: 'alias',
      message: 'Select Alias: ',
      choices: _.map(sshList, 'Host')
    }
  ])
  .then( ret => {
    options = { ...options, ...ret }
    if (options.alias.length === 0) {
      throw new Error('There are no options to delete.')
    }
    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'isDelete',
        message: `确定要删除 [${_.join(options.alias, ', ')}] ssh key?`,
        default: false
      }
    ])
  })
  .then( ret => {
    options = { ...options, ...ret }
    let { alias, isDelete } = options
    if (!isDelete) {
      throw new Error('There are no options to delete.')
    }
    for (let e of alias) {
      let info = _.find(sshList, o => o.Host === e)
      let identityName = info.IdentityFile.replace(/^\~\/.ssh\//, '')
      let identityFile = /^\~\/.ssh\//.test(info.IdentityFile) ? path.resolve(sshRoot, identityName) : info.IdentityFile
      _.remove(sshList, o => o.Host === e)
      if (fs.existsSync(identityFile)) {
        fs.removeSync(identityFile)
        fs.removeSync(`${identityFile}.pub`)
      }
    }
    saveConfig(sshList)
    console.info(`✔ remove [${_.join(alias, ', ')}] ssh key successfully!`)
  })
  .catch( err => {
    process.exit(0)
  })
}

module.exports = remove