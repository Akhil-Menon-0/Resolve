const express = require('express')
const route = express.Router();
const doubts = require('../models/doubtsModel')
const users = require('../models/userModel')
const tagsmodel = require('../models/tagModel')
const notifications = require("../models/notificationModel")
const path = require('path')


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


//////////////////<image saving setup>
const multer = require('multer')
const DIR = path.join(__dirname, "../doubtimages");
//////////////////</image saving setup>

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('_');
        cb(null, filename)
    }
})

const upload = multer({
    storage: storage
})

route.post('/upload_doubt', upload.single('image'), (req, res) => {
    let imagepath = "";
    if (req.file) { imagepath = '/doubtimages/' + req.file.filename; }
    doubts.create({
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        image: imagepath,
        code: req.body.code,
        user: (req.body.userid),
        views: 0,
        num_of_replies: 0,
        username: req.body.username,
        date: new Date(),
        dp: req.body.dpimage
    },
        ((err, doubt) => {
            if (doubt) {
                let tagsarr = req.body.tags.split(',');
                for (let tag of tagsarr) {
                    tagsmodel.findOne({ content: tag }, (err, result1) => {
                        if (result1)///////////////////the tag exists
                        {
                            tagsmodel.updateOne({ content: tag }, { $set: { occurences: result1.occurences + 1 } }, (err, result2) => {
                                if (err) { return res.send({ err: err, status: false }); }
                            })
                        }
                        else////////////////////the tag does not exist
                        {
                            tagsmodel.create({
                                content: tag,
                                occurences: 1
                            }),
                                (err, result2) => {
                                    if (err) { return res.send({ err: err, status: false }); }
                                }
                        }
                    })
                }
                let user_doubts_temp = req.body.user_doubts
                user_doubts_temp += "," + doubt._id
                user_doubts_temp = user_doubts_temp.split(",");
                let user_doubts = user_doubts_temp.filter((item) => {
                    return !(item === '')
                })
                users.updateOne({ _id: req.body.userid }, { $set: { doubts: user_doubts } }, (err, result3) => {
                    if (err) { return res.send({ err: err, status: false }) }
                    else {
                        let user = JSON.parse(req.body.user)
                        let Maildetails = {
                            from: 'resolveteam4@gmail.com',
                            to: user.email,
                            subject: "Doubt posted successfully",
                            text: `Greetings ${user.firstName} ${user.lastName} from team RESOLVE
                                    Your doubt:${doubt.title} has been posted successfully
                                    Click on this link to view your doubt:https://resolve4.herokuapp.com/doubts/${doubt._id}`
                        }
                        notifications.create({
                            owner: req.body.userid,
                            initiator: req.body.userid,
                            owner_username: req.body.username,
                            initiator_username: req.body.username,
                            seen: false,
                            date: new Date(),
                            doubt: doubt._id,
                            doubt_title: doubt.title.substring(0, 9) + '...',
                            type: "doubt created"
                        }, ((err, notification) => {
                            transporter.sendMail(Maildetails, (err, info) => {
                                if (err) { return res.send({ status: true, doubt: doubt._id, user_doubts: user_doubts, notification: notification }); }
                                else { return res.send({ doubt: doubt._id, status: true, user_doubts: user_doubts, notification: notification }) }
                            })
                        }))
                    }
                })
            }
        })
    )
})

route.post('/getrelated', (req, res) => {
    doubts.find({}, { title: 1, _id: 1, tags: 1, views: 1 }, (err, doubts) => {
        if (err) { return res.send({ result: false, msg: "Error fetching related doubts" }) }
        else {
            let related_doubts = []
            for (let doubt of doubts) {
                let matching_tags = [];
                let input_tags = req.body.tags.split(',')
                for (let tag of input_tags) {
                    if (doubt.tags.includes(tag) === true) { matching_tags.push(tag); }
                }
                if (matching_tags.length > 0) {
                    let tempdoubtobj = {
                        _id: doubt._id,
                        title: doubt.title,
                        views: doubt.views,
                        matching_tags: matching_tags
                    }
                    related_doubts.push(tempdoubtobj)
                }
            }
            return res.send({ result: true, doubts: related_doubts })
        }
    })
})

route.get('/homegetall/:skip', (req, res) => {
    let limit = 1;
    let skip = parseInt(req.params.skip);
    if (skip === 0) { limit = 2; }
    doubts.find({}, { title: 1, num_of_replies: 1, views: 1, description: 1 }, { limit: limit, skip: skip }, (err, result) => {
        if (err) { return res.send({ status: false, error: err }) }
        else { return res.send({ status: true, doubts: result }) }
    })
})

route.post('/specified', (req, res) => {
    doubts.find({ _id: { $in: req.body.ids } }, { _id: 1, title: 1 }, ((err, result) => {
        if (err) { return res.send({ status: false, error: err }) }
        else { return res.send({ status: true, doubts: result }) }
    }))
})

route.get('/getall', (req, res) => {
    doubts.find({}, { title: 1, description: 1, tags: 1, views: 1, num_of_replies: 1, username: 1, _id: 1, user: 1, date: 1 }, ((err, result) => {
        if (err) { return res.send({ status: false, error: err }) }
        else {
            return res.send({ status: true, doubts: result })
        }
    })
    )
})

route.get('/getalltags', (req, res) => {
    tagsmodel.find({}, (err, result) => {
        if (err) { return res.send({ status: false, error: err }) }
        else {
            return res.send({ status: true, tags: result })
        }
    })
})

route.get('/:id', (req, res) => {
    doubts.findOne({ _id: req.params.id }, ((err, result1) => {
        if (err) { return res.send({ status: false, error: err }) }
        else {
            doubts.updateOne({ _id: result1._id }, { $set: { views: result1.views + 1 } }, ((err, result2) => {
                if (err) { return res.send({ status: false, error: err }) }
                result1.views++;
                return res.send({ status: true, doubt: result1 })
            }))
        }
    }))

})

route.post('/addbookmark', (req, res) => {
    let bookmarkarr = req.body.bookmarks
    bookmarkarr.push(req.body.doubtid)
    users.updateOne({ _id: req.body.userid }, { $set: { bookmarks: bookmarkarr } }, (err, result2) => {
        if (err) { return res.send({ err: err, status: false }); }
        else {
            return res.send({ status: true, bookmarks: bookmarkarr })
        }
    })
})

route.post('/removebookmark', (req, res) => {
    let bookmarkarr = req.body.bookmarks.filter((item) => {
        return !(item === req.body.doubtid)
    })
    users.updateOne({ _id: req.body.userid }, { $set: { bookmarks: bookmarkarr } }, (err, result2) => {
        if (err) { return res.send({ err: err, status: false }); }
        else {
            return res.send({ status: true, bookmarks: bookmarkarr })
        }
    })
})


module = module.exports = route