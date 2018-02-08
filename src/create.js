
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import runscript from 'runscript'
import ora from 'ora'
import _ from 'lodash'
import { SSH_PATH, SSH_CONF, SSH_CONFILE, KSSH_CONF, gitCommit, saveSSHConf, HOMEPATH } from './base'

export default (type) => {
  let options = null
  let current = null
  return inquirerByName()
  .then( ret => {
    current = _.findIndex(SSH_CONF, o => o.Host == ret.name)
    return inquirerByHost(ret, type)
  })
  .then( ret => {
    options = ret
    let bash = [`ssh-keygen -t rsa`]
    ret.commit && bash.push(`-C "${ret.commit}"`)
    let keyFile = path.resolve(SSH_PATH, ret.name)
    bash.push(`-f ${keyFile}`)
    return runscript(_.join(bash, ' '))
  })
  .then( () => {
    console.log('')
    let spinner = ora('    Create SSH key ...').start()
    let newSSH = {
      Host: options.name,
      HostName: options.host,
      User: options.user,
      ...options.port !== 22 ? { Port: options.port } : null,
      IdentityFile: path.resolve(SSH_PATH, options.name).replace(new RegExp(`^(${HOMEPATH})`), '~')
    }
    let newSSHConf = SSH_CONF
    let successTag = 'create'
    if (current > -1) {
      newSSHConf[current] = newSSH
      successTag = 'update'
    }
    else {
      newSSHConf.push(newSSH)
    }
    saveSSHConf(newSSHConf)
    setTimeout(() => {
      spinner.stop()
      console.log(`\n✔    ${successTag} [${options.name}] SSH key successfully!\n`)
    }, 500)
  })
  .catch( error => {
    process.exit(0)
  })
}

const inquirerByName = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Name ?',
      validate: validName
    }
  ])
}

const inquirerByHost = (opts, type) => {
  let repository = KSSH_CONF['repository'][type]
  return inquirer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Input Host Name Or IP Address: ',
      ..._.has(repository, 'host') ? { default: repository.host } : null,
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
      ..._.has(repository, 'user') ? { default: repository.user } : null,
      validate: validUser
    },
    {
      type: 'input',
      name: 'commit',
      message: 'Input Commit: ',
      ...gitCommit ? { default: gitCommit } : null
    }
  ])
  .then( ret => ({ ...opts, ...ret }) )
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