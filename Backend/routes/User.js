const express = require("express");
const z = require('zod');
const app = express();
const router = express.Router();
const userModel = require('../db')
const jwt = require('jsonwebtoken') 
const JWT_SECRET = require('../config'); 
const { middleware } = require("../middleware");
const bcrypt = require('bcryptjs')
const accountModel = require('../db');

const signupSchema = z.object({
    firstName : z.string(),
    lastName : z.string(),
    username : z.string(),
    email : z.string().email(),
    password : z.string()
})

const signinSchema = z.object({
    email : z.string().email(),
    password : z.string()
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.post("/signup", async (req, res) => {
    const body = req.body
    const {success} = signupSchema.safeParse(req.body)
    if (!success){
        res.status(411).json({
            message : "Incorrect inputs /  Email is alread taken"
        })
    }
    const existingUser = userModel.findOne({
        username : body.username
    })

    if (existingUser) {
        res.json({
            message : "ncorrect inputs /  Email is alread taken"
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.password, salt)

    const dbUser = await userModel.create({
        firstName: body.firstName,
        lastName : body.lastName,
        username : body.username,
        email: body.email,
        password : hash
    });

    await accountModel.create({
        userId,
        balance : 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId : dbUser._id
    }, JWT_SECRET)

    res.status(200).json({
        message: "Token created",
        token : token
    })

});

router.post("/signin", async (req, res) => {
    const body = req.body
    const { success} = signinSchema.safeParse(body)
    if (!success) {
        res.status(411).json({
            message: "Invalid credentials"
        })
    }
    const user = await userModel.find({
        username : body.username,
        email : body.email
    })

    if(user){
        const token = jwt.sign({
            userId : user._id
        }, JWT_SECRET)

        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })

})

router.put("/update", middleware, async(req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if(!success) {
        res.status(411).json({
            message : "Error while updating..."
        })
    }
    let updateData = {...req.body}
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    await userModel.updateOne({
        _id: req.userId
    }, updateData)
})

router.get("/profile", middleware, async(req, res) => {
    const filter = req.query.filter || ""
    const users = await userModel.findOne({
        $or: [
            {firstName: {"$regex":filter}},
            {lastName: {"$regex": filter}}
        ]
    })
    res.status(200).json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = {
    router
}