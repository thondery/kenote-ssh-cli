# kenote-ssh-cli

own ssh command line tools ...

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Codecov Status][codecov-image]][codecov-url]
[![Gratipay][licensed-image]][licensed-url]

[npm-image]: https://img.shields.io/npm/v/kenote-ssh-cli.svg
[npm-url]: https://www.npmjs.org/package/kenote-ssh-cli
[downloads-image]: https://img.shields.io/npm/dt/kenote-ssh-cli.svg
[downloads-url]: https://npmjs.org/package/kenote-ssh-cli
[travis-image]: https://travis-ci.org/thondery/kenote-ssh-cli.svg?branch=master
[travis-url]: https://travis-ci.org/thondery/kenote-ssh-cli
[codecov-image]: https://img.shields.io/codecov/c/github/thondery/kenote-ssh-cli/master.svg
[codecov-url]:   https://codecov.io/github/thondery/kenote-ssh-cli?branch=master
[dependencies-image]: https://david-dm.org/thondery/kenote-ssh-cli/status.svg
[dependencies-url]: https://david-dm.org/thondery/kenote-ssh-cli
[licensed-image]: https://img.shields.io/badge/license-MIT-blue.svg
[licensed-url]: https://github.com/thondery/kenote-ssh-cli/blob/master/LICENSE

## Install

```bash
$ npm i -g kenote-ssh-cli
```

## Features

- list|ls, Show ssh key list
- create|add, Create a new SSH key
- remove|delete, Delete specific SSH key by alias name
- upload|up, Upload SSH key to the server
- connect|link, Connect to the server
- backup|bak, Backup SSH key
- restore|unbak, Restore SSH key


```bash
$ kssh

  Usage: kssh [command] [options]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    list|ls                Show ssh key list
    create|add             Create a new SSH key
    remove|delete          Delete specific SSH key by alias name
    upload|up              Upload SSH key to the server
    connect|link           Connect to the server
    backup|bak [options]   Backup SSH key ...
    restore|unbak          Restore SSH key ...
```

## License

this repo is released under the [MIT License](https://github.com/thondery/kenote-ssh-cli/blob/master/LICENSE).