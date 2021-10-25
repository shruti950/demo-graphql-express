var moment = require('moment'); // require
const bcrypt = require("bcrypt")
const Event = require('../../models/event')
const Admin = require('../../models/admin')

const eventPopulate =  eventId => {
  return  Event.find({_id:{$in : eventId}}).then(async events=>{
              return  events;
  }).catch(error=>{
        throw error;
  })
}
console.log("date",{date:moment("2021-10-25T10:44:39.954+05:30").format()} );

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
                    console.log("%c 🕶️: event ", "font-size:16px;background-color:#0a96f5;color:white;", event)
                    event.date =new Date(event.date).toISOString()
                    console.log("%c 🇰🇭: event.date ", "font-size:16px;background-color:#45f7a6;color:black;", event.date)
                    return event
              //   return { ...event._doc ,creator:admin.bind(this,event._doc.creator)};
              });
            }).catch(error=>error); 
  },
  createEvent:(args)=>{
              const  event={
                    name:args.eventInput.name,
                    age:args.eventInput.age,
                    date:new Date().toISOString(),
                    creator:"6172a33b192eb094873e1085"
              };
              let createEvent;
              return new Event(event).save().then(event=>{
                    createEvent = event;
                    return Admin.findById("6172a33b192eb094873e1085")
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
  }
}

