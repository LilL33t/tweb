var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ratingsRouter = require('./routes/ratings');
var recommendationsRouter = require('./routes/recommendations');
var statsRouter = require('./routes/stats');
var favsRouter = require('./routes/favs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Anime Gateway API',
            version: '1.0.0',
            description: 'API Gateway that aggregates data from SQL (Java) and NoSQL (Node)',
        },
        servers: [
            { url: 'http://localhost:3001', description: 'Gateway Server' }
        ],
    },
    apis: ['./public/javascripts/swaggerComponentsDefinition.js','./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// mount routes
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/favs', favsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
