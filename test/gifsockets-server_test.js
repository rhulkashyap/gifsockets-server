var spawn = require('child_process').spawn;
var pixelServerPath = require.resolve('phantomjs-pixel-server');
var GifsocketsServer = require('../');

before(function startPhantomPixelServer (done) {
  this._phantomServer = spawn('phantomjs', [pixelServerPath], {stdio: [0, 1, 2]});
  setTimeout(done, 1000);
});
before(function (done) {
  this.server = new GifsocketsServer();
  this.server.listen(7050);
  setTimeout(function () {
    done();
  }, 100);
});
after(function (done) {
  this.server.destroy(function (err) {
    done();
  });
});
after(function (done) {
  this._phantomServer.kill();
  this._phantomServer.on('exit', function (code, signal) {
    done();
  });
});

describe('A request to a gifsockets-server', function () {
  // TODO: We need to build a way to close open connections (e.g. POST endpoint)

  describe('writing a text frame', function () {
    it('receives a new frame', function () {

    });
  });

  describe('writing a raw frame', function () {
    it('receives a new frame', function () {

    });
  });
});

describe('A request to a gifsockets-server', function () {
  describe('writing a first frame', function () {
    describe('and a second frame', function () {
      it('receives both frames', function () {

      });
    });
  });
});
