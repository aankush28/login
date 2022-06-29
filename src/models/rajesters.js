const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,

    },
    age: {
        type: Number,
        required: true

    },
    password: {
        type: String,
        required: true

    },
    confirmPassword: {
        type: String,
        required: true

    },
    tokens :[{
        token :{
            type: String,
        required: true
        }
    }]
})


userSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
      
    } catch (e) { 
        res.send(`something is error ${token}`)
        console.log(`something is error ${token}`);
    }
}


/* userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {

        //const passwordHash = await bcrypt.hash(password, 10);
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this.password, 10)
    } 
   next() ;
}) */
const User = new mongoose.model('User', userSchema);
module.exports = User;