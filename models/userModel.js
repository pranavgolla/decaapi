const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile:{type:String,required:true},
    password: { type: String },
    otp: { type: String },
    otpExpires: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
