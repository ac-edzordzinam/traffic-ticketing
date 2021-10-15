const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../../src/models/user')
const Ticket = require('../../../src/models/ticket')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@yahooh.com',
    password: '56what!!',
    role:'driver',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: 'myhouse099@@',
    role:'police',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const TicketOne = {
    _id: new mongoose.Types.ObjectId(),
    title:'Speeding',
    description: 'First Ticket',
    status: "close",
    creator: userOne._id
}

const TicketTwo = {
    _id: new mongoose.Types.ObjectId(),
    title:'DUI',
    description: 'Second Ticket',
    status: "open",
    creator: userOne._id
}

const TicketThree = {
    _id: new mongoose.Types.ObjectId(),
    title:'DUI',
    description: 'Third Ticket',
    status: "open",
    creator: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Ticket.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Ticket(TicketOne).save()
    await new Ticket(TicketTwo).save()
    await new Ticket(TicketThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    TicketOne,
    TicketTwo,
    TicketThree,
    setupDatabase
}