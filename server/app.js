var express = require('express');
var Gifsocket = require('gifsockets');

var routes = require('./routes');

function GifServer(port) {
  // Create a new gifsocket for the app
  var gifsocket = new Gifsocket({
    // #GIFSOCKET-DIMENSIONS
    width: 600,
    height: 380
  });

  // Start a server that runs on jade
  var app = express();

  // Host static files
  app.use('/public', express['static'](__dirname + '/../public'));

  // Set up gifsocket for server logic
  app.use(function saveConnections (req, res, next) {
    req.gifsocket = gifsocket;
    next();
  });

  // Host homepage
  app.get('/', routes.index);

  // Server logic
  app.get('/image.gif', routes.openImage);
  app.post('/image/text', routes.writeTextToImage);
  app.post('/image/json', routes.writeJsonToImage);
  // TODO: Somehow assign each page an id and allow for closing via /close:id. See #5 comments
  // TODO: On server close, write out finish to all connections
  // TODO: On process close, close server
  app.post('/image/close', routes.closeImages);

  // Host 404 page
  app.all('*', routes[404]);

  // Save app for later
  this.app = app;
}
GifServer.prototype = {
  listen: function (port) {
    // Listen and notify the outside world
    this._app = this.app.listen(port);
    console.log('gifsockets-server is listening at http://127.0.0.1:' + port + '/');
  },
  destroy: function (cb) {
    this._app.close(cb || function () {});
  }
};

module.exports = GifServer;
