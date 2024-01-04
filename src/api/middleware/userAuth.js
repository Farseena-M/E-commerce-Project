const jwt = require('jsonwebtoken');
const user = require('../model/userSchema');
const customError = require('../utils/customError');

const verifyToken = async(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        res.status(404).json({
            status:'Failed',
            message:'No token provided'
        })
    }
    const token = authHeader.split(' ')[1];

    /* jwt.verify(token,process.env.SECRET_STR,(err,decode)=>{
     if(err){
        res.status(401).json({
            status:'error',
            error:'unauthorized'
        })
     }
     req.email = decode.email
     next()
    }) */

    if(!token){
        const error = new customError('You are not loggedIn')
        next(error)
    }


    const decodeToken = await jwt.verify(token,process.env.SECRET_STR)
    console.log(decodeToken);
    const userId = decodeToken.id
    const checkUser = await user.findById(userId)
    if(!checkUser){
        const error= new customError ('User does not exist')
        next(error)
    }
    next()
}


module.exports = verifyToken