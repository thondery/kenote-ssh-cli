
import path from 'path'
import fs from 'fs-extra'
import ini from 'ini'
import _ from 'lodash'


export const HOMEPATH = process.env.HOME || `${process.env.HOMEDRIVE}${process.env.HOMEPATH}`
export const SSH_PATH = path.resolve(HOMEPATH, '.ssh')
export const KSSH_PATH = path.resolve(HOMEPATH, '.kssh')
export const SSH_CONFILE = path.resolve(SSH_PATH, 'config')
export const KSSH_CONFILE = path.resolve(KSSH_PATH, 'config')
export const SSH_CONFHEAD = `# SSH Configure\n`
export const KSSH_CONFHEAD = `; KSSH Configure\n\n`

export const tableStyle = {
  borderStyle : 2,
  paddingBottom : 0,
  headerAlign : "center",
  align : "center",
  color : "white",
  truncate: "..."
}

const getSSHConfig = () => {
  if (!fs.existsSync(SSH_CONFILE)) {
    return []
  }
  let confStr = fs.readFileSync(SSH_CONFILE, 'utf-8')
  let confArr = confStr.split(/(Host)[\s+]/)
  let confData = []
  for (let item of confArr) {
    let info = getSSHInfo(item)
    info && confData.push(info)
  }
  return confData
}

const getSSHInfo = (data) => {
  let info = null
  if (/HostName/.test(data)) {
    info = {}
    let arr = data.split(/\n/)
    arr.map( (item, i) => {
      if (/Host(?=\s)/.test(item)) {
        info['Host'] = item.replace(/Host(?=\s)/, '').replace(/(\s|\r)/g, '')
      }
      else if (i === 0) {
        info['Host'] = item.replace(/(\s|\r)/g, '')
      }
      if (/HostName(?=\s)/.test(item)) {
        info['HostName'] = item.replace(/HostName(?=\s)/, '').replace(/\s/g, '')
      }
      if (/User(?=\s)/.test(item)) {
        info['User'] = item.replace(/User(?=\s)/, '').replace(/\s/g, '')
      }
      if (/Port/.test(item)) {
        info['Port'] = item.replace(/Port(?=\s)/, '').replace(/\s/g, '')
      }
      if (/IdentityFile(?=\s)/.test(item)) {
        info['IdentityFile'] = item.replace(/IdentityFile(?=\s)/, '').replace(/\s/g, '')
      }
    })
  }
  return info
}

export const SSH_CONF = getSSHConfig()

const getGitCommit = () => {
  let gitConfigFile = path.resolve(HOMEPATH, '.gitconfig')
  let gitConfig = {}
  let commitStr = null
  if (fs.existsSync(gitConfigFile)) {
    gitConfig = ini.parse(fs.readFileSync(gitConfigFile, 'utf-8'))
    if (gitConfig.user) {
      commitStr = []
      _.has(gitConfig.user, 'name') && commitStr.push(gitConfig.user.name)
      _.has(gitConfig.user, 'email') && commitStr.push(`<${gitConfig.user.email}>`)
      return _.join(commitStr, ' ')
    }
  }
  return commitStr
}

export const gitCommit = getGitCommit()

const getKSSHConfig = () => {
  if (!fs.existsSync(KSSH_CONFILE)) {
    return null
  }
  let confStr = fs.readFileSync(KSSH_CONFILE, 'utf-8')
  return ini.parse(confStr)
}

export const KSSH_CONF = getKSSHConfig()

export const saveSSHConf = (config) => {
  let infoData = SSH_CONFHEAD
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
  fs.writeFileSync(SSH_CONFILE, infoData, 'utf-8')
}

export const toFullPath = (name) => {
  let arr = name.split('~/')
  if (arr.length > 1) {
    arr[0] = HOMEPATH
  }
  return path.resolve(...arr)
}

export const toAliasPath = (name) => name.replace(HOMEPATH, '~').replace(/\\/g, '/')
