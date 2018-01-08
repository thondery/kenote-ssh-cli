
const assert = require('assert')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
const path = require('path')
const pkg = require('../package.json')

const binPath = path.resolve(__dirname, '../bin/index.js')

describe('Usage Testing: ', () => {

  describe('\n    Command -> help \n', () => {

    it('should usage --help', function (done) {
      run(null, ['--help'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        done()
      })
    })

    it('should usage -h', function (done) {
      run(null, ['-h'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        done()
      })
    })
  })

  describe('\n    Command -> version \n', () => {

    it('should usage --version', function (done) {
      run(null, ['--version'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        assert.equal(stdout, `${pkg.version}\n`)
        done()
      })
    })

    it('should usage -V', function (done) {
      run(null, ['-V'], function (err, stdout) {
        if (err) return done(err)
        assert.equal(err, null)
        assert.equal(stdout, `${pkg.version}\n`)
        done()
      })
    })
  })

})

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