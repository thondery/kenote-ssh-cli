
import path, { resolve } from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import moment from 'moment'
import archiver from 'archiver'
import bytes from 'bytes'
import ora from 'ora'
import _ from 'lodash'
import { SSH_PATH, SSH_CONF, KSSH_CONF, KSSH_PATH } from './base'

export default () => {
  let options = null
  let spinner = null
  return inquirer.prompt([
    {
      type: 'input',
      name: 'bakfile',
      message: 'Please enter the backup file name :',
      default: moment().format('YYYY-MM-DD@HHmmss'),
      validate: validFileName
    }
  ])
  .then( ret => {
    let suffix = _.has(KSSH_CONF, 'archiver.format') ? KSSH_CONF.archiver.format : 'zip'
    let bakfile = path.resolve(KSSH_PATH, `${ret.bakfile}.${suffix}`)
    options = { bakfile }
    if (fs.existsSync(bakfile)) {
      return inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'File already exists, is it overwritten :',
          default: false
        }
      ])
    }
    return { overwrite: true }
  })
  .then( ret => {
    if (!ret.overwrite) {
      console.log(`\n    The user automatically cancels the backup operation.\n`)
      throw new Error('The user automatically cancels the backup operation.')
    }
    console.log('')
    spinner = ora('    Backup ssh key for All ...').start()
    return backup(options.bakfile)
  })
  .then( archiveSize => {
    setTimeout(() => {
      spinner.stop()
      console.log('✔   Backup ssh key for All, Archiver wrote %s !\n', bytes(archiveSize))
    }, 500)
  })
  .catch( err => {
    process.exit(0)
  })
}

const validFileName = (value) => {
  if (/(\s|\/|\\)+/.test(_.trim(value))) {
    return 'The file name is malformed !'
  }
  return true
}

const backup = (zipFile) => {
  let sshList = SSH_CONF
  let files = []
  pushFile(files, 'config')
  pushFile(files, 'known_hosts')
  for (let item of sshList) {
    let identityFile = path.basename(item.IdentityFile)
    pushFile(files, identityFile)
    pushFile(files, `${identityFile}.pub`)
  }
  let format = _.has(KSSH_CONF, 'archiver.format') ? KSSH_CONF.archiver.format : 'zip'
  let options = {
    zlib: { level: 9 },
    ..._.has(KSSH_CONF, 'archiver.options') ? KSSH_CONF.archiver.options : null
  }
  return new Promise((resolve, reject) => {
    let archive = archiver(format, options)
    let output = fs.createWriteStream(zipFile)
    output.on('colse', () => {
      console.log(archive.pointer() + ' total bytes')
      console.log('archiver has been finalized and the output file descriptor has closed.')
    })
    output.on('end', () => {
      console.log('Data has been drained')
    })
    archive.on('error', (err) => {
      reject(err)
    })
    archive.on('end', () => {
      let archiveSize = archive.pointer()
      resolve(archiveSize)
    })
    archive.pipe(output)
    appendArchive(files, archive)
    archive.finalize()
  })
  
}

const pushFile = (files, fileName) => {
  if (fs.existsSync(path.resolve(SSH_PATH, fileName))) {
    files.push({
      name: fileName, file: path.resolve(SSH_PATH, fileName)
    })
  }
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
