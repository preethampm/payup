const express = require("express");
const app = express();
const Account = require('../db')
const { middleware } = require('../middleware');
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", middleware, async(req, res) => {
    const account = await Account.findOne({
        userId: req.useId
    })

    res.status(200).json({
        balance : account.balance
    })
});

router.post("/transfer", middleware, async(req, res) => {
    const session = await mongoose.startSession

    session.startTransaction();

    const {amount, to} = req.body

    const account = await Account.findOne({
        userId : req.useId 
    }).session(session);

      if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
})

module.exports = {
    router
}
