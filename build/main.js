require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs-extra");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveSSHConf = exports.KSSH_CONF = exports.gitCommit = exports.SSH_CONF = exports.tableStyle = exports.KSSH_CONFHEAD = exports.SSH_CONFHEAD = exports.KSSH_CONFILE = exports.SSH_CONFILE = exports.KSSH_PATH = exports.SSH_PATH = exports.HOMEPATH = undefined;

var _path = __webpack_require__(3);

var _path2 = _interopRequireDefault(_path);

var _fsExtra = __webpack_require__(1);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _ini = __webpack_require__(7);

var _ini2 = _interopRequireDefault(_ini);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HOMEPATH = exports.HOMEPATH = process.env.HOME || process.env.HOMEPATH;
var SSH_PATH = exports.SSH_PATH = _path2.default.resolve(HOMEPATH, '.ssh');
var KSSH_PATH = exports.KSSH_PATH = _path2.default.resolve(HOMEPATH, '.kssh');
var SSH_CONFILE = exports.SSH_CONFILE = _path2.default.resolve(SSH_PATH, 'config');
var KSSH_CONFILE = exports.KSSH_CONFILE = _path2.default.resolve(KSSH_PATH, 'config');
var SSH_CONFHEAD = exports.SSH_CONFHEAD = '# SSH Configure\n';
var KSSH_CONFHEAD = exports.KSSH_CONFHEAD = '; KSSH Configure\n';

var tableStyle = exports.tableStyle = {
  borderStyle: 2,
  paddingBottom: 0,
  headerAlign: "center",
  align: "center",
  color: "white",
  truncate: "..."
};

var getSSHConfig = function getSSHConfig() {
  if (!_fsExtra2.default.existsSync(SSH_CONFILE)) {
    return [];
  }
  var confStr = _fsExtra2.default.readFileSync(SSH_CONFILE, 'utf-8');
  var confArr = confStr.split(/(Host)[\s+]/);
  var confData = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = confArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      var info = getSSHInfo(item);
      info && confData.push(info);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return confData;
};

var getSSHInfo = function getSSHInfo(data) {
  var info = null;
  if (/HostName/.test(data)) {
    info = {};
    var arr = data.split(/\n/);
    arr.map(function (item, i) {
      if (/Host(?=\s)/.test(item)) {
        info['Host'] = item.replace(/Host(?=\s)/, '').replace(/(\s|\r)/g, '');
      } else if (i === 0) {
        info['Host'] = item.replace(/(\s|\r)/g, '');
      }
      if (/HostName(?=\s)/.test(item)) {
        info['HostName'] = item.replace(/HostName(?=\s)/, '').replace(/\s/g, '');
      }
      if (/User(?=\s)/.test(item)) {
        info['User'] = item.replace(/User(?=\s)/, '').replace(/\s/g, '');
      }
      if (/Port/.test(item)) {
        info['Port'] = item.replace(/Port(?=\s)/, '').replace(/\s/g, '');
      }
      if (/IdentityFile(?=\s)/.test(item)) {
        info['IdentityFile'] = item.replace(/IdentityFile(?=\s)/, '').replace(/\s/g, '');
      }
    });
  }
  return info;
};

var SSH_CONF = exports.SSH_CONF = getSSHConfig();

var getGitCommit = function getGitCommit() {
  var gitConfigFile = _path2.default.resolve(HOMEPATH, '.gitconfig');
  var gitConfig = {};
  var commitStr = null;
  if (_fsExtra2.default.existsSync(gitConfigFile)) {
    gitConfig = _ini2.default.parse(_fsExtra2.default.readFileSync(gitConfigFile, 'utf-8'));
    if (gitConfig.user) {
      commitStr = [];
      _lodash2.default.has(gitConfig.user, 'name') && commitStr.push(gitConfig.user.name);
      _lodash2.default.has(gitConfig.user, 'email') && commitStr.push('<' + gitConfig.user.email + '>');
      return _lodash2.default.join(commitStr, ' ');
    }
  }
  return commitStr;
};

var gitCommit = exports.gitCommit = getGitCommit();

var getKSSHConfig = function getKSSHConfig() {
  if (!_fsExtra2.default.existsSync(KSSH_CONFILE)) {
    return null;
  }
  var confStr = _fsExtra2.default.readFileSync(KSSH_CONFILE, 'utf-8');
  return _ini2.default.parse(confStr);
};

var KSSH_CONF = exports.KSSH_CONF = getKSSHConfig();

var saveSSHConf = exports.saveSSHConf = function saveSSHConf(config) {
  var infoData = SSH_CONFHEAD;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = config[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var e = _step2.value;

      infoData += '\n';
      infoData += '#' + e.Host + '\n';
      infoData += 'Host ' + e.Host + '\n';
      infoData += '    HostName ' + e.HostName + '\n';
      infoData += '    User ' + e.User + '\n';
      if (e.Port) {
        infoData += '    Port ' + e.Port + '\n';
      }
      infoData += '    IdentityFile ' + e.IdentityFile + '\n';
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  _fsExtra2.default.writeFileSync(SSH_CONFILE, infoData, 'utf-8');
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _init = __webpack_require__(5);

Object.defineProperty(exports, 'init', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_init).default;
  }
});

var _list = __webpack_require__(8);

Object.defineProperty(exports, 'list', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_list).default;
  }
});

var _create = __webpack_require__(10);

Object.defineProperty(exports, 'create', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_create).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = __webpack_require__(1);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _nodeStatus = __webpack_require__(6);

var _nodeStatus2 = _interopRequireDefault(_nodeStatus);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var taskList = [{
  message: 'Check the system ssh directory',
  doTask: function doTask() {
    return !_fsExtra2.default.existsSync(_base.SSH_PATH) && _fsExtra2.default.mkdirpSync(_base.SSH_PATH);
  }
}, {
  message: 'Check the system ssh configuration file',
  doTask: function doTask() {
    return !_fsExtra2.default.existsSync(_base.SSH_CONFILE) && _fsExtra2.default.writeFileSync(_base.SSH_CONFILE, _base.SSH_CONFHEAD, 'utf-8');
  }
}, {
  message: 'Check the system kssh directory',
  doTask: function doTask() {
    return !_fsExtra2.default.existsSync(_base.KSSH_PATH) && _fsExtra2.default.mkdirpSync(_base.KSSH_PATH);
  }
}, {
  message: 'Check the system kssh configuration file',
  doTask: function doTask() {
    return !_fsExtra2.default.existsSync(_base.KSSH_CONFILE) && _fsExtra2.default.writeFileSync(_base.KSSH_CONFILE, _base.KSSH_CONFHEAD, 'utf-8');
  }
}];
var task = _nodeStatus2.default.addItem('task', {
  steps: _lodash2.default.map(taskList, function (o, i) {
    return '[' + (i + 1) + '/' + taskList.length + '] ' + o.message;
  })
});

exports.default = function () {
  console.log('\n  Starting Initial tasks ...\n');
  _nodeStatus2.default.start({ pattern: '{spinner.cyan} {task.step}' });
  doTaskWork();
};

var doneTask = function doneTask() {
  var index = task.count;
  try {
    taskList[index].doTask();
    task.doneStep(1);
  } catch (error) {
    task.doneStep(0, error);
  }
  if (task.count >= task.steps.length) {
    _nodeStatus2.default.stop();
    return console.log('\n  All Initial tasks completed!\n');
  }
  doTaskWork();
};

var doTaskWork = function doTaskWork() {
  return setTimeout(doneTask, 500);
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("node-status");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("ini");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ttyTable = __webpack_require__(9);

var _ttyTable2 = _interopRequireDefault(_ttyTable);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bodyHeader = [{
  value: 'Name',
  align: 'center',
  width: 20,
  paddingLeft: 2
}, {
  value: 'Host',
  align: 'left',
  width: 30,
  paddingLeft: 2
}, {
  value: 'Port',
  align: 'center',
  width: 10,
  paddingLeft: 2
}, {
  value: 'User',
  align: 'center',
  width: 15,
  paddingLeft: 2
}, {
  value: 'IdentityFile',
  align: 'left',
  width: 40,
  paddingLeft: 2
}];

exports.default = function () {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';

  var list = _base.SSH_CONF;
  if (/^(git|other)$/.test(type)) {
    list = _lodash2.default.filter(list, function (o) {
      return (/^(git)$/.test(type) ? o.User === 'git' : o.User !== 'git'
      );
    });
  }
  var bodyer = toBodyer(list);
  var t3 = (0, _ttyTable2.default)(bodyHeader, bodyer, _base.tableStyle);
  console.log(t3.render(), '\n');
  process.exit(0);
};

var toBodyer = function toBodyer(data) {
  var dataList = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      dataList.push([item.Host || '--', item.HostName || '--', item.Port || '--', item.User || '--', item.IdentityFile || '--']);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return dataList;
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("tty-table");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(3);

var _path2 = _interopRequireDefault(_path);

var _fsExtra = __webpack_require__(1);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _inquirer = __webpack_require__(11);

var _inquirer2 = _interopRequireDefault(_inquirer);

var _runscript = __webpack_require__(12);

var _runscript2 = _interopRequireDefault(_runscript);

var _ora = __webpack_require__(13);

var _ora2 = _interopRequireDefault(_ora);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (type) {
  var options = null;
  var current = null;
  return inquirerByName().then(function (ret) {
    current = _lodash2.default.findIndex(_base.SSH_CONF, function (o) {
      return o.Host == ret.name;
    });
    return inquirerByHost(ret, type);
  }).then(function (ret) {
    options = ret;
    var bash = ['ssh-keygen -t rsa'];
    ret.commit && bash.push('-C "' + ret.commit + '"');
    var keyFile = _path2.default.resolve(_base.SSH_PATH, ret.name);
    bash.push('-f ' + keyFile);
    return (0, _runscript2.default)(_lodash2.default.join(bash, ' '));
  }).then(function () {
    console.log('');
    var spinner = (0, _ora2.default)('    Create SSH key ...').start();
    var newSSH = Object.assign({
      Host: options.name,
      HostName: options.host,
      User: options.user
    }, options.port !== 22 ? { Port: options.port } : null, {
      IdentityFile: _path2.default.resolve(_base.SSH_PATH, options.name).replace(new RegExp('^(' + _base.HOMEPATH + ')'), '~')
    });
    var newSSHConf = _base.SSH_CONF;
    var successTag = 'create';
    if (current > -1) {
      newSSHConf[current] = newSSH;
      successTag = 'update';
    } else {
      newSSHConf.push(newSSH);
    }
    (0, _base.saveSSHConf)(newSSHConf);
    setTimeout(function () {
      spinner.stop();
      console.log('\n\u2714    ' + successTag + ' [' + options.name + '] SSH key successfully!\n');
    }, 500);
  }).catch(function (error) {
    process.exit(0);
  });
};

var inquirerByName = function inquirerByName() {
  return _inquirer2.default.prompt([{
    type: 'input',
    name: 'name',
    message: 'Name ?',
    validate: validName
  }]);
};

var inquirerByHost = function inquirerByHost(opts, type) {
  var repository = _base.KSSH_CONF['repository'][type];
  return _inquirer2.default.prompt([Object.assign({
    type: 'input',
    name: 'host',
    message: 'Input Host Name Or IP Address: '
  }, _lodash2.default.has(repository, 'host') ? { default: repository.host } : null, {
    validate: validHost
  }), {
    type: 'input',
    name: 'port',
    message: 'Input Host Port: (0-99999)',
    default: 22,
    validate: validPort
  }, Object.assign({
    type: 'input',
    name: 'user',
    message: 'Input Host User: '
  }, _lodash2.default.has(repository, 'user') ? { default: repository.user } : null, {
    validate: validUser
  }), Object.assign({
    type: 'input',
    name: 'commit',
    message: 'Input Commit: '
  }, _base.gitCommit ? { default: _base.gitCommit } : null)]).then(function (ret) {
    return Object.assign({}, opts, ret);
  });
};

var validName = function validName(value) {
  if (_lodash2.default.isEmpty(value.replace(/\s+/, ''))) {
    return 'Name is required！';
  }
  if (value === 'config') {
    return 'Name can not be \'config\' !';
  }
  return true;
};

var validHost = function validHost(value) {
  if (_lodash2.default.isEmpty(value.replace(/\s+/, ''))) {
    return 'Host is required！';
  }
  if (/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/.test(value) && /\.([a-z]+)$/.test(value)) {
    return true;
  }
  if (/^([0-9]|[1-9][0-9]|[1][0-9][0-9]|[2][0-5][0-5])[.]([0-9]|[1-9][0-9]|[1][0-9][0-9]|[2][0-5][0-5])[.]([0-9]|[1-9][0-9]|[1][0-9][0-9]|[2][0-5][0-5])[.]([0-9]|[1-9][0-9]|[1][0-9][0-9]|[2][0-5][0-5])$/.test(value)) {
    return true;
  }
  return 'Host is not the correct domain name or ip address';
};

var validPort = function validPort(value) {
  var val = Number(value);
  if (!_lodash2.default.isInteger(val) || val > 99999 || val < 0) {
    return 'Port must be an integer from 0-99999';
  }
  return true;
};

var validUser = function validUser(value) {
  if (_lodash2.default.isEmpty(value.replace(/\s+/, ''))) {
    return 'User is required！';
  }
  if (!/^[a-zA-Z\d\-\_\.]+$/.test(value)) {
    return 'User is malformed';
  }
  return true;
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("inquirer");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("runscript");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("ora");

/***/ })
/******/ ]);
//# sourceMappingURL=main.map