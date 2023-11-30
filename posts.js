const SqlDB = require('./sqlDB.js')
express = require('express')
router = express.Router()
const fs = require('fs');
var sqlDB = new SqlDB()

router.post('/add', (req, res) => {

    sqlDB.postAdd(req.body.id, req.body.user, req.body.obj, req.body.desc, function (err, result) {
        if (err) throw err;

        profile_data = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))

        newPost = {
            id: req.body.id,
            user: req.body.user,
            object: req.body.obj,
            descr: req.body.desc,
        }

        profile_data.posts.push(newPost)

        fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_data))

        res.json({
            result: "Post added",
            post: newPost
        })
    })

})

router.post('/del', (req, res) => {

    sqlDB.postDel(req.body.id, function (err, result) {
        if (err) throw err;

        profile_data = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))
        profile_data.posts = profile_data.posts.filter(x => x.id != req.body.id)
        fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_data))

        res.json({
            result: "Post deleted",
        })
    })

})

module.exports = router