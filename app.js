
const SqlDB = require('./sqlDB.js')
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
var app = express();
const port = 3000;



var sqlDB = new SqlDB()

var msg = require('./message.js')
var events = require('./events.js')
var posts = require('./posts.js')
var friends = require('./friends.js')
var bands = require('./bands.js')
var clubs = require('./clubs.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    } else {

        res.sendStatus(403);
    }

}

app.post('/api/auth', verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            res.json({
                "message": "authenticated",
                authData
            });
        }
    });
})

app.post('/api/auth/get', (req, res) => {

    if (req.body.type == 1) { //bands
    
        sqlDB.getBandsLike(req.body.query, function (err, result) {
            if (err) throw err;

            sqlDB.getBandsBindingsLike(req.body.query, function (err2, result2) {
                if (err2) throw err2;

                result.forEach(band => {
                    band.members = []
                    result2.forEach(bind =>{
                        if(band.name == bind.band){
                            band.members.push({
                                name: bind.member,
                                role: bind.role
                            })
                        }
                    })
                });

                res.json({
                    result: "success",
                    bands: result
                })
            })
        })

    } else if (req.body.type == 2) { //clubs

        sqlDB.getClubs(function (err, result) {
            if (err) throw err;

            res.json({
                result: "success",
                clubs: result
            })
        })

    } else if (req.body.type == 3) { //Post Events

        sqlDB.getPosts(null, function (err, result) {
            if (err) throw err;

            sqlDB.getEvents(null, function (err2, result2) {
                if (err2) throw err2;

                res.json({
                    result: "success",
                    posts: result,
                    events: result2
                })
            })

        })

    } else if (req.body.type == 4) { //Users

        sqlDB.getUsersLike(req.body.query, function (err, result) {
            if (err) throw err;

            res.json({
                result: "success",
                users: result
            })
        })
    } else {
        res.json({
            result: "unknown request"
        })
    }
})

app.use('/api/auth/message', msg)

app.use('/api/auth/events', events)

app.use('/api/auth/posts', posts)

app.use('/api/auth/friends', friends)

app.use('/api/auth/bands', bands)

app.use('/api/auth/clubs', clubs)

app.post('/api/login', (req, res, next) => {

    sqlDB.login(req.body.username, req.body.psw, function (err, result) {
        if (err) throw err;
        if (result == "") {
            res.json({
                "result": "not_registered"
            });
        } else {
            user = {
                username: req.body.username,
                psw: req.body.psw,
                email: result[0].email
            }
            req.user = user
            next();
        }
    })

}, (req, res) => {
    jwt.sign({ user: req.user }, 'secretkey', (err, token) => {
        try {
            resp = JSON.parse(fs.readFileSync('./Profiles_data/' + user.username + '_data.json'))
            resp.result = "logged"
            resp.token = token
            console.log(resp)
            res.json(resp);
        } catch (err) {
            console.log(err)
        }
    });
})

app.post('/api/register', (req, res, next) => {

    sqlDB.getUsers(req.body.user, req.body.email, function (err, result) {
        if (err) throw err;
        if (result.length) {
            res.json({
                "result": "user_already_registered"
            });

        } else {
            next();
        }
    });
}, (req, res) => {

    sqlDB.register(req.body.user, req.body.email, req.body.psw, function (err, result) {
        if (err) throw err;
        newUser = {
            user: req.body.user,
            email: req.body.email,
            psw: req.body.psw,
            messages: [],
            friends: [],
            bands: [],
            club: {},
            events: [],
            posts: []
        }
        const jsonString = JSON.stringify(newUser)
        fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', jsonString);
        res.json({
            "result": "true"
        });
    })

})

app.listen(port, () => {
    console.log("everithing works correctly i hope")
});
