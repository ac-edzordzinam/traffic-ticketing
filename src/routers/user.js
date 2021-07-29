const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp =  require('sharp')
const jwt = require('jsonwebtoken')
const router = new express.Router()


router.post('/users', async (req, res) => {
  
    console.log(req.query)
    res.send(req.body)
    const user = new User(req.body)
    // console.log(req.body)

    try {
    //     //console.log('kakaka')
        const token = await user.generateAuthToken()
        await user.save({ user, token })
            console.log(token)
        res.status(201).send(user)
    } catch (e) {
        console.error(e.message)
        res.status(400).send(e.message)
    }

})

router.post('/users/login', async (req, res) => {
    
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
    //console.log(tokens) 
        
        res.send( {user, token})
        await user.save()

    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        console.log(req.header)
        await req.user.save()
        res.send()
    } catch (e) {
        req.status(500).send()
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        console.log(req.user.tokens)
        await req.user.save()
        res.send()
    } catch (e) {
        req.status(500).send()
    }
})
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined,true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) =>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    //req.user.avatar = req.file.buffer
  await req.user.save()
    res.send()
}, (error,req,res,next) => {
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar=undefined
    await req.user.save()
    res.send()
    
})
router.get('/users/:id/avatar',async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user||!user.avatar) {
            throw new Error()

        }
        res.set('Content-Type','image/png ')
        res.send(user.avatar)
    }catch (e){
            res.status(404).send()
    }
})

module.exports = router