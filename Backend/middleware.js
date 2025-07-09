const {JWT_SECRET} = require('./config')
const jwt = require('jsonwebtoken')

const middleware = (req,res,next)=> {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        req.status(403).json({
            message: "enwoignwoinenewoifwn"
        })
    }

    const token = authHeader.split('')[1]

    try{
        const decoded = jwt.verify(token, JWT_SECRET)
        if(decoded.userID){
            req.userId = decoded.userId
            next();
        }else{
            return res.status(403).json({
            message: "wernwiornqoir"
        })
        }
    } catch(err){
        return res.status(403).json({
            message: "ltj4oitnot"
        })
    }

} 

module.exports = {
    middleware
}