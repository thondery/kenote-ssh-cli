
const _ = require('lodash')
const Table = require('cli-table2')
const { sshRoot, getList, isInitial } = require('./base')

module.exports = (type = 'all') => {
  if (!isInitial) return
  let list = getList()
  if (type === 'git') {
    list = _.filter(list, o => o.User === 'git')
  }
  if (type === 'ignore') {
    list = _.filter(list, o => o.User !== 'git')
  }
  console.log('')
  let table = new Table({
    head: ['Name', 'Host', 'Port', 'User', 'IdentityFile'],
    colWidths: [15, 20, 10, 15, 35],
    style:{ 
      head: ['green', 'bold'], 
      border: [] 
    },
    wordWrap: true
  })
  list.forEach((item, i) => {
    let arr = []
    arr.push(item.Host || '--')
    arr.push(item.HostName || '--')
    arr.push(item.Port || '22')
    arr.push(item.User || '--')
    arr.push(item.IdentityFile  || '--')
    table.push(arr)
  })
  console.log(table.toString())
  console.log('')
}