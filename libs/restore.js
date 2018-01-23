
const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const _ = require('lodash')
const fuzzy = require('fuzzy')
const unzip = require('unzip')
const ora = require('ora')
const { compression, sshRoot, getList, ksshRoot, isInitial } = require('./base')

module.exports = () => {
  if (!isInitial) return
  let bakList = _.filter(fs.readdirSync(ksshRoot), o => /\.(zip|tar)$/.test(o))
  if (bakList.length === 0) {
    return console.log('\n   Did not find the backup file, please backup ssh key !\n')
  }
  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
  return inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'backup',
      message: 'Choose a backup file to restore: ',
      source: searchFood,
      pageSize: 10,
      /*validate: (val) => {
        return val
          ? true
          : 'Type something!';
      }*/
    }
  ])
  .then( ret => {
    console.log('\n  Restore Backup file %s ...\n', ret.backup)
    let spinner = ora('Loading unicorns').start()
    fs.createReadStream(path.resolve(ksshRoot, ret.backup))
      .pipe(unzip.Extract({ path: sshRoot }))
    setTimeout(() => {
      spinner.stop()
      console.log('  Complete Restore !\n')
    }, 500)
  })

  function searchFood(answers, input) {
    input = input || '';
    return new Promise(function(resolve) {
      setTimeout(function() {
        var fuzzyResult = fuzzy.filter(input, bakList);
        resolve(fuzzyResult.map(function(el) {
          return el.original;
        }));
      }, _.random(30, 500));
    });
  }
}