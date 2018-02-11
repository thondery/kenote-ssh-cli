
import inquirer from 'inquirer'
import runscript from 'runscript'
import _ from 'lodash'
import { SSH_CONF, toFullPath } from './base'

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
    let info = _.find(sshList, o => o.Host === ret.alias)
    let remoteHost = `${info.User}@${info.HostName}`
    if (info.Port && info.Port != 22) {
      remoteHost += `:${info.Port}`
    }
    let publicKey = `${toFullPath(info.IdentityFile)}.pub`
    if (process.env.OS === 'Windows_NT') {
      runscript(`type ${publicKey} | ssh ${remoteHost} "cat >> .ssh/authorized_keys"`)
    }
    else {
      runscript(`ssh-copy-id -i ${publicKey} ${remoteHost}`)
    }
  })
}