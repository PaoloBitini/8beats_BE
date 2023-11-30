const SqlDB = require('./sqlDB.js')
express = require('express')
router = express.Router()
const fs = require('fs');
var sqlDB = new SqlDB()


router.post('/claim', (req, res) => {

    sqlDB.clubClaim(req.body.name, req.body.address, req.body.country, req.body.lat, req.body.lon, req.body.owner, function(err, result){
        if (err){
            res.json({
                status: 0,
                result: "The club is already claimed by another user"
            })
        }else{
            userData = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.owner + '_data.json'))
            userData.club = req.body
            fs.writeFileSync('./Profiles_data/' + req.body.owner + '_data.json', JSON.stringify(userData))

            res.json({
                status: 1,
                result: 'Club claimed',
                club: req.body
            })
        }
    })
})

router.post('/modify', (req, res) => {

    sqlDB.clubModify(req.body.club, req.body.descr, function(err, result){
        if(err) throw err;

        userData = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))
        userData.club.descr = req.body.descr
        fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(userData))

        res.json({
            result: "Description modified",
            club: userData.club
        })

    })

})

router.post('/delete', (req, res) => {

    sqlDB.clubDelete(req.body.club, function(err, result){
        if(err) throw err;

        userData = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'));
        userData.club = {}
        fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(userData));

        res.json({
            result: "Club unbinded"
        })
    })
})

module.exports = router