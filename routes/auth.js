const express = require('express')
const route = express.Router();
const path = require('path')

const notifications = require('../models/notificationModel')

/////////////////////////////////<socket.io>
const server = require('../server')
const socketio = require('socket.io')
const io = socketio(server)
let sockets = {}
io.on('connection', function (socket) {
    socket.on('login', function (data) {
        sockets[data.user] = socket.id;
        notifications.find({ owner: data.user, seen: false }, (err, result) => {
            if (result) { io.to(socket.id).emit('initial_notify', result) }
        })
    })
    socket.on('disconnect', function (data) {
        delete sockets[data.user]
    })
    socket.on('customdisconnect', function (data) {
        delete sockets[data.user]
    })
    socket.on('upvote', function (data) {
        if (sockets.hasOwnProperty(data.notification.owner)) {
            io.to(sockets[data.notification.owner]).emit('notify', data.notification)
        }
    })
    socket.on('downvote', function (data) {
        if (sockets.hasOwnProperty(data.notification.owner)) {
            io.to(sockets[data.notification.owner]).emit('notify', data.notification)
        }
    })
    socket.on('message', function (msg) {
        if (sockets.hasOwnProperty(msg.receiver)) {
            io.to(sockets[msg.receiver]).emit('message', msg)
        }
    })
    socket.on('replied', function (data) {
        notifications.create({
            owner: data.owner,
            initiator: data.initiator,
            owner_username: data.initiator_username,
            initiator_username: data.initiator_username,
            seen: false,
            date: new Date(),
            doubt: data.doubtid,
            doubt_title: data.title,
            type: "doubt replied"
        }, ((err, notification) => {
            if (sockets.hasOwnProperty(notification.owner)) {
                io.to(sockets[notification.owner]).emit('notify', notification)
            }
        }))
    })
})
route.get('/test', (req, res) => {
    io.sockets.emit('notify', { msg: 'this is a notification' })
    res.send(sockets)
})
/////////////////////////////////</socket.io>

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


const usersmodel = require('../models/userModel')
const doubtsmodel = require('../models/doubtsModel')
const repliesmodel = require('../models/repliesModel')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require("../passport")
route.use(cookieParser('keyboard cat'));
route.use(session({ secret: 'somesecretstring', cookie: { maxage: 6000, secure: false } }));
route.use(flash())
route.use(passport.initialize())
route.use(passport.session())

const multer = require('multer')
const DIR = path.join(__dirname, "../dpimages");

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


route.get('/getseennotifications/:id', (req, res) => {
    notifications.find({ owner: req.params.id, seen: true }, { initiator_username: 1, date: 1, doubt_title: 1, doubt: 1, type: 1, initiator: 1 }, (err, result) => {
        if (err) { return res.send({ status: false, err: err }) }
        else { return res.send({ status: true, activity: result }) }
    })
})

route.get('/viewnotification/:id', (req, res) => {
    notifications.updateOne({ _id: req.params.id }, { $set: { seen: true } }, (err, result) => {
        if (err) {
            return res.send({ err: err, status: false })
        }
        else {
            return res.send({ status: true })
        }
    })
})

route.get('/getuser', (req, res) => {
    if (!req.user) { return res.send({ result: false, msg: "No user logged in" }) }
    usersmodel.findOne({ '_id': req.user._id }, (err, user) => {
        if (err) { return res.send({ result: false, err: err }) }
        else { req.user = user; return res.send({ result: true, user: user }) }
    })
})

route.get('/google', passport.authenticate('redirect_to_private_page', { scope: ['profile', 'email'], prompt: "select_account" }))
route.get('/google/callback', passport.authenticate('redirect_to_private_page', { successRedirect: '/auth/google/redirect', failureRedirect: '/auth/google/fail', failureFlash: true }));

route.get('/google/redirect', (req, res) => {
    if (req.user) { res.redirect("https://resolve4.herokuapp.com/private_user_profile") }
    else { res.send("not") }
})
/////////same but for google auth request from doubt form page
route.get('/google_specific', passport.authenticate('redirect_to_doubtform_page', { scope: ['profile', 'email'], prompt: "select_account" }))
route.get('/google/callback_specific', passport.authenticate('redirect_to_doubtform_page', { successRedirect: '/auth/google/redirect_specific', failureRedirect: '/auth/google/fail', failureFlash: true }));

route.get('/google/redirect_specific', (req, res) => {
    if (req.user) { res.redirect("https://resolve4.herokuapp.com/ask_a_doubt") }
    else { res.send("not") }
})


route.post('/signup', passport.authenticate('signup', {
    successRedirect: '/auth/signup/redirect',
    failureRedirect: '/auth/fail',
    failureFlash: true
}))

route.post('/login', passport.authenticate('login', {
    successRedirect: '/auth/login/redirect',
    failureRedirect: '/auth/fail',
    failureFlash: true
}))

route.get('/login/redirect', (req, res) => {
    let msg = req.flash('message')[0]
    if (req.user) { res.send({ result: true, user: req.user, reqmsg: msg }); }
    else { res.send({ result: false, reqmsg: "Some error occurred" }); }
})

route.get('/signup/redirect', (req, res) => {
    let Maildetails = {
        from: 'resolveteam4@gmail.com',
        to: req.user.email,
        subject: "Email verification for your RESOLVE account",
        text: `Greetings ${req.user.firstName} ${req.user.lastName} from team RESOLVE
              Click on this link to verify your email
              https://resolve4.herokuapp.com/auth/verify/${req.user._id}/${req.user.email}`
    }
    transporter.sendMail(Maildetails, (err, info) => {
        let msg = req.flash('message')[0]
        if (err) { return res.send({ result: true, user: req.user, reqmsg: "Signedup,verification email failed" }); }
        else { return res.send({ result: true, user: req.user, reqmsg: msg }); }
    })
})

route.get('/google/fail', (req, res) => {
    let msg = req.flash('message')[0]
    res.redirect("https://resolve4.herokuapp.com/problem_page_for_all_so_that_no_one_can_guess_this_path_@ksbdb")
})

route.get('/fail', (req, res) => {
    let msg = req.flash('message')[0]
    res.send({ result: false, reqmsg: msg });
})

route.get('/sendmail', (req, res) => {
    if (!req.user) { return res.send({ result: false, reqmsg: "User not logged in" }) }
    let Maildetails = {
        from: 'resolveteam4@gmail.com',
        to: req.user.email,
        subject: "Email verification for your RESOLVE account",
        text: `Greetings ${req.user.firstName} ${req.user.lastName} from team RESOLVE
              Click on this link to verify your email
              https://resolve4.herokuapp.com/auth/verify/${req.user._id}/${req.user.email}`
    }
    transporter.sendMail(Maildetails, (err, info) => {
        if (err) { return res.send({ result: false, reqmsg: "Problem sending the mail" }); }
        else { return res.send({ result: true, reqmsg: "mail sent" }); }
    })
})

route.get('/verify/:user/:email', (req, res) => {
    usersmodel.findOne({ '_id': req.params.user }, ((err, result) => {
        if (result.email !== req.params.email) {
            return res.redirect('https://resolve4.herokuapp.com/email_verification/0')
        }
        else {
            usersmodel.updateOne({ _id: req.params.user }, { $set: { email_verified: true } }, (err, result) => {
                if (err) { return res.redirect('https://resolve4.herokuapp.com/email_verification/0') }
                else { return res.redirect('https://resolve4.herokuapp.com/email_verification/1') }
            })
        }
    }))
})

route.get('/logout', (req, res) => {
    req.logOut();
    res.send("logged out");
})

route.get('/getallusers/:page', (req, res) => {
    let skip = (req.params.page - 1) * 5;
    usersmodel.find({}, { _id: 1, firstName: 1, lastName: 1, points: 1, userName: 1, doubts: 1, replies: 1, dp: 1 }, { sort: { points: -1, _id: -1 }, limit: 5, skip: skip }, (err, result) => {
        if (err) { return res.send({ status: false, err: err }) }
        else {
            let sendableresult = result.map((item) => {
                return ({
                    _id: item._id,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    points: item.points,
                    userName: item.userName,
                    doubts: item.doubts.length,
                    replies: item.replies.length,
                    dp: item.dp
                })
            })
            return res.send({ status: true, users: sendableresult })
        }
    })
})

route.post('/updateemail', (req, res) => {
    usersmodel.findOne({ 'email': req.body.newemail }, (err, result) => {
        if (err) { return res.send({ result: false, msg: "Problem updating email" }) }
        else if (result) { return res.send({ result: false, msg: "New email is already registered" }) }
        else {
            usersmodel.updateOne({ _id: req.user._id }, { $set: { email: req.body.newemail, email_verified: false } }, (err, result2) => {
                if (err) { return res.send({ result: false, msg: "Problem updating email" }) }
                else { return res.send({ result: true, msg: "Updated mail successfully" }) }
            })
        }
    })
})

route.post('/update_profile', upload.single('dp'), (req, res) => {
    let imagepath = req.body.dpname;
    if (req.file) { imagepath = '/dpimages/' + req.file.filename; }
    usersmodel.updateOne({ _id: req.body._id }, { $set: { year: req.body.year, branch: req.body.branch, rollNumber: req.body.rollNumber, skills: req.body.skills, private: req.body.private, dp: imagepath } }, (err, result) => {
        if (err) { return res.send({ status: false, err: err }) }
        else {
            doubtsmodel.updateMany({ user: req.body._id }, { $set: { dp: imagepath } }, (err1, result1) => {
                if (err1) { return res.send({ status: false, err: err1 }) }
                else {
                    repliesmodel.updateMany({ user: req.body._id }, { $set: { dp: imagepath } }, (err2, result2) => {
                        if (err2) { return res.send({ status: false, err: err2 }) }
                        else {
                            return res.send({ status: true })
                        }
                    })
                }
            })

        }
    })
})

route.get("/getuserpublic/:id", (req, res) => {
    usersmodel.findOne({ _id: req.params.id }, { firstName: 1, lastName: 1, points: 1, userName: 1, email: 1, year: 1, rollNumber: 1, branch: 1, skills: 1, private: 1, dp: 1, doubts: 1 }, (err, result) => {
        if (err) { res.send({ status: false, err: err }) }
        else {
            if (result.private === false) { res.send({ status: true, user: result }) }
            else { res.send({ status: true, user: { private: result.private } }) }
        }
    })
})

module = module.exports = route