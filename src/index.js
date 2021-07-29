const app =require('./app')
const express = require('express')
const port = process.env.PORT || 3000
const userRouter = require('./routers/user')
const ticketRouter = require('./routers/ticket')


app.use(express.json())
app.use(userRouter)
app.use(ticketRouter)

app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})
