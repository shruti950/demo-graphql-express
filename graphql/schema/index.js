const { buildSchema } = require('graphql');

module.exports=  buildSchema(`
      type Event{
            _id:ID!
            name:String!
            age:Int!
            date:String
            creator:Admin!
      }
      type Admin{
            _id:ID!
            email:String!
            password:String
            createdUser:[Event!]
      }
      input AdminInput{
            email:String!
            password:String!
      }
      input EventInput{
            name:String!
            age:Int!
      }
      type RootQuery {
            events:[Event!]!
      }
      type RootMutation {
            createEvent(eventInput:EventInput):Event
            createAdmin(adminInput:AdminInput):Admin
      }
      schema {
            query:RootQuery,
            mutation:RootMutation
      }`)
