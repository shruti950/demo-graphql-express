var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const { validate, ValidationError, Joi } = require('express-validation')
const graphQlSchema = require ('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolvers/index')
const isAuth = require('./middlewares/auth')
const url = "mongodb://localhost:27017/events";
const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then((db) => {
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
}, (err) => {
      console.log(err);
});
var app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth)
app.use('/graphql',graphqlHTTP({
      schema:graphQlSchema,
      rootValue:graphQlResolver,
      graphiql:true
      
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
      if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
      }
    
      return res.status(500).json(err)
    })
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