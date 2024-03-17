const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    username : {
        type : String
    },

    email : {
        type : String
    },

    password : {
        type : String
    }
})

const Register = new mongoose.model("Register" , CustomerSchema);
module.exports=Register;