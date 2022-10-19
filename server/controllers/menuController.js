const pool = require('../config/database')
const db = pool.db

const index = (request, response) => {
    const sql = `
        SELECT 
            r.id,
            r.name,
            r.price,
            mt.name,
            mt.system_id,
            string_agg(f."name", ', ') as foods
        FROM recipes as r
        inner join menu_tabs as mt on mt.id = r.menu_tab_id
        inner join food_x_recipes as fxr on fxr.recipe_id = r.id
        inner join foods as f on f.id = fxr.food_id
        group by r.id, mt.name, mt.system_id
        ORDER BY id ASC
    `;

    db.query(sql, (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
};
module.exports = {
    index,
};
