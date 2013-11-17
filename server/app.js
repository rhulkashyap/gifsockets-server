var express = require('express');

var routes = require('./routes');

function GifServer(port) {
  // Keep track of array of connections
  var firstConnections = [];
  var secondConnections = [];

  // Start a server that runs on jade
  var app = express();

  // Host static files
  app.use('/public', express['static'](__dirname + '/../public'));

  // Set up connections for server logic
  app.use(function saveConnections (req, res, next) {
    req.firstConnections = firstConnections;
    req.secondConnections = secondConnections;
    next();
  });

  // Host homepage
  app.get('/', routes.index);

  // Server logic
  app.get('/image.gif', routes.openImage);
  app.post('/image/text', routes.writeTextToImage);
  app.post('/image/raw', routes.writeRawToImage);
  app.post('/image/close', function (req, res) {
    // Write footer
    // TODO: Can we close out first connections?
    // TODO: We should be using GifEncoder.finish
    req.secondConnections.forEach(function (conn) {
      conn.res.end('0x3b');
    });

    // Clean up connections
    req.secondConnections.splice(0, req.secondConnections.length);

    // Close the request
    res.send(204);
  });

  // Host 404 page
  app.all('*', routes[404]);

  // Save app for later
  this.app = app;
}
GifServer.prototype = {
  listen: function (port) {
    // Listen and notify the outside world
    this._app = this.app.listen(port);
    console.log('gifsockets server is listening at http://127.0.0.1:' + port + '/');
  },
  destroy: function (cb) {
    this._app.close(cb || function () {});
  }
};

module.exports = GifServer;
