const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


    
router.post('/users/login/police', async (req, res) => {
    console.log(req.body)
    //if(user.role !== 'police') return res.status(401).send('Unauthorized') 
    
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })

    } catch (e) {
        res.status(400).send()
    }

})

router.post('/users/logout/:role', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        req.status(500).send()
    }
})
