var spawn = require('child_process').spawn;
// var pixelServerPath = require.resolve('phantomjs-pixel-server');
var pixelServerPath = __dirname + '/../lib/image-info-server/phantomjs/compose.js';
var request = require('request');
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
  before(function (done) {
    var that = this;
    this.gifData = '';
    var req = request({
      url: 'http://localhost:7050/image.gif'
    });
    req.on('error', function (err) {
      done(err);
    });
    req.on('response', function (res) {
      console.log('responded');
      res.on('data', function (buff) {
        that.gifData += buff;
      });
      that.gifRes = res;
      done();
    });
  });

  describe('writing a text frame', function () {
    before(function saveGifData () {
      this._beforeFrameData = this.gifData;
    });
    before(function writeNewFrame (done) {
      // TODO: Compare _beforeFrameData to gifData
      this.timeout(5000);
      request({
        url: 'http://localhost:7050/image/text',
        method: 'POST',
        form: {
          text: 'Hello'
        }
      }, function (err, res, body) {
        if (err) {
          return done(err);
        }
        // TODO: We should callback when we have written out the frame
        setTimeout(done, 1000);
      });
    });

    it('receives a new frame', function () {
      assert.notEqual(this._beforeFrameData, this.gifData);
    });

    describe('and closing the image', function () {
      // TODO: Close connection (writes footer),
      // [debug] write GIF to file
      // compare to expected GIF from disk
      it('creates a GIF image', function () {

      });
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
