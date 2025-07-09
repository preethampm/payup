const express = require('express'); 
const { router: userRouter } = require('./User');        
const { router: accountRouter } = require('./Account');  
const app = express();
const router = express.Router();

router.use("/user", userRouter)

router.use("/account", accountRouter)

module.exports = {
    router
}