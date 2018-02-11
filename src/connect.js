
import inquirer from 'inquirer'
import runscript from 'runscript'
import _ from 'lodash'
import { SSH_CONF } from './base'

export default () => {
  let sshList = _.filter(SSH_CONF, o => o.User !== 'git')
  if (sshList.length === 0) {
    console.log(`\n    Useless to find any ssh key files.\n`)
    return
  }
  return inquirer.prompt([
    {
      type: 'list',
      name: 'alias',
      message: 'Please select ssh key alias name ?',
      choices: _.map(sshList, 'Host')
    }
  ])
  .then( ret => {
    runscript(`ssh ${ret.alias}`)
  })
}