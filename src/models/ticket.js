const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
        title:{
            type: String,
            required: true,
            trim: true
        },
  
        description:{
           type: String,
           trim: true
    
        },
        status:{
            type: String,
            default: "open"
        },
        creator:{
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
    
    messages: [{
        sender: {
            type: String
        },
        message: {
            type: String
        },
        created: {
            type: Date,
            default: Date.now
        }
    }],
},{

        timestamps:true
    })

const Ticket = mongoose.model('Ticket', ticketSchema)
module.exports = Ticket
