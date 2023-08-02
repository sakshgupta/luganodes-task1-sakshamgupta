const User = require('../models/user');

const details = async (req, res) => {
    const {userId} = req.body;
    console.log("function called");
    try {
        const data = await User.find({user_id: userId});
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { details };
