
/**
 * Module dependencies.
 */

var express = require('express');
var postmark = require("postmark")("a74fec21-8222-49e9-a896-641942e4177a");
var app = express();

require( './db' );

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/create', routes.create);
app.get('/create', routes.create);
app.get('/destroy/:id', routes.destroy);
app.get('/markdelivery/:id', routes.markdelivery);
app.get('/sendremindertobringer/', routes.sendremindertobringer);
app.get('/sendremindertoemployees/', routes.sendremindertoemployees);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
