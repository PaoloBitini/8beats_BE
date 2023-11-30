const SqlDB = require('./sqlDB.js')
express = require('express')
router = express.Router()
const fs = require('fs');
var sqlDB = new SqlDB()


router.post('/join', (req, res) => {
  
    sqlDB.bandsJoin(req.body.band, req.body.user, req.body.role, function(err, result){
        if (err) {
            if (err.errno == 1062) {
                res.json({ "result": "You are already a member of" + req.body.band })
            } else {
                throw err
            }
        } else {
            profile_data = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))
            profile_data.bands.push({ "band": req.body.band, "role": req.body.role })
            fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_data))

            profile_data.result = "success"
            res.json(profile_data)
        }
    })
})

router.post('/create', (req, res) => {

    sqlDB.bandsCreate(req.body.name, req.body.genre, req.body.country, req.body.city,(err, result)=>{if (err) throw err})
    sqlDB.bandsJoin(req.body.name, req.body.user, req.body.role, (err, result) =>{if (err) throw err})

    profile_data = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))
    newBinding = { "band": req.body.name, "role": req.body.role }
    profile_data.bands.push(newBinding)

    fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_data))
    console.log("band created")
    res.json(profile_data)

})

router.post('/modify', (req, res) => {

    sqlDB.bandsModify(req.body.band, req.body.descr, function(err, result){
        if (err) throw err;

        res.json({
            result: "Description modified",
        })
    })
})

router.post('/leave', (req, res) => {

    bands = []
    for (i of req.body.bands) {
         bands.push(i.band.concat(req.body.user))
     }

    sqlDB.bandsLeave(bands, function(err, result){
        if (err) throw err;

        profile_data = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))
        profile_data.bands = profile_data.bands.filter(x => !req.body.bands.some(y => x.band === y.band));
        fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_data))

        console.log(profile_data)
        console.log("binding delete success")
        res.json(profile_data)
    })
})

module.exports = router