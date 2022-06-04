const express = require('express')
const route = express.Router();
const replies = require('../models/repliesModel')
const doubtsmodel = require("../models/doubtsModel")
const users = require('../models/userModel')
const notifications = require("../models/notificationModel")


const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    secure: true,
    port: 465,
    auth: {
        user: "rahula.co18@nsut.ac.in",
        pass: "i am a boy"
    }
});


route.post('/upload_reply', (req, res) => {
    replies.create({
        code: req.body.code,
        content: req.body.content,
        doubt: req.body.doubtid,
        user: req.body.userid,
        upvotes: 0,
        username: req.body.username,
        date: new Date(),
        dp: req.body.dpimage
    },
        ((err, reply) => {
            if (err) { return res.send({ err: err, status: false }) }
            else {
                let repliesarr = req.body.repliesarr
                repliesarr.push(reply._id)
                doubtsmodel.updateOne({ _id: req.body.doubtid }, { $set: { replies: repliesarr, num_of_replies: repliesarr.length } }, (err, result2) => {
                    if (err) { return res.send({ err: err, status: false }); }
                    else {
                        let user_replies = req.body.user_replies;
                        user_replies.push(reply._id);
                        users.updateOne({ _id: req.body.userid }, { $set: { replies: user_replies } }, (err, result3) => {
                            if (err) { return res.send({ err: err, status: false }) }
                            else {
                                users.findOne({ _id: req.body.doubt.user }, (err, user) => {
                                    let Maildetails = {
                                        from: 'resolveteam4@gmail.com',
                                        to: user.email,
                                        subject: "Reply on your doubt",
                                        text: `Greetings ${user.firstName} ${user.lastName} from team RESOLVE
                                        Somebody replied on your doubt:${req.body.doubt.title}
                                        Click on this link to view:https://resolve4.herokuapp.com/doubts/${req.body.doubtid}`
                                    }
                                    notifications.create({
                                        owner: req.body.userid,
                                        initiator: req.body.userid,
                                        owner_username: req.body.username,
                                        initiator_username: req.body.username,
                                        seen: false,
                                        date: new Date(),
                                        doubt: req.body.doubtid,
                                        doubt_title: req.body.doubt.title.substring(0, 9) + '...',
                                        type: "reply created"
                                    }, ((err, notification) => {
                                        transporter.sendMail(Maildetails, (err, info) => {
                                            if (err) { return res.send({ status: true, reply: reply._id, notification: notification }); }
                                            else { return res.send({ reply: reply._id, status: true, notification: notification }) }
                                        })
                                    }))
                                })
                            }
                        })
                    }
                })
            }
        })
    )
})


route.post('/getrepliesofdoubt', (req, res) => {
    replies.find({ _id: { $in: req.body.ids } }, ((err, result) => {
        if (err) { return res.send({ status: false, error: err }) }
        else {
            return res.send({ status: true, reply: result })
        }
    })
    )
})

route.post('/upvote', (req, res) => {
    let upvotedusersarr = req.body.upvotedusers
    upvotedusersarr.push(req.body.userid)
    replies.updateOne({ _id: req.body._id }, { $set: { upvotes: req.body.upvotes + 1, upvotedusers: upvotedusersarr } }, (err, result2) => {
        if (err) { return res.send({ err: err, status: false }); }
        else {
            users.findOne({ _id: req.body.writer }, (err, ownuser) => {
                if (err) { return res.send({ err: false, err: err }) }
                else {
                    users.updateOne({ _id: req.body.writer }, { $set: { points: ownuser.points + 1 } }, (err, finalresult) => {
                        if (err) { return res.send({ err: err, status: false }) }
                        else {
                            notifications.create({
                                owner: req.body.replyuser,
                                initiator: req.body.userid,
                                owner_username: req.body.username,
                                initiator_username: req.body.username,
                                seen: false,
                                date: new Date(),
                                doubt: req.body.doubtid,
                                doubt_title: req.body.doubttitle.substring(0, 9) + '...',
                                type: "upvoted"
                            }, ((err, notification) => {
                                return res.send({ status: true, notification: notification })
                            }))
                        }
                    })
                }
            })
        }
    })
})
route.post('/downvote', (req, res) => {
    let upvotedusersarr = req.body.upvotedusers.filter((item) => {
        return (item !== req.body.userid)
    })
    replies.updateOne({ _id: req.body._id }, { $set: { upvotes: req.body.upvotes - 1, upvotedusers: upvotedusersarr } }, (err, result2) => {
        if (err) { return res.send({ err: err, status: false }); }
        else {
            users.findOne({ _id: req.body.writer }, (err, ownuser) => {
                if (err) { return res.send({ status: false, err: err }) }
                else {
                    users.updateOne({ _id: req.body.writer }, { $set: { points: ownuser.points - 1 } }, (err, finalresult) => {
                        if (err) { return res.send({ err: err, status: false }) }
                        else {
                            notifications.create({
                                owner: req.body.replyuser,
                                initiator: req.body.userid,
                                owner_username: req.body.username,
                                initiator_username: req.body.username,
                                seen: false,
                                date: new Date(),
                                doubt: req.body.doubtid,
                                doubt_title: req.body.doubttitle.substring(0, 9) + '...',
                                type: "downvoted"
                            }, ((err, notification) => {
                                return res.send({ status: true, notification: notification })
                            }))
                        }
                    })
                }
            })
        }
    })
})
module = module.exports = route