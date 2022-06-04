const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20')
const users = require("./models/userModel")
const oauth = require('./oauth')

passport.serializeUser(function (user, done) {
    if (user.providerGoogle === true) { done(null, user.googleId) }
    else { done(null, user.userName) }
})

passport.deserializeUser(function (uniqueattribute, done) {
    users.findOne({
        'userName': uniqueattribute
    }, ((err, user) => {
        if (err) {
            return done(err)
        }
        if (!user) {
            users.findOne({
                'googleId': uniqueattribute
            },
                ((err, user) => {
                    if (user) { done(null, user) }
                    else { done(err) }
                }))
        }
        else {
            return done(null, user)
        }
    })
    )
})

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    function (req, username, password, done) {
        process.nextTick(function () {
            users.findOne(
                {
                    'userName': username
                },
                ((err, user) => {
                    if (err) { return done(err) }
                    if (!user) {
                        users.findOne(
                            {
                                'email': req.body.email
                            },
                            ((err, user) => {
                                if (err) { return done(err) }
                                if (!user) {
                                    users.create({
                                        userName: username,
                                        password: password,
                                        firstName: req.body.firstname,
                                        lastName: req.body.lastname,
                                        email: req.body.email,
                                        googleProvider: false,
                                        points: 0,
                                        year: "",
                                        rollNumber: "",
                                        branch: "",
                                        skills: "",
                                        private: false,
                                        dp: "",
                                        email_verified: false
                                    },
                                        ((err, user) => {
                                            if (err) { return done(err, req.flash('message', err)) }
                                            return done(null, user, req.flash('message', "signed up successfully"))
                                        })
                                    )
                                }
                                else {
                                    return done(null, false, req.flash('message', "email is aleady registered"));
                                }
                            })
                        )
                    }
                    else {
                        return done(null, false, req.flash('message', "username already exists"));
                    }
                })
            )
        })
    }))

passport.use('login', new LocalStrategy({
    passReqToCallback: true
},
    function (req, username, password, done) {
        users.findOne({
            'userName': username,
        },
            ((err, user) => {
                if (err) { return done(err); }
                if (!user) { return done(null, false, req.flash('message', "user does not exist")) }
                else {
                    if (user.providerGoogle === true) { return done(null, false, req.flash('message', "log in with google")) }
                    user.correctPassword(password, user.password)
                        .then((res) => {
                            if (res === false) { return done(null, false, req.flash('message', "incorrect password")) }
                            else { return done(null, user, req.flash('message', "logged in successfully")) }
                        })
                        .catch((err) => { return done(err) })
                }
            })
        )
    }))


passport.use('redirect_to_private_page', new GoogleStrategy({
    clientID: oauth.googleauth.clientId,
    clientSecret: oauth.googleauth.clientSecret,
    callbackURL: oauth.googleauth.callbackURL,
    passReqToCallback: true
},
    function (req, accessToken, refrshToken, profile, done) {
        process.nextTick(() => {
            users.findOne({
                'googleId': profile.id
            },
                ((err, user) => {
                    if (err) { return done(err) }
                    if (user) { return done(null, user); }
                    else {
                        users.findOne(
                            {
                                'email': profile.emails[0].value
                            },
                            (err, user) => {
                                if (err) { return done(err) }
                                else if (user) { return done(null, false, req.flash('message', "email is aleady registered")); }
                                else {
                                    users.create({
                                        googleId: profile.id,
                                        userName: profile.emails[0].value.split('@')[0] + '#',
                                        firstName: profile.name.givenName,
                                        lastName: profile.name.familyName,
                                        password: profile.id,
                                        email: profile.emails[0].value,
                                        providerGoogle: true,
                                        points: 0,
                                        year: "",
                                        rollNumber: "",
                                        branch: "",
                                        skills: "",
                                        private: false,
                                        dp: "",
                                        email_verified: true
                                    },
                                        ((err, user) => {
                                            if (err) { return done(err, req.flash('message', 'Problem signing up with google')); }
                                            if (user) { return done(null, user); }
                                        })
                                    )
                                }
                            })
                    }
                })
            )
        })
    }
));

passport.use('redirect_to_doubtform_page', new GoogleStrategy({
    clientID: oauth.googleauth.clientId,
    clientSecret: oauth.googleauth.clientSecret,
    callbackURL: oauth.googleauth.callbackURL_specific,
    passReqToCallback: true
},
    function (req, accessToken, refrshToken, profile, done) {
        process.nextTick(() => {
            users.findOne({
                'googleId': profile.id
            },
                ((err, user) => {
                    if (err) { return done(err) }
                    if (user) { return done(null, user); }
                    else {
                        users.findOne(
                            {
                                'email': profile.emails[0].value
                            },
                            (err, user) => {
                                if (err) { return done(err) }
                                else if (user) { return done(null, false, req.flash('message', "email is aleady registered")); }
                                else {
                                    users.create({
                                        googleId: profile.id,
                                        userName: profile.emails[0].value.split('@')[0] + '#',
                                        firstName: profile.name.givenName,
                                        lastName: profile.name.familyName,
                                        password: profile.id,
                                        email: profile.emails[0].value,
                                        providerGoogle: true,
                                        points: 0,
                                        year: "",
                                        rollNumber: "",
                                        branch: "",
                                        skills: "",
                                        private: false,
                                        dp: "",
                                        email_verified: true
                                    },
                                        ((err, user) => {
                                            if (err) { return done(err, req.flash('message', 'Problem signing up with google')); }
                                            if (user) { return done(null, user); }
                                        })
                                    )
                                }
                            })
                    }
                })
            )
        })
    }
));


module.exports = passport;