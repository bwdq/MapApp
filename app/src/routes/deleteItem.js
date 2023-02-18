const db = require('../persistence');

module.exports = async (req, res) => {
    await db.removeItem(req.body.x, req.body.y, req.body.type);
    res.sendStatus(200);
};
