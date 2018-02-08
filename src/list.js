
import Table from 'tty-table'
import _ from 'lodash'
import { tableStyle, SSH_CONF } from './base'

const bodyHeader = [
  {
    value: 'Name',
    align: 'center',
    width: 20,
    paddingLeft: 2
  },
  {
    value: 'Host',
    align: 'left',
    width: 30,
    paddingLeft: 2
  },
  {
    value: 'Port',
    align: 'center',
    width: 10,
    paddingLeft: 2
  },
  {
    value: 'User',
    align: 'center',
    width: 15,
    paddingLeft: 2
  },
  {
    value: 'IdentityFile',
    align: 'left',
    width: 40,
    paddingLeft: 2
  }
]

export default (type = 'all') => {
  let list = SSH_CONF
  if (/^(git|other)$/.test(type)) {
    list = _.filter(list, o => /^(git)$/.test(type) ? o.User === 'git' : o.User !== 'git')
  }
  let bodyer = toBodyer(list)
  let t3 = Table(bodyHeader, bodyer, tableStyle)
  console.log(t3.render(), '\n')
  process.exit(0)
}

const toBodyer = (data) => {
  let dataList = []
  for (let item of data) {
    dataList.push([
      item.Host || '--',
      item.HostName || '--',
      item.Port || '--',
      item.User || '--',
      item.IdentityFile  || '--'
    ])
  }
  return dataList
}