
const path = require('path')
const fs = require('fs-extra')
const moment = require('moment')
const inquirer = require('inquirer')
const { compression, sshRoot, getList } = require('./base')
const backupDir = path.resolve(process.env.HOME || process.env.HOMEPATH, '.kssh')

module.exports = (yes = false) => {
  let options = null
  if (yes) return backup()
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'isBackup',
      message: 'Are you sure you want to back up ssh key?'
    }
  ])
  .then( ret => {
    if (ret.isBackup) {
      // 进行备份
      backup()
    }
  })
}

const backup = () => {
  !fs.existsSync(backupDir) && fs.mkdirpSync(backupDir)
  let sshList = getList()
  let output = moment().format('YYYYMMDDHHmmss')
  let files = []
  pushFile(files, 'config')
  sshList.forEach((item, i) => {
    let fileName = path.basename(item.IdentityFile.replace(/^(\~)/, process.env.HOME || process.env.HOMEPATH))
    pushFile(files, fileName)
    pushFile(files, `${fileName}.pub`)
  })
  compression({
    archive: {
      output: path.resolve(backupDir, `${output}.zip`),
      format: 'zip'
    },
    options: {
      zlib: { level: 9 }
    },
    files: files
  })
}

const pushFile = (files, fileName) => {
  if (fs.existsSync(path.resolve(sshRoot, fileName))) {
    files.push({
      name: fileName, file: path.resolve(sshRoot, fileName)
    })
  }
}