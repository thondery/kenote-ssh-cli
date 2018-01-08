
const path = require('path')
const fs = require('fs-extra')
require('console.table')

const sshRoot = path.resolve(process.env.HOME || process.env.HOMEPATH, '.ssh')

const getList = () => {
  let sshRootInfo = fs.readdirSync(sshRoot)
  let sshConfig = fs.readFileSync(path.resolve(sshRoot, 'config'), 'utf-8')
  let sshConfigArr = sshConfig.split(/(Host)[\s+]/)
  let sshConfigTable = []
  for (let e of sshConfigArr) {
    let info = getInfo(e)
    info && sshConfigTable.push(info)
  }
  console.log('')
  console.table(sshConfigTable)
}

const getInfo = (data) => {
  let info = null
  if (/HostName/.test(data)) {
    info = {}
    let arr = data.split(/\n/)
    arr.map( (item, i) => {
      if (/Host\s/.test(item)) {
        info['Host'] = item.replace(/Host(?=\s)/, '').replace(/\s/g, '')
      }
      else if (i === 0) {
        info['Host'] = item
      }
      if (/HostName/.test(item)) {
        info['HostName'] = item.replace(/HostName(?=\s)/, '').replace(/\s/g, '')
      }
      if (/User/.test(item)) {
        info['User'] = item.replace(/User(?=\s)/, '').replace(/\s/g, '')
      }
      if (/Port/.test(item)) {
        info['Port'] = item.replace(/Port(?=\s)/, '').replace(/\s/g, '')
      }
      if (/IdentityFile/.test(item)) {
        info['IdentityFile'] = item.replace(/IdentityFile(?=\s)/, '').replace(/\s/g, '')
      }
    })
  }
  return info
}

module.exports = getList