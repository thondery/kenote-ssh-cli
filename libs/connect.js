
const inquirer = require('inquirer')
const runscript = require('runscript')
const _ = require('lodash')
const { getList, isInitial } = require('./base')

module.exports = () => {
  let options = null
  if (!isInitial) return
  let sshList = _.filter(getList(), o => o.User !== 'git')
  return inquirer.prompt([
    {
      type: 'list',
      name: 'alias',
      message: 'Please select ssh key alias name ?',
      choices: _.map(sshList, 'Host')
    }
  ])
  .then( ret => {
    options = ret
    runscript(`ssh ${ret.alias}`)
  })
}