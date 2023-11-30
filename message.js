express = require('express')
router = express.Router()
const fs = require('fs');

router.post('/send', (req, res) => {

    prof_data_sender = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.sender + '_data.json'))
    prof_data_receiver = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.receiver + '_data.json'))

    const message = {
        id: req.body.id,
        sender: req.body.sender,
        receiver: req.body.receiver,
        message: req.body.message,
        date: req.body.date
    }

    prof_data_sender.messages.push(message)
    prof_data_receiver.messages.push(message)

    fs.writeFileSync('./Profiles_data/' + req.body.sender + '_data.json', JSON.stringify(prof_data_sender))
    fs.writeFileSync('./Profiles_data/' + req.body.receiver + '_data.json', JSON.stringify(prof_data_receiver))

    res.json({
        messages: prof_data_sender.messages,
        result: "Done"
    })

})

router.post('/clear', (req, res) => {

    profile_data = JSON.parse(fs.readFileSync('./Profiles_data/' + req.body.user + '_data.json'))
    profile_data.messages = profile_data.messages.filter((element) => { return element.id != req.body.id })
    fs.writeFileSync('./Profiles_data/' + req.body.user + '_data.json', JSON.stringify(profile_data))

    console.log(profile_data.messages)

    res.json({
        messages: profile_data.messages,
        result: "Done"
    })
})

module.exports = router