const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema ({
  name : {
    type : String,
    required : true
  },
  age : {
    type : Number,
    required : true
  },
  date : {
    type : Date
  },
  creator : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Admin"
  }
})

module.exports = mongoose.model("Event",eventSchema)