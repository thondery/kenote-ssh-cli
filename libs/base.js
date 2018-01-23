
const path = require('path')
const fs = require('fs-extra')
const ini = require('ini')
const archiver = require('archiver')
const _ = require('lodash')
const bytes = require('bytes')
const ora = require('ora')

const defaultArchiveOptions = {
  archive: {
    output: path.resolve(process.cwd(), 'kssh.zip'),
    format: 'zip'
  },
  options: {
    zlib: { level: 9 }
  },
  files: []
}

var homePath = process.env.HOME || process.env.HOMEPATH
exports.sshRoot = path.resolve(homePath, '.ssh')
exports.ksshRoot = path.resolve(homePath, '.kssh')

exports.isInitial = () => {
  !fs.existsSync(exports.sshRoot) && fs.mkdirpSync(exports.sshRoot)
  if (!fs.existsSync(path.resolve(exports.ksshRoot, 'config'))) {
    console.log(`\n    Please initialize the configuration !\n`)
    return false
  }
  return true
}

exports.repository = (() => {
  let config
  try {
    let configIni = fs.readFileSync(path.resolve(exports.ksshRoot, 'config'), 'utf-8')
    config = ini.parse(configIni)
    return config.repository
  } catch (error) {
    return undefined
  }
})()

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

exports.compression = (opts) => {
  opts = {
    archive: { ...defaultArchiveOptions.archive, ...opts.archive },
    options: { ...defaultArchiveOptions.options, ...opts.options },
    files: [ ...defaultArchiveOptions.files, ...opts.files ]
  }
  console.log('\n     Zipping to %s\n', opts.archive.output)
  let archive = archiver(opts.archive.format, opts.options)
  let output = fs.createWriteStream(opts.archive.output)
  let spinner = ora('Loading unicorns').start()
  output.on('colse', () => {
    console.log(archive.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })
  output.on('end', () => {
    console.log('Data has been drained')
  })
  archive.on('error', (err) => {
    throw err
  })
  archive.on('end', () => {
    let archiveSize = archive.pointer()
    setTimeout(() => {
      spinner.stop()
      console.log('✔   Complete Zipping, Archiver wrote %s !\n', bytes(archiveSize))
    }, 500)
  })
  archive.pipe(output)
  appendArchive(opts.files, archive)
  archive.finalize()
}

function appendArchive (files, archive) {
  files.map((item, i) => {
    if (item.file) {
      archive.file(item.file, { name: item.name })
    }
    else if (item.directory) {
      archive.directory(item.directory.path, item.name)
      if (item.directory.files) {
        appendArchive(item.directory.files, archive)
      }
    }
  })
}

const getInfo = (data) => {
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