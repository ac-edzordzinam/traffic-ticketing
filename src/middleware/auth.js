const jwt = require('jsonwebtoken')
const User = require('../models/user')
 


const auth = async (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", ""); //looks for the header
      const decoded = jwt.verify(token,process.env.JWT_SECRET); //validates the header
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      }); // finds the associated user
      if (!user) {
        throw new Error();
      }
      req.token = token;
      req.user = user;
      next();
    } catch (e) {
      console.log("error", e.message);
      res.status(401).send({ error: "please authenticate." });
    }
  };
  
  module.exports = auth;
  