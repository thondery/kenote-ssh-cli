
require('console.table')

const { sshRoot, getList } = require('./base')

module.exports = () => {
  let sshConfigTable = getList()
  console.log('')
  console.table(sshConfigTable)
}