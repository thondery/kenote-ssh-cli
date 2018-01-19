
const inquirer = require('inquirer')
const runscript = require('runscript')
const _ = require('lodash')
const { getList, init } = require('./base')

module.exports = () => {
  let options = null
  init()
  let sshList = getList()
  return inquirer.prompt([
    {
      type: 'list',
      name: 'alias',
      message: 'Select Alias: ',
      choices: _.map(sshList, 'Host')
    }
  ])
  .then( ret => {
    options = ret
    let opts = _.find(sshList, o => o.Host === ret.alias)
    let remoteHost = `${opts.User}@${opts.HostName}`
    if (opts.Port && opts.Port !== 22) {
      remoteHost += `:${opts.Port}`
    }
    runscript(`ssh-copy-id -i ${opts.IdentityFile}.pub ${remoteHost}`)
  })
}