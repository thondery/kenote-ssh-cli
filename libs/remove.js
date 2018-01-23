
const inquirer = require('inquirer')
const runscript = require('runscript')
const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')
const _ = require('lodash')
const { sshRoot, getList, saveConfig, isInitial, ksshRoot } = require('./base')

const removeSSHKey = () => {
  let options = null
  if (!isInitial()) return
  let sshList = getList()
  return inquirer.prompt([
    {
      type: 'checkbox',
      name: 'alias',
      message: 'Please select ssh key alias name ?',
      choices: _.map(sshList, 'Host')
    }
  ])
  .then( ret => {
    options = { ...options, ...ret }
    if (options.alias.length === 0) {
      console.log(`\n    There are no options to delete!\n`)
      throw new Error('There are no options to delete.')
    }
    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'isDelete',
        message: `You are sure to delete the selected alias name ?`,
        default: false
      }
    ])
  })
  .then( ret => {
    options = { ...options, ...ret }
    let { alias, isDelete } = options
    if (!isDelete) {
      console.log(`\n    The user automatically cancels the delete operation.\n`)
      throw new Error('The user automatically cancels the delete operation.')
    }
    console.log('')
    let spinner = ora('    Delete Alias name ...').start()
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
    setTimeout(() => {
      spinner.stop()
      console.log(`\n✔    Delete ssh key Alias name successfully!\n`)
    }, 500)
  })
  .catch( err => {
    process.exit(0)
  })
}

const removeBackup = () => {
  let options = null
  if (!isInitial()) return
  let bakList = _.filter(fs.readdirSync(ksshRoot), o => /\.(zip|tar)$/.test(o))
  inquirer.registerPrompt('checkbox-autocomplete', require('inquirer-checkbox-autocomplete-prompt'))
  return inquirer.prompt([
    {
      type: 'checkbox-autocomplete',
      name: 'fileNames',
      message: 'Please select the backup file to delete ?',
      choices: bakList,
      pageSize: 10
    }
  ])
  .then( ret => {
    options = { ...options, ...ret }
    if (ret.fileNames.length === 0) {
      console.log(`\n    You did not choose how to file!\n`)
      return
    }
    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'isDelete',
        message: 'You are sure to delete the selected backup file ?',
        default: false
      }
    ])
  })
  .then( ret => {
    if (!_.has(ret, 'isDelete')) return
    if (!ret.isDelete) {
      console.log(`\n    The user automatically cancels the delete operation.\n`)
      return
    }
    console.log('')
    let spinner = ora('    Delete Backup files ...').start()
    for (let item of options.fileNames) {
      fs.removeSync(path.resolve(ksshRoot, item))
    }
    setTimeout(() => {
      spinner.stop()
      console.log(`\n✔    Delete Backup files successfully!\n`)
    }, 500)
  })
}

module.exports = backup => backup ? removeBackup() : removeSSHKey()