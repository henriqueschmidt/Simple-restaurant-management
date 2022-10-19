const pool = require('../config/database')
const db = pool.db

const index = (request, response) => {
    db.query('SELECT * FROM menu_tabs ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const show = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('SELECT * FROM menu_tabs WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

module.exports = {
    index,
    show
};
