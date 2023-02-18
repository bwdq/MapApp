const db = require('../persistence');
const uuid = require('uuid/v4');

module.exports = async (req, res) => {
    const item = {
        id: uuid(),
        label: req.body.label,
        completed: false,
        type: req.body.type,
        x: req.body.x,
        y: req.body.y,
    };
    await db.storeItem(item);
    //res.send(item);
    res.sendStatus(200);
};
