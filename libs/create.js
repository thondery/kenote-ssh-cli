
const inquirer = require('inquirer')
const runscript = require('runscript')
const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')
const _ = require('lodash')
const { sshRoot, getList, saveConfig, defaultCommit, isInitial, repository } = require('./base')

const create = (sshName) => {
  let options = null
  if (!isInitial) return
  let repositoryType = _.keys(repository)
  return (sshName ? 
    new Promise((resolve, reject) => {
      resolve({ name: sshName })
    }) : inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'input Name: ',
        validate: validName
      },
    ])
  )
  .then( ret => {
    options = { ...options, ...ret }
    if (fs.existsSync(path.resolve(sshRoot, options.name))) {
      return inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Name already exists, is it overwritten?',
          default: false
        }
      ])
    }
    return { overwrite: true }
  })
  .then( ret => {
    if (!ret.overwrite) {
      throw new Error('Name already exists')
    }
    if (fs.existsSync(path.resolve(sshRoot, options.name))) {
      fs.removeSync(path.resolve(sshRoot, options.name))
      fs.removeSync(path.resolve(sshRoot, `${options.name}.pub`))
    }
    if (repositoryType.length > 0) {
      return inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Choose a type from the options below: ',
          choices: [..._.keys(repository), 'customize']
        }
      ])
    }
    else {
      return { type: 'customize' }
    }
  })
  .then( ret => {
    options = { ...options, ...ret }
    if (/customize$/.test(options.type)) {
      return inquirer.prompt([
        {
          type: 'input',
          name: 'host',
          message: 'Input Host Name Or IP Address: ',
          validate: validHost
        },
        {
          type: 'input',
          name: 'port',
          message: 'Input Host Port: (0-99999)',
          default: 22,
          validate: validPort
        },
        {
          type: 'input',
          name: 'user',
          message: 'Input Host User: ',
          default: 'root',
          validate: validUser
        }
      ])
    }
    return repository[options.type]
  })
  .then( ret => {
    options = { ...options, ...ret }
    return inquirer.prompt([
      {
        type: 'input',
        name: 'comment',
        message: 'Input Comment: ',
        ...defaultCommit ? {
          default: defaultCommit
        } : null
      }
    ])
  })
  .then( ret => {
    let comment = ''
    if (!_.isEmpty(ret.comment)) {
      comment = `-C "${ret.comment}" `
    }
    let sshFile = path.resolve(sshRoot, options.name)
    return runscript(`ssh-keygen -t rsa ${comment}-f ${sshFile}`)
  })
  .then( ret => {
    let plus = {}
    if (options.port && (options.port !== 0 || options.port !== 22)) {
      plus['Port'] = options.port
    }
    console.log('')
    let spinner = ora('    Create SSH key ...').start()
    let sshFile = path.resolve(sshRoot, options.name)
    let list = [ 
      ..._.filter(getList(), o => o.Host !== options.name), 
      {
        Host: options.name,
        HostName: options.host,
        User: options.user,
        ...plus,
        IdentityFile: sshFile
      }
    ]
    saveConfig(list)
    setTimeout(() => {
      spinner.stop()
      console.log(`\n✔    create [${options.name}] SSH key successfully!\n`)
    }, 500)
  })
  .catch( err => {
    process.exit(0)
  })
}

const validName = (value) => {
  if (_.isEmpty(value.replace(/\s+/, ''))) {
    return 'Name is required！'
  }
  if (value === 'config') {
    return 'Name can not be \'config\' !'
  }
  return true
}

const validHost = (value) => {
  if (_.isEmpty(value.replace(/\s+/, ''))) {
    return 'Host is required！'
  }
  if (/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/.test(value) && /\.([a-z]+)$/.test(value)) {
    return true
  }
  if (/^([0-9]|[1-9][0-9]|[1][0-9][0-9]|[2][0-5][0-5])[.]([0-9]|[1-9][0-9]|[1][0-9][0-9]|[2][0-5][0-5])[.]([0-9]|[1-9][0-9]|[1][0-9][0-9]|[2][0-5][0-5])[.]([0-9]|[1-9][0-9]|[1][0-9][0-9]|[2][0-5][0-5])$/.test(value)) {
    return true
  }
  return 'Host is not the correct domain name or ip address'
}

const validPort = (value) => {
  let val = Number(value)
  if (!_.isInteger(val) || val > 99999 || val < 0) {
    return 'Port must be an integer from 0-99999'
  }
  return true
}

const validUser = (value) => {
  if (_.isEmpty(value.replace(/\s+/, ''))) {
    return 'User is required！'
  }
  if (!/^[a-zA-Z\d\-\_\.]+$/.test(value)) {
    return 'User is malformed'
  }
  return true
}

module.exports = create