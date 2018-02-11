
import fs from 'fs-extra'
import ini from 'ini'
import ora from 'ora'
import { SSH_PATH, SSH_CONFILE, SSH_CONFHEAD, KSSH_PATH, KSSH_CONFILE, KSSH_CONFHEAD } from './base'

export default () => {
  console.log('')
  let spinner = ora('    Initial Configuration ...').start()
  !fs.existsSync(SSH_PATH) && fs.mkdirpSync(SSH_PATH)
  !fs.existsSync(SSH_CONFILE) && fs.writeFileSync(SSH_CONFILE, SSH_CONFHEAD, 'utf-8')
  !fs.existsSync(KSSH_PATH) && fs.mkdirpSync(KSSH_PATH)
  let ksshConf = {
    archiver: {
      format: 'zip',
      options: {
        zlib: { level: 9 }
      }
    },
    repository: {
      github: {
        host: 'github.com',
        user: 'git'
      },
      gitee: {
        host: 'gitee.com',
        user: 'git'
      },
      coding: {
        host: 'git.coding.net',
        user: 'git'
      }
    }
  }
  let KSSH_CONF = KSSH_CONFHEAD+ini.stringify(ksshConf, { whitespace: true })
  !fs.existsSync(KSSH_CONFILE) && fs.writeFileSync(KSSH_CONFILE, KSSH_CONF, 'utf-8')
  setTimeout(() => {
    spinner.stop()
    console.log(`✔    Initial Configuration successfully!\n`)
  }, 500)
}