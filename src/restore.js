
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import inquirerAutocomplete from 'inquirer-autocomplete-prompt'
import fuzzy from 'fuzzy'
import unzip from 'unzip'
import ora from 'ora'
import _ from 'lodash'
import { KSSH_PATH, SSH_PATH } from './base'

inquirer.registerPrompt('autocomplete', inquirerAutocomplete)

export default () => {
  let bakList = []
  if (fs.existsSync(KSSH_PATH)) {
    bakList = _.filter(fs.readdirSync(KSSH_PATH), o => /\.(zip|tar)$/.test(o))
  }
  if (bakList.length === 0) {
    console.log(`\n    Useless to find any backup files.\n`)
    return
  }
  return inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'bakfile',
      message: 'Choose a backup file to restore :',
      source: searchFood,
      pageSize: 10
    }
  ])
  .then( ret => {
    console.log('')
    let spinner = ora(`    Restore Backup file ${ret.bakfile} ...`).start()
    fs.existsSync(path.resolve(KSSH_PATH, ret.bakfile)) && 
      fs.createReadStream(path.resolve(KSSH_PATH, ret.bakfile)).pipe(unzip.Extract({ path: SSH_PATH }))
    setTimeout(() => {
      spinner.stop()
      console.log(`✔    Restore Backup file ${ret.bakfile} successfully!\n`)
    }, 500)
  })

  function searchFood(answers, input) {
    input = input || ''
    return new Promise((resolve) => {
      setTimeout(() => {
        let fuzzyResult = fuzzy.filter(input, bakList)
        resolve(fuzzyResult.map((el) => el.original ))
      }, _.random(30, 500))
    })
  }
}