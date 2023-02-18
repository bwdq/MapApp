const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

app.use(require('body-parser').json());
app.use('/map', express.static(__dirname + '/static'));

//added
app.get('/', (req, res) => {
    res.redirect('/map?markers=session');
  });
app.get('/map', (req, res) => {
    res.redirect('/map?markers=session');
});
app.get('', (req, res) => {
    res.redirect(301, '/');
});

app.put('/map/marker/session', addItem)
app.get('/map/marker/session', getItems)
app.delete('/map/marker/session', deleteItem)

db.init().then(() => {
    app.listen(3001, () => console.log('Listening on port 3001'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
