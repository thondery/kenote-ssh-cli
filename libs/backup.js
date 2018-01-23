
const path = require('path')
const fs = require('fs-extra')
const moment = require('moment')
const inquirer = require('inquirer')
const _ = require('lodash')
const { compression, sshRoot, getList, isInitial, ksshRoot } = require('./base')

module.exports = () => {
  let options = null
  if (!isInitial()) return
  return inquirer.prompt([
    {
      type: 'input',
      name: 'fileName',
      message: 'Please enter the backup file name ?',
      default: moment().format('YYYYMMDDHHmm'),
      validate: validFileName
    }
  ])
  .then( ret => {
    let fileName = `${_.trim(ret.fileName)}.zip`
    let zipFile = path.resolve(ksshRoot, fileName)
    options = { ...options, zipFile }
    if (fs.existsSync(zipFile)) {
      return inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'File already exists, is it overwritten ?',
          default: false
        }
      ])
    }
    return { overwrite: true }
  })
  .then( ret => {
    if (!ret.overwrite) {
      console.log(`\n    The user automatically cancels the backup operation.\n`)
      return
    }
    backup(options.zipFile)
  })
}

const validFileName = (value) => {
  if (/(\s|\/|\\)+/.test(_.trim(value))) {
    return 'The file name is malformed !'
  }
  return true
}

const backup = (zipFile) => {
  let sshList = getList()
  let files = []
  pushFile(files, 'config')
  sshList.forEach((item, i) => {
    let fileName = path.basename(item.IdentityFile.replace(/^(\~)/, process.env.HOME || process.env.HOMEPATH))
    pushFile(files, fileName)
    pushFile(files, `${fileName}.pub`)
  })
  compression({
    archive: {
      output: zipFile,
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