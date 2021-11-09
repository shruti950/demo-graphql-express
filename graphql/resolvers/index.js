var moment = require('moment'); // require
const bcrypt = require("bcrypt")
const Event = require('../../models/event')
const Admin = require('../../models/admin')
const jwt = require('jsonwebtoken')
const eventPopulate =  eventId => {
  return  Event.find({_id:{$in : eventId}}).then(async events=>{
              return  events;
  }).catch(error=>{
        throw error;
  })
}

const adminPopulate = adminId => {
  return Admin.findById(adminId).then(async admins=>{
        let events = await eventPopulate(admins.createdUser)
        admins.createdUser = events
        return admins
  })
  .catch(error=>{
        throw error;
  })
}

module.exports={
  events:()=>{
        return Event.find().then(events => {
              return events.map(async event => {
                    event.date =  moment(event.date).format('DD/YY');
                    event.creator = await adminPopulate(event.creator);
                    event.date =new Date(event.date).toISOString()
                    return event
              //   return { ...event._doc ,creator:admin.bind(this,event._doc.creator)};
              });
            }).catch(error=>error); 
  },
  createEvent:(args,req)=>{
    if(!req.isAuth){
      throw new Error('Invalid token')
    }
    let userId = req.userId
    const  event={
          name:args.eventInput.name,
          age:args.eventInput.age,
          date:new Date().toISOString(),
          creator:req.userId
    };
    let createEvent;
    return new Event(event).save().then(event=>{
          createEvent = event;
          return Admin.findById(userId)
    }).then(admin=>{
          if(!admin){
                throw new Error("admin is not found")
          }
          admin.createdUser.push(createEvent);
          return admin.save()
    }).then(result=>{
          return event
    }).catch(error=>{
          throw error})
 
  },
  createAdmin:args=>{
        return Admin.findOne({email:args.adminInput.email}).then(email=>{
              if(email){
                    throw new Error("user already exists");
              }
              return bcrypt.hash(args.adminInput.password,12)
        })
       .then(hashedPassword=>{
              const admin={
                    email:args.adminInput.email,
                    password:hashedPassword
              }
              return new Admin(admin).save()
              .then(admin=>{
                    return admin;
              })
              .catch(error=>{
                    throw error;
              })
        })
  },
  login:({email,password})=>{
    let userFound;
    return Admin.findOne({email:email}).then(user=>{
      if(!user){
        throw new Error('User is not exists');
      }
      userFound = user
      return bcrypt.compare(password,user.password)
    }).then(passwordCheck=>{
      if(!passwordCheck){
        throw new Error('password is incorrect');
      }
      return jwt.sign({userId:userFound._id,email:userFound.email},'secretkey',{expiresIn: "1h"})
    }).then(token=>{
      if(!token){
        throw new Error('token invalid')
      }
      return {userId:userFound._id,token:token ,tokenExpiration:1}
    }).catch(error=>{
      throw error;
    })
  }
}

