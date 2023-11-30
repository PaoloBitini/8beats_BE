express = require('express')
router = express.Router()
const fs = require('fs');

router.post('/add', (req, res) => {

    profile_user = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))
    profile_friend = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.friend + '_data.json'))

    if (profile_user.friends.filter(elem => elem.name == req.body.friend).length < 1) {

        const newFriend = {
            name: profile_friend.user,
            email: profile_friend.email,
            bands: profile_friend.bands,
            club: profile_friend.club
        }

        profile_user.friends.push(newFriend)

        fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_user))

        res.json({
            result: "success",
            friends: profile_user.friends
        })

    } else {
        res.json({
            result: "already_friends"
        })
    }

})

router.post('/del', (req, res) => {

    profile_user = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))
    profile_user.friends = profile_user.friends.filter((elem) => { return elem.name != req.body.friend })

    fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_user))

    res.json({
        result: "friend deleted",
        friends: profile_user.friends
    })

})

module.exports = router