
const inquirer = require('inquirer')
const runscript = require('runscript')
const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const { sshRoot, getList, saveConfig } = require('./base')

const setting = [
  {
    type: 'github',
    host: 'github.com',
    user: 'git'
  },
  {
    type: 'coding',
    host: 'git.coding.net',
    user: 'git'
  },
  {
    type: 'oschina',
    host: 'git.oschina.net',
    user: 'git'
  },
]

const create = () => {
  let options = null
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'input Name: ',
      validate: validName
    },
  ])
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
    return inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Choose a type from the options below: ',
        choices: ['1) github', '2) coding', '3) oschina', '4) customize']
      }
    ])
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
    return _.find(setting, o => o.type === options.type.replace(/^\d\)\s+/, ''))
  })
  .then( ret => {
    options = { ...options, ...ret }
    return inquirer.prompt([
      {
        type: 'input',
        name: 'comment',
        message: 'Input Comment: ',

      }
    ])
  })
  .then( ret => {
    let comment = ''
    if (!_.isEmpty(ret.comment)) {
      comment = `-C "${ret.comment}" `
    }
    return runscript(`ssh-keygen -t rsa ${comment}-f ~/.ssh/${options.name}`)
  })
  .then( ret => {
    let plus = {}
    if (options.port && (options.port !== 0 || options.port !== 22)) {
      plus['Port'] = options.port
    }
    let list = [ 
      ...getList(), 
      {
        Host: options.name,
        HostName: options.host,
        User: options.user,
        ...plus,
        IdentityFile: `~/.ssh/${options.name}`
      }
    ]
    saveConfig(list)
    console.info(`✔ create [${options.name}] ssh key successfully!`)
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