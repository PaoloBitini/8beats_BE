const SqlDB = require('./sqlDB.js')
express = require('express')
router = express.Router()
const fs = require('fs');
var sqlDB = new SqlDB()


router.post('/add', (req, res) => {

    sqlDB.eventAdd(req.body.id, req.body.user, req.body.date, req.body.club, req.body.band, req.body.desc, function (err, result) {
        if (err) throw err;
        profile_data = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))


        newEvent = {

            id: req.body.id,
            user: req.body.user,
            date: req.body.date,
            club: req.body.club,
            band: req.body.band,
            descr: req.body.desc
    
        }

        profile_data.events.push(newEvent)

        fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_data))

        res.json({
            result: "Event added",
            event: newEvent
        })
    })

})

router.post('/del', (req, res) => {
    
    sqlDB.eventDel(req.body.id, function (err, result) {
        if (err) throw err;
        profile_data = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))
        profile_data.events = profile_data.events.filter(x => x.id != req.body.id)
        fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_data))

        res.json({
            result: "Event deleted",
        })
    })

})

module.exports = router