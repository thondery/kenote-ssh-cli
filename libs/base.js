
const path = require('path')
const fs = require('fs-extra')
const ini = require('ini')

exports.sshRoot = path.resolve(process.env.HOME || process.env.HOMEPATH, '.ssh')

exports.getList = () => {
  let sshRootInfo = fs.readdirSync(exports.sshRoot)
  if (!fs.existsSync(path.resolve(exports.sshRoot, 'config'))) {
    return []
  }
  let sshConfig = fs.readFileSync(path.resolve(exports.sshRoot, 'config'), 'utf-8')
  let sshConfigArr = sshConfig.split(/(Host)[\s+]/)
  let sshConfigTable = []
  for (let e of sshConfigArr) {
    let info = getInfo(e)
    info && sshConfigTable.push(info)
  }
  return sshConfigTable
}

exports.saveConfig = (config) => {
  let infoData = ''
  for (let e of config) {
    infoData += `\n`
    infoData += `#${e.Host}\n`
    infoData += `Host ${e.Host}\n`
    infoData += `    HostName ${e.HostName}\n`
    infoData += `    User ${e.User}\n`
    if (e.Port) {
      infoData += `    Port ${e.Port}\n`
    }
    infoData += `    IdentityFile ${e.IdentityFile}\n`
  }
  fs.writeFileSync(path.resolve(exports.sshRoot, 'config'), infoData, 'utf-8')
}

const getCommit = () => {
  let gitConfigFile = path.resolve(process.env.HOME || process.env.HOMEPATH, '.gitconfig')
  let gitConfig = {}
  if (fs.existsSync(gitConfigFile)) {
    gitConfig = ini.parse(fs.readFileSync(gitConfigFile, 'utf-8'))
    if (gitConfig.user) {
      return `${gitConfig.user.name} <${gitConfig.user.email}>`
    }
  }
  return null
}

exports.defaultCommit = getCommit()

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