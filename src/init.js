
import fs from 'fs-extra'
import status from 'node-status'
import _ from 'lodash'
import { SSH_PATH, SSH_CONFILE, SSH_CONFHEAD, KSSH_PATH, KSSH_CONFILE, KSSH_CONFHEAD } from './base'

const taskList = [
  {
    message: 'Check the system ssh directory',
    doTask: () => !fs.existsSync(SSH_PATH) && fs.mkdirpSync(SSH_PATH)
  },
  {
    message: 'Check the system ssh configuration file',
    doTask: () => !fs.existsSync(SSH_CONFILE) && fs.writeFileSync(SSH_CONFILE, SSH_CONFHEAD, 'utf-8')
  },
  {
    message: 'Check the system kssh directory',
    doTask: () => !fs.existsSync(KSSH_PATH) && fs.mkdirpSync(KSSH_PATH)
  },
  {
    message: 'Check the system kssh configuration file',
    doTask: () => !fs.existsSync(KSSH_CONFILE) && fs.writeFileSync(KSSH_CONFILE, KSSH_CONFHEAD, 'utf-8')
  }
]
const task = status.addItem('task', {
  steps: _.map(taskList, (o, i) => `[${i+1}/${taskList.length}] ${o.message}`)
})

export default () => {
  console.log(`\n  Starting Initial tasks ...\n`)
  status.start({ pattern: '{spinner.cyan} {task.step}' })
  doTaskWork()
}

const doneTask = () => {
  let index = task.count
  try {
    taskList[index].doTask()
    task.doneStep(1)
  } catch (error) {
    task.doneStep(0, error)
  }
  if (task.count >= task.steps.length) {
    status.stop()
    return console.log(`\n  All Initial tasks completed!\n`)
  }
  doTaskWork()
}

const doTaskWork = () => setTimeout(doneTask, 500)