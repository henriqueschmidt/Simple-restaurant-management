const pool = require('../config/database')
const db = pool.db

const index = (request, response) => {

    const sql = `
        SELECT
            u.id,
            u.name,
            ut.name as type
        FROM users as u
        inner join user_types as ut on ut.id = u.user_type_id
        order by id desc 
    `

    db.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const show = (request, response) => {
    const id = parseInt(request.params.id);

    const sql = `
        SELECT
            u.id,
            u.name,
            u.username,
            u.email,
            u.user_type_id,
            '' as password
        FROM users as u
        inner join user_types as ut on ut.id = u.user_type_id
        WHERE u.id = $1
    `;

    db.query(sql, [id], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
};

const store = (request, response) => {
    const { name, email, username, user_type_id, password } = request.body;

    db.query(
        'INSERT INTO users (name, username, email, user_type_id, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, username, email, user_type_id, password],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        }
    );
};

const update = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, email, user_type_id, username } = request.body;

    db.query(
        'UPDATE users SET name = $1, email = $2, user_type_id = $3, username = $4 WHERE id = $5',
        [name, email, user_type_id, username, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`);
        }
    );
};

const destroy = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
};
