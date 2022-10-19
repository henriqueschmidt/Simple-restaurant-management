const pool = require('../config/database')
const db = pool.db

const index = (request, response) => {
    console.log('session', request.session)
    db.query('SELECT * FROM foods ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const show = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('SELECT * FROM foods WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const store = (request, response) => {
    const { name, qtd } = request.body;

    db.query(
        'INSERT INTO foods (name, qtd) VALUES ($1, $2) RETURNING *',
        [name, qtd],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(201).send(`Food added with ID: ${results.rows[0].id}`);
        }
    );
};

const update = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, qtd } = request.body;

    db.query(
        'UPDATE foods SET name = $1, qtd = $2 WHERE id = $3',
        [name, qtd, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`Food modified with ID: ${id}`);
        }
    );
};

const destroy = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE FROM foods WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Food deleted with ID: ${id}`);
    });
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
};
