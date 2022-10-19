const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'web2',
    password: 'postgres',
    port: 5432,
});

module.exports = {
    db,
}
