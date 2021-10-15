const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const sendWelcomeEmail = (email,name)=>{
        sgMail.send({
            to:email,
            from: 'anaglateafua@gmail.com',
            subject: 'Welcome to me! Thanks for joining in',
            text: 'Welcome to the app,'+name+'.Let me know how you get along with the app!' 
        })
    }
    const sendCancelEmail = (email,name)=>{
        sgMail.send({
            to:email,
            from: 'anaglateafua@gmail.com',
            subject: 'Delete Account Confirmation!',
            text: 'Welcome to the app,'+name+'.Let me know how you get along with the app!' 
        })
    }
    const sendTicketReferenceEmail = (email,name,car,_id)=>{
        sgMail.send({
            to:email,
            from: 'anaglateafua@gmail.com',
            subject: 'Ticket Reference Payment!',
            text: 'Welcome to Online traffic Ticketing, <p>'+name+' with car number '+car+'.Your ticket ID is, '+_id+'. </p>PLease use it as a reference for any online payment of this ticket!' 
        })
    }
    module.exports = {
        sendWelcomeEmail,
        sendCancelEmail,
        sendTicketReferenceEmail
    }
    
    // sgMail.send({
    //     to:'anaglateafua@gmail.com',
    //     from: 'anaglateafua@gmail.com',
    //     subject: 'this is it!',
    //     text: 'I hope this is fine.'
    // }).then((d)=>{
    //     console.log(d)
    // }).catch((e)=>{
    //     console.log(e.response.body)
   // })
   