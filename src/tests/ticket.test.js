const request = require('supertest')
const app = require('../app')
const Ticket = require('../models/ticket')

const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    ticketOne,
    ticketTwo,
    ticketThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create ticket for user', async () => {
    const response = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const ticket = await Ticket.findById(response.body._id)
    expect(ticket).not.toBeNull()
    expect(ticket.completed).toEqual(false)
})
test('Should fetch user tickets', async () => {
    const response = await request(app)
        .get('/tickets')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not delete other users tickets', async () => {
    const response = await request(app)
        .delete(`/tickets/${ticketOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const ticket = await Ticket.findById(ticketOne._id)
    expect(ticket).not.toBeNull()
})
