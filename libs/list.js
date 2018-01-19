
const Table = require('cli-table2')
const { sshRoot, getList, init } = require('./base')

module.exports = () => {
  init()
  let list = getList()
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