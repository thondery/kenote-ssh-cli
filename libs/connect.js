
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
    runscript(`ssh ${ret.alias}`)
  })
}