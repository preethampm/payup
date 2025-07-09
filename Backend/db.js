const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/paytm')
  .then(() => console.log('Connected!'))
  .catch((err) => console.log("Error ------", err));

  const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    firstName : {
      type: String,
      required : true,
      trim: true,
    },
    lastName : {
      type: String,
      required : true,
      trim: true,
    }
  })

  const User = mongoose.model('User', userSchema);

  const accountSchema = new mongoose.Schema({
    userId : {
      type: mongoose.Schema.Types.ObjectId, //this is how you type objectid
      required: true,
      ref : User//reference
    },
    balance : {
      type: Number,
      required : true
    }
  })

  
  const Account = mongoose.model('Account', accountSchema);
  module.exports= {
    User, Account
  };