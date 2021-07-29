const express = require('express')
const Ticket = require('../models/ticket')
const auth = require('../middleware/auth')
const router = new express.Router()

//Create ticket
router.post('/tickets',auth,async(req,res)=>{
    console.log(req.body)
   // if(user.role !== 'police') return res.status(401).send('Unauthorized') 
    const ticket =new Ticket({
          ...req.body,
        creator:req.user._id
     })
   
    try{
    
         await ticket.save()
         res.status(201).send(ticket)
    }catch(e){
        res.status(400).send(e)

    }
    
    })
//GET /tasks?completed=true
//limit skip?limit=10&skip=10
//GET /tasks?sortBy=createdAt:desc

//Search/ Read through tickets
    router.get('/tickets',auth,async(req,res)=>{ 
      const match = {} 
      const sort = {}
      if (req.query.completed) {
          match.completed = req.query.completed === 'true'
      }

        if (req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? 1 : -1

        }


       try{
             
               await req.user.populate({
                   path:'tickets',
                   match,
                   options:{
                       limit: parseInt(req.query.limit),
                       skip: parseInt(req.query.skip),
                       sort 

                   }


               }).execPopulate() 
            
             res.send(req.user.tickets)
       }catch(e){
            res.status(500).send(e)
       }
      
    })

//Search/ Read a single ticket
    router.get('/tickets/:id',auth,async(req,res)=>{
        const _id= req.params.id
        try {
            
            const ticket = await Ticket.findOne({_id,creator:req.user._id})
             if (!ticket){
                 res.status(404).send()
                }
            res.send(ticket)
        }catch(e){
            res.status(500).send(e)
        }
       
    }) 
    // Update ticket
    router.patch('/tickets/:id',auth, async(req,res)=>{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['title','description','status']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
       
       if(!isValidOperation)
       {
           return res.status(400).send({error: 'Invalid Updates!'})
       }
       
       
        try{ 
            const ticket = await Ticket.findOne({_id: req.params.id, owner: req.user._id})
           
          
            if (!ticket){
                return res.status(404).send()
            }


            
             updates.forEach((update)=>ticket[update]= req.body[update])
            await ticket.save()
            
            res.send(ticket)
        }catch(e){
            res.status(400).send(e)
        }
    })


    //Delete tickets
    router.delete('/tickets/:id', async (req,res)=>{
        try{
            const ticket = await Ticket.findByIdAndDelete(req.params.id)
       
    if (!ticket) {
        return res.status(404).send()
    }
    
    res.send(ticket)
        }catch(e){
            res.status(500).send()
        }
    })



// ADMIN ROUTES//





// Admin update ticket
    router.patch('/tickets/admin/:id',async(req,res)=>{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['title','description','status']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
       
       if(!isValidOperation)
       {
           return res.status(400).send({error: 'Invalid Updates!'})
       }
       
       
        try{ 
            const ticket = await Ticket.findOne({_id: req.params.id})
           
          
            if (!ticket){
                return res.status(404).send()
            }


            
             updates.forEach((update)=>ticket[update]= req.body[update])
            await ticket.save()
            
            res.send(ticket)
        }catch(e){
            res.status(400).send(e)
            console.log(e)
        }
    })

    // Admin search/view all tickets
    router.get('/ticketts',async(req,res)=>{ 
        const match = {} 
        const sort = {}
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }
  
          if (req.query.sortBy){
              const parts = req.query.sortBy.split(':')
              sort[parts[0]] = parts[1] === 'desc' ? 1 : -1
  
          }
  
  
         try{
               
                //  await req.user.populate({
                //      path:'tickets',
                //      match,
                //      options:{
                //          limit: parseInt(req.query.limit),
                //          skip: parseInt(req.query.skip),
                //          sort 
                //      }
                //  }).execPopulate() 
              const tickets = await Ticket.find().limit().skip(1).sort()
              

               res.send(tickets)
         }catch(e){
              res.status(500).send(e)
         }
        
      })
//Admin Search/ view a single ticket
router.get('/ticketts/:id',async(req,res)=>{
    const _id= req.params.id
    try {
        
        const ticket = await Ticket.findOne({_id})
         if (!ticket){
              
            }
        res.send(ticket)
    }catch(e){
        res.status(500).send(e)
    }
   
}) 



module.exports = router