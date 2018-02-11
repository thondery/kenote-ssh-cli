
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import inquirerCheckboxAutocomplete from 'inquirer-checkbox-autocomplete-prompt'
import ora from 'ora'
import _ from 'lodash'
import { HOMEPATH, SSH_CONF, KSSH_PATH, toFullPath, toAliasPath, saveSSHConf } from './base'

inquirer.registerPrompt('checkbox-autocomplete', inquirerCheckboxAutocomplete)

export default (backup) =>  {
  if (backup) {
    return removeBackup()
  }
  return removeSSHKey()
}

const removeSSHKey = () => {
  return inquirer.prompt([
    {
      type: 'checkbox',
      name: 'host',
      message: 'Please select ssh key alias name ?',
      choices: _.map(SSH_CONF, 'Host')
    }
  ])
  .then( ret => {
    if (ret.host.length === 0) {
      console.log(`\n    There are no options to delete!\n`)
      throw new Error('There are no options to delete.')
    }
    console.log('')
    let spinner = ora('    Delete ssh-key for Host ...').start()
    let newSSHConf = SSH_CONF
    for (let item of ret.host) {
      let info = _.find(SSH_CONF, o => o.Host === item)
      let identityFile = toFullPath(info.IdentityFile)
      _.remove(newSSHConf, o => o.Host === item)
      fs.existsSync(identityFile) && fs.removeSync(identityFile)
      fs.existsSync(`${identityFile}.pub`) && fs.removeSync(`${identityFile}.pub`)
    }
    saveSSHConf(newSSHConf)
    setTimeout(() => {
      spinner.stop()
      console.log(`✔    Delete ssh-key for Host successfully!\n`)
    }, 500)
  })
  .catch( err => {
    process.exit(0)
  })
}

const removeBackup = () => {
  let bakList = []
  if (fs.existsSync(KSSH_PATH)) {
    bakList = _.filter(fs.readdirSync(KSSH_PATH), o => /\.(zip|tar)$/.test(o))
  }
  if (bakList.length === 0) {
    console.log(`\n    Useless to find any backup files.\n`)
    return
  }
  return inquirer.prompt([
    {
      type: 'checkbox-autocomplete',
      name: 'bakfile',
      message: 'Please select the backup file to delete :',
      choices: bakList,
      pageSize: 10
    }
  ])
  .then( ret => {
    if (ret.bakfile.length === 0) {
      console.log(`\n    There are no options to delete!\n`)
      throw new Error('There are no options to delete.')
    }
    console.log('')
    let spinner = ora('    Delete Backup files ...').start()
    for (let item of ret.bakfile) {
      let bakfile = path.resolve(KSSH_PATH, item)
      fs.existsSync(bakfile) && fs.removeSync(bakfile)
    }
    setTimeout(() => {
      spinner.stop()
      console.log(`✔    Delete Backup files successfully!\n`)
    }, 500)
  })
  .catch( err => {
    process.exit(0)
  })
}