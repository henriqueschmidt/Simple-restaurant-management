const pool = require('../config/database')
const db = pool.db

const index = (request, response) => {

    const sql = `
        SELECT r.*,
               string_agg(f."name", ', ') as foods
        FROM recipes as r
                 inner join food_x_recipes as fxr on fxr.recipe_id = r.id
                 inner join foods as f on f.id = fxr.food_id
        group by r.id
        ORDER BY id ASC
    `;

    db.query(sql, (error, results) => {
        if (error) {
            console.log(error)
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const show = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('SELECT * FROM recipes WHERE id = $1', [id], (error, results) => {
        if (error) throw error;
        db.query('SELECT id, food_id, qtd FROM food_x_recipes WHERE recipe_id = $1', [id], (e, r) => {
            if (e) throw error;
            const data = results.rows[0]
            data.foods = r.rows
            response.status(200).json([data]);
        })
    });
};

const store = (request, response) => {
    const { name, price, foods, menu_tab_id } = request.body;

    db.query(
        'INSERT INTO recipes (name, price, menu_tab_id) VALUES ($1, $2, $3) RETURNING *',
        [ name, parseFloat(price), menu_tab_id ],
        (error, results) => {
            if (error) {
                throw error;
            }

            foods.forEach(food => {
                createFoodRecipe(results.rows[0].id, food)
            })

            response.status(201).send(`Food added with ID: ${results.rows[0].id}`);
        }
    );
};

const destroyFoodXRecipes = (id) => {
    db.query('DELETE FROM food_x_recipes WHERE id = $1', [id], (e, r) => {
        if (e) throw e;
    });
}

const createFoodRecipe = (recipe_id, food) => {
    db.query(
        'INSERT INTO food_x_recipes (recipe_id, food_id, qtd) values ($1, $2, $3) RETURNING *',
        [recipe_id, parseInt(food.food_id+''), parseInt(food.qtd+'')],
        (error, results) => {
            if (error) {
                throw error;
            }
        }
    );
}

const updateFoodRecipe = (recipe_id, food) => {
    db.query(
        'UPDATE food_x_recipes set recipe_id = $1, food_id = $2, qtd = $3 WHERE id = $4',
        [recipe_id, parseInt(food.food_id+''), parseInt(food.qtd+''), food.id],
        (error, results) => {
            if (error) {
                throw error;
            }
        }
    );
}

const update = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, price, foods, menu_tab_id } = request.body;

    const food_ids = [...new Set(foods.map(z => z.id))];

    db.query('select id, food_id from food_x_recipes as fxr where recipe_id = $1', [id], (error, results) => {
        if (error) throw error;
        results.rows.forEach(z => {
            if (!food_ids.includes(z.id)) {
                destroyFoodXRecipes(z.id)
            }

            foods.forEach(food => {
                if (food.id === null) {
                    createFoodRecipe(id, food)
                } else {
                    updateFoodRecipe(id, food)
                }
            })
        })
    })

    db.query(
        'UPDATE recipes SET name = $1, price = $2, menu_tab_id = $3 WHERE id = $4',
        [name, parseFloat(price+''), menu_tab_id, id],
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

    db.query('DELETE FROM food_x_recipes WHERE recipe_id = $1', [id], (error, results) => {
        if (error) throw error;
    });

    db.query('DELETE FROM recipes WHERE id = $1', [id], (error, results) => {
        if (error) throw error;
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
