var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose');
// const schema = require('./schema');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const Event = require('./models/event')
const bodyParser = require('body-parser');
const cors = require('cors');
// const { ApolloServer } = require('apollo-server-express');
const url = "mongodb://localhost:27017/events";
const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then((db) => {
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
}, (err) => {
      console.log(err);
});
// const server = new ApolloServer({
//       typeDefs: schema.typeDefs,
//       resolvers: schema.resolvers
// });

var app = express();
const events=[]
app.use('/graphql',graphqlHTTP({
schema:buildSchema(`
      type Event{
            _id:ID!
            name:String!
            age:Int!
            date:String
      }
      input EventInput{
            name:String!
            age:Int!
            date:String
      }
      type RootQuery {
            events:[Event!]!
      }
      type RootMutation {
            createEvent(eventInput:EventInput):Event
      }
      schema {
            query:RootQuery,
            mutation:RootMutation
      }`),
      rootValue:{
            events:()=>{
                  return Event.find().then(event=>event).catch(error=>error); 
            },
            createEvent:(args)=>{
                  const event={
                        name:args.eventInput.name,
                        age:args.eventInput.age,
                        date:new Date(args.eventInput.date).toString()
                  }
                  
                 return new Event(event).save().then(event=>{
                       console.log("event",event);
                       return event;
                 }).catch(error=>{
                       console.log("error",error);
                 })
            }
      },
      graphiql:true
      
}))
// app.listen(4000);
// view engine setup
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