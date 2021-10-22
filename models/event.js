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
  }
})

module.exports = mongoose.model("Event",eventSchema)