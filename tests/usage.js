
const assert = require('assert')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
const path = require('path')
const mocha = require('mocha')
const rimraf = require('rimraf')
const pkg = require('../package.json')

const binPath = path.resolve(__dirname, '../bin/index.js')
const tempDir = path.resolve(__dirname, '../temp')

describe('Usage Testing: ', () => {

  mocha.after(function (done) {
    this.timeout(30000)
    cleanup(tempDir, done)
  })

  describe('\n    Options \n', () => {

    it('should usage --help', function (done) {
      run(null, ['--help'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        done()
      })
    })

    it('should usage --version', function (done) {
      run(null, ['--version'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        assert.equal(stdout, `${pkg.version}\n`)
        done()
      })
    })
  })

  describe('\n    Command -> init \n', () => {

    it('should usage init', function (done) {
      run(null, ['init -p temp'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        done()
      })
    })
  })

  describe('\n    Command -> list \n', () => {

    it('should usage list', function (done) {
      run(null, ['ls'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        done()
      })
    })

    it('should usage list --git', function (done) {
      run(null, ['ls -g'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        done()
      })
    })

    it('should usage list --ignore', function (done) {
      run(null, ['ls -i'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        done()
      })
    })
  })

})

function cleanup(dir, callback) {
  if (typeof dir === 'function') {
    callback = dir
    dir = tempDir
  }
  callback(null)
  /*rimraf(tempDir, function (err) {
    callback(err)
  })*/
}

function run(dir, args, callback) {
  var argv = [binPath].concat(args)
  var exec = process.argv[0]
  var stderr = ''
  var stdout = ''

  var child = spawn(exec, argv, {
    cwd: dir
  })

  child.stdout.setEncoding('utf8')
  child.stdout.on('data', function ondata(str) {
    stdout += str
  })
  /*child.stderr.setEncoding('utf8')
  child.stderr.on('data', function ondata(str) {
    process.stderr.write(str)
    stderr += str
  });*/

  child.on('close', onclose)
  child.on('error', callback)

  function onclose(code) {
    var err = null

    try {
      assert.equal(stderr, '')
      assert.strictEqual(code, 0)
    } catch (e) {
      err = e
    }

    callback(err, stdout.replace(/\x1b\[(\d+)m/g, '_color_$1_'))
  }
}