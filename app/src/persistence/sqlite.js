const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((acc, rej) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.run(
                'CREATE TABLE IF NOT EXISTS markers (id varchar(36), label varchar(255), completed boolean, ' +
                'type varchar(20), x DOUBLE, y DOUBLE)',
                (err, result) => {
                    if (err) return rej(err);
                    acc();
                },
            );
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        db.all('SELECT type, x, y, label FROM markers', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, {
                        markerGroup: item.markerGroup = 'session',
                    }),
                ),
            );
        });
    });
}

async function getItem(id) {
    return new Promise((acc, rej) => {
        db.all('SELECT label, type, x, y FROM markers WHERE x=? AND y=?', [x, y], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                )[0],
            );
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        db.run(
            'INSERT INTO markers (id, label, completed, type, x, y) VALUES (?, ?, ?, ?, ?, ?)',
            [item.id, item.label, item.completed ? 1 : 0, item.type, item.x, item.y],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        db.run(
            'UPDATE markers SET name=?, completed=? WHERE id = ?',
            [item.name, item.completed ? 1 : 0, id],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function removeItem(x, y, type) {
    return new Promise((acc, rej) => {
        db.run('DELETE FROM markers WHERE x = ? AND y = ? AND type = ?', [x, y, type], err => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
