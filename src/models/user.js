const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Ticket = require('./ticket')




const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    email:{
        type : String,
        unique : true,   
        required: true,
        trim:true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type : String,
        required: true,
        minlength: 7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain password')
            }

        }
    },
    carNumber:{
        type:String,
        unique : true,   
        required: true
    },
    tokens : [{
        token:{
            type:String,
            required : true
        }
    }],
    avatar:{
        type:Buffer
    },
   role:{
       type:String,
       required:true

   }

},{
    timestamps: true 
})

 userSchema.virtual('tickets',{
     ref:'Ticket',
     localField:'_id',
     foreignField:'creator'
 },
 {
    ref:'User',
    localField:'reciever',
    foreignField:'carNumber' 
 }
 )
//  userSchema.virtual('carNumber').get(function()



userSchema.methods.toJSON  =  function (){
    const user = this
    const userObject = user.toObject()

        delete userObject.password
        delete userObject.tokens
        delete userObject.avatar

    return userObject
}



userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString() },process.env.JWT_SECRET)
   console.log(user.tokens)
   user.tokens = user.tokens.concat({token:token})
   console.log(user.tokens)
       await user.save()
   
    return token 
}
userSchema.statics.findByCredentials = async (email,password) => {
const user = await User.findOne({ email})

    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }   
    return user
}


//hash plain text passwords before saving
userSchema.pre('save',async function(next) {
  const user = this
  
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
  next()
})
// Delete user tasks when user is removed
userSchema.pre('remove',async function (next){
    const user = this
    
await Ticket.deleteMany({creator:user._id})
    next()
})
const User = mongoose.model('User',userSchema)
module.exports = User



