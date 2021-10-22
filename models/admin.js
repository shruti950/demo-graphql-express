const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  createdUser : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Event"
    }
  ]
  
})

module.exports = mongoose.model("Admin",adminSchema)