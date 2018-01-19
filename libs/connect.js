
const inquirer = require('inquirer')
const runscript = require('runscript')
const _ = require('lodash')
const { getList } = require('./base')

module.exports = () => {
  let options = null
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