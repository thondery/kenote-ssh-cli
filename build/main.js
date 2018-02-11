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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toAliasPath = exports.toFullPath = exports.saveSSHConf = exports.KSSH_CONF = exports.gitCommit = exports.SSH_CONF = exports.tableStyle = exports.KSSH_CONFHEAD = exports.SSH_CONFHEAD = exports.KSSH_CONFILE = exports.SSH_CONFILE = exports.KSSH_PATH = exports.SSH_PATH = exports.HOMEPATH = undefined;

var _path = __webpack_require__(5);

var _path2 = _interopRequireDefault(_path);

var _fsExtra = __webpack_require__(2);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _ini = __webpack_require__(7);

var _ini2 = _interopRequireDefault(_ini);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var HOMEPATH = exports.HOMEPATH = process.env.HOME || '' + process.env.HOMEDRIVE + process.env.HOMEPATH;
var SSH_PATH = exports.SSH_PATH = _path2.default.resolve(HOMEPATH, '.ssh');
var KSSH_PATH = exports.KSSH_PATH = _path2.default.resolve(HOMEPATH, '.kssh');
var SSH_CONFILE = exports.SSH_CONFILE = _path2.default.resolve(SSH_PATH, 'config');
var KSSH_CONFILE = exports.KSSH_CONFILE = _path2.default.resolve(KSSH_PATH, 'config');
var SSH_CONFHEAD = exports.SSH_CONFHEAD = '# SSH Configure\n';
var KSSH_CONFHEAD = exports.KSSH_CONFHEAD = '; KSSH Configure\n\n';

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

var toFullPath = exports.toFullPath = function toFullPath(name) {
  var arr = name.split('~/');
  if (arr.length > 1) {
    arr[0] = HOMEPATH;
  }
  return _path2.default.resolve.apply(_path2.default, _toConsumableArray(arr));
};

var toAliasPath = exports.toAliasPath = function toAliasPath(name) {
  return name.replace(HOMEPATH, '~').replace(/\\/g, '/');
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("fs-extra");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("inquirer");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("ora");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("runscript");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("ini");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _init = __webpack_require__(9);

Object.defineProperty(exports, 'init', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_init).default;
  }
});

var _list = __webpack_require__(10);

Object.defineProperty(exports, 'list', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_list).default;
  }
});

var _create = __webpack_require__(12);

Object.defineProperty(exports, 'create', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_create).default;
  }
});

var _remove = __webpack_require__(13);

Object.defineProperty(exports, 'remove', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_remove).default;
  }
});

var _upload = __webpack_require__(15);

Object.defineProperty(exports, 'upload', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_upload).default;
  }
});

var _connect = __webpack_require__(16);

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_connect).default;
  }
});

var _backup = __webpack_require__(17);

Object.defineProperty(exports, 'backup', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_backup).default;
  }
});

var _restore = __webpack_require__(21);

Object.defineProperty(exports, 'restore', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_restore).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = __webpack_require__(2);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _ini = __webpack_require__(7);

var _ini2 = _interopRequireDefault(_ini);

var _ora = __webpack_require__(4);

var _ora2 = _interopRequireDefault(_ora);

var _base = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  console.log('');
  var spinner = (0, _ora2.default)('    Initial Configuration ...').start();
  !_fsExtra2.default.existsSync(_base.SSH_PATH) && _fsExtra2.default.mkdirpSync(_base.SSH_PATH);
  !_fsExtra2.default.existsSync(_base.SSH_CONFILE) && _fsExtra2.default.writeFileSync(_base.SSH_CONFILE, _base.SSH_CONFHEAD, 'utf-8');
  !_fsExtra2.default.existsSync(_base.KSSH_PATH) && _fsExtra2.default.mkdirpSync(_base.KSSH_PATH);
  var ksshConf = {
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
  };
  var KSSH_CONF = _base.KSSH_CONFHEAD + _ini2.default.stringify(ksshConf, { whitespace: true });
  !_fsExtra2.default.existsSync(_base.KSSH_CONFILE) && _fsExtra2.default.writeFileSync(_base.KSSH_CONFILE, KSSH_CONF, 'utf-8');
  setTimeout(function () {
    spinner.stop();
    console.log('\u2714    Initial Configuration successfully!\n');
  }, 500);
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ttyTable = __webpack_require__(11);

var _ttyTable2 = _interopRequireDefault(_ttyTable);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(0);

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
/* 11 */
/***/ (function(module, exports) {

module.exports = require("tty-table");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(5);

var _path2 = _interopRequireDefault(_path);

var _fsExtra = __webpack_require__(2);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _inquirer = __webpack_require__(3);

var _inquirer2 = _interopRequireDefault(_inquirer);

var _runscript = __webpack_require__(6);

var _runscript2 = _interopRequireDefault(_runscript);

var _ora = __webpack_require__(4);

var _ora2 = _interopRequireDefault(_ora);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(0);

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
      IdentityFile: (0, _base.toAliasPath)(_path2.default.resolve(_base.SSH_PATH, options.name))
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(5);

var _path2 = _interopRequireDefault(_path);

var _fsExtra = __webpack_require__(2);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _inquirer = __webpack_require__(3);

var _inquirer2 = _interopRequireDefault(_inquirer);

var _inquirerCheckboxAutocompletePrompt = __webpack_require__(14);

var _inquirerCheckboxAutocompletePrompt2 = _interopRequireDefault(_inquirerCheckboxAutocompletePrompt);

var _ora = __webpack_require__(4);

var _ora2 = _interopRequireDefault(_ora);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_inquirer2.default.registerPrompt('checkbox-autocomplete', _inquirerCheckboxAutocompletePrompt2.default);

exports.default = function (backup) {
  if (backup) {
    return removeBackup();
  }
  return removeSSHKey();
};

var removeSSHKey = function removeSSHKey() {
  return _inquirer2.default.prompt([{
    type: 'checkbox',
    name: 'host',
    message: 'Please select ssh key alias name ?',
    choices: _lodash2.default.map(_base.SSH_CONF, 'Host')
  }]).then(function (ret) {
    if (ret.host.length === 0) {
      console.log('\n    There are no options to delete!\n');
      throw new Error('There are no options to delete.');
    }
    console.log('');
    var spinner = (0, _ora2.default)('    Delete ssh-key for Host ...').start();
    var newSSHConf = _base.SSH_CONF;

    var _loop = function _loop(item) {
      var info = _lodash2.default.find(_base.SSH_CONF, function (o) {
        return o.Host === item;
      });
      var identityFile = (0, _base.toFullPath)(info.IdentityFile);
      _lodash2.default.remove(newSSHConf, function (o) {
        return o.Host === item;
      });
      _fsExtra2.default.existsSync(identityFile) && _fsExtra2.default.removeSync(identityFile);
      _fsExtra2.default.existsSync(identityFile + '.pub') && _fsExtra2.default.removeSync(identityFile + '.pub');
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = ret.host[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        _loop(item);
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

    (0, _base.saveSSHConf)(newSSHConf);
    setTimeout(function () {
      spinner.stop();
      console.log('\u2714    Delete ssh-key for Host successfully!\n');
    }, 500);
  }).catch(function (err) {
    process.exit(0);
  });
};

var removeBackup = function removeBackup() {
  var bakList = [];
  if (_fsExtra2.default.existsSync(_base.KSSH_PATH)) {
    bakList = _lodash2.default.filter(_fsExtra2.default.readdirSync(_base.KSSH_PATH), function (o) {
      return (/\.(zip|tar)$/.test(o)
      );
    });
  }
  if (bakList.length === 0) {
    console.log('\n    Useless to find any backup files.\n');
    return;
  }
  return _inquirer2.default.prompt([{
    type: 'checkbox-autocomplete',
    name: 'bakfile',
    message: 'Please select the backup file to delete :',
    choices: bakList,
    pageSize: 10
  }]).then(function (ret) {
    if (ret.bakfile.length === 0) {
      console.log('\n    There are no options to delete!\n');
      throw new Error('There are no options to delete.');
    }
    console.log('');
    var spinner = (0, _ora2.default)('    Delete Backup files ...').start();
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = ret.bakfile[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var item = _step2.value;

        var bakfile = _path2.default.resolve(_base.KSSH_PATH, item);
        _fsExtra2.default.existsSync(bakfile) && _fsExtra2.default.removeSync(bakfile);
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

    setTimeout(function () {
      spinner.stop();
      console.log('\u2714    Delete Backup files successfully!\n');
    }, 500);
  }).catch(function (err) {
    process.exit(0);
  });
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("inquirer-checkbox-autocomplete-prompt");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inquirer = __webpack_require__(3);

var _inquirer2 = _interopRequireDefault(_inquirer);

var _runscript = __webpack_require__(6);

var _runscript2 = _interopRequireDefault(_runscript);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var sshList = _lodash2.default.filter(_base.SSH_CONF, function (o) {
    return o.User !== 'git';
  });
  if (sshList.length === 0) {
    console.log('\n    Useless to find any ssh key files.\n');
    return;
  }
  return _inquirer2.default.prompt([{
    type: 'list',
    name: 'alias',
    message: 'Please select ssh key alias name ?',
    choices: _lodash2.default.map(sshList, 'Host')
  }]).then(function (ret) {
    var info = _lodash2.default.find(sshList, function (o) {
      return o.Host === ret.alias;
    });
    var remoteHost = info.User + '@' + info.HostName;
    if (info.Port && info.Port != 22) {
      remoteHost += ':' + info.Port;
    }
    var publicKey = (0, _base.toFullPath)(info.IdentityFile) + '.pub';
    if (process.env.OS === 'Windows_NT') {
      (0, _runscript2.default)('type ' + publicKey + ' | ssh ' + remoteHost + ' "cat >> .ssh/authorized_keys"');
    } else {
      (0, _runscript2.default)('ssh-copy-id -i ' + publicKey + ' ' + remoteHost);
    }
  });
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inquirer = __webpack_require__(3);

var _inquirer2 = _interopRequireDefault(_inquirer);

var _runscript = __webpack_require__(6);

var _runscript2 = _interopRequireDefault(_runscript);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var sshList = _lodash2.default.filter(_base.SSH_CONF, function (o) {
    return o.User !== 'git';
  });
  if (sshList.length === 0) {
    console.log('\n    Useless to find any ssh key files.\n');
    return;
  }
  return _inquirer2.default.prompt([{
    type: 'list',
    name: 'alias',
    message: 'Please select ssh key alias name ?',
    choices: _lodash2.default.map(sshList, 'Host')
  }]).then(function (ret) {
    (0, _runscript2.default)('ssh ' + ret.alias);
  });
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(5);

var _path2 = _interopRequireDefault(_path);

var _fsExtra = __webpack_require__(2);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _inquirer = __webpack_require__(3);

var _inquirer2 = _interopRequireDefault(_inquirer);

var _moment = __webpack_require__(18);

var _moment2 = _interopRequireDefault(_moment);

var _archiver = __webpack_require__(19);

var _archiver2 = _interopRequireDefault(_archiver);

var _bytes = __webpack_require__(20);

var _bytes2 = _interopRequireDefault(_bytes);

var _ora = __webpack_require__(4);

var _ora2 = _interopRequireDefault(_ora);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var options = null;
  var spinner = null;
  return _inquirer2.default.prompt([{
    type: 'input',
    name: 'bakfile',
    message: 'Please enter the backup file name :',
    default: (0, _moment2.default)().format('YYYY-MM-DD@HHmmss'),
    validate: validFileName
  }]).then(function (ret) {
    var suffix = _lodash2.default.has(_base.KSSH_CONF, 'archiver.format') ? _base.KSSH_CONF.archiver.format : 'zip';
    var bakfile = _path2.default.resolve(_base.KSSH_PATH, ret.bakfile + '.' + suffix);
    options = { bakfile: bakfile };
    if (_fsExtra2.default.existsSync(bakfile)) {
      return _inquirer2.default.prompt([{
        type: 'confirm',
        name: 'overwrite',
        message: 'File already exists, is it overwritten :',
        default: false
      }]);
    }
    return { overwrite: true };
  }).then(function (ret) {
    if (!ret.overwrite) {
      console.log('\n    The user automatically cancels the backup operation.\n');
      throw new Error('The user automatically cancels the backup operation.');
    }
    console.log('');
    spinner = (0, _ora2.default)('    Backup ssh key for All ...').start();
    return backup(options.bakfile);
  }).then(function (archiveSize) {
    setTimeout(function () {
      spinner.stop();
      console.log('✔   Backup ssh key for All, Archiver wrote %s !\n', (0, _bytes2.default)(archiveSize));
    }, 500);
  }).catch(function (err) {
    process.exit(0);
  });
};

var validFileName = function validFileName(value) {
  if (/(\s|\/|\\)+/.test(_lodash2.default.trim(value))) {
    return 'The file name is malformed !';
  }
  return true;
};

var backup = function backup(zipFile) {
  var sshList = _base.SSH_CONF;
  var files = [];
  pushFile(files, 'config');
  pushFile(files, 'known_hosts');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sshList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      var identityFile = _path2.default.basename(item.IdentityFile);
      pushFile(files, identityFile);
      pushFile(files, identityFile + '.pub');
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

  var format = _lodash2.default.has(_base.KSSH_CONF, 'archiver.format') ? _base.KSSH_CONF.archiver.format : 'zip';
  var options = Object.assign({
    zlib: { level: 9 }
  }, _lodash2.default.has(_base.KSSH_CONF, 'archiver.options') ? _base.KSSH_CONF.archiver.options : null);
  return new Promise(function (resolve, reject) {
    var archive = (0, _archiver2.default)(format, options);
    var output = _fsExtra2.default.createWriteStream(zipFile);
    output.on('colse', function () {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    output.on('end', function () {
      console.log('Data has been drained');
    });
    archive.on('error', function (err) {
      reject(err);
    });
    archive.on('end', function () {
      var archiveSize = archive.pointer();
      resolve(archiveSize);
    });
    archive.pipe(output);
    appendArchive(files, archive);
    archive.finalize();
  });
};

var pushFile = function pushFile(files, fileName) {
  if (_fsExtra2.default.existsSync(_path2.default.resolve(_base.SSH_PATH, fileName))) {
    files.push({
      name: fileName, file: _path2.default.resolve(_base.SSH_PATH, fileName)
    });
  }
};

function appendArchive(files, archive) {
  files.map(function (item, i) {
    if (item.file) {
      archive.file(item.file, { name: item.name });
    } else if (item.directory) {
      archive.directory(item.directory.path, item.name);
      if (item.directory.files) {
        appendArchive(item.directory.files, archive);
      }
    }
  });
}

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("archiver");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("bytes");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(5);

var _path2 = _interopRequireDefault(_path);

var _fsExtra = __webpack_require__(2);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _inquirer = __webpack_require__(3);

var _inquirer2 = _interopRequireDefault(_inquirer);

var _inquirerAutocompletePrompt = __webpack_require__(22);

var _inquirerAutocompletePrompt2 = _interopRequireDefault(_inquirerAutocompletePrompt);

var _fuzzy = __webpack_require__(23);

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _unzip = __webpack_require__(24);

var _unzip2 = _interopRequireDefault(_unzip);

var _ora = __webpack_require__(4);

var _ora2 = _interopRequireDefault(_ora);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _base = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_inquirer2.default.registerPrompt('autocomplete', _inquirerAutocompletePrompt2.default);

exports.default = function () {
  var bakList = [];
  if (_fsExtra2.default.existsSync(_base.KSSH_PATH)) {
    bakList = _lodash2.default.filter(_fsExtra2.default.readdirSync(_base.KSSH_PATH), function (o) {
      return (/\.(zip|tar)$/.test(o)
      );
    });
  }
  if (bakList.length === 0) {
    console.log('\n    Useless to find any backup files.\n');
    return;
  }
  return _inquirer2.default.prompt([{
    type: 'autocomplete',
    name: 'bakfile',
    message: 'Choose a backup file to restore :',
    source: searchFood,
    pageSize: 10
  }]).then(function (ret) {
    console.log('');
    var spinner = (0, _ora2.default)('    Restore Backup file ' + ret.bakfile + ' ...').start();
    _fsExtra2.default.existsSync(_path2.default.resolve(_base.KSSH_PATH, ret.bakfile)) && _fsExtra2.default.createReadStream(_path2.default.resolve(_base.KSSH_PATH, ret.bakfile)).pipe(_unzip2.default.Extract({ path: _base.SSH_PATH }));
    setTimeout(function () {
      spinner.stop();
      console.log('\u2714    Restore Backup file ' + ret.bakfile + ' successfully!\n');
    }, 500);
  });

  function searchFood(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = _fuzzy2.default.filter(input, bakList);
        resolve(fuzzyResult.map(function (el) {
          return el.original;
        }));
      }, _lodash2.default.random(30, 500));
    });
  }
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("inquirer-autocomplete-prompt");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("fuzzy");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("unzip");

/***/ })
/******/ ]);
//# sourceMappingURL=main.map