const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const app = express()

const usersController = require('./controllers/usersController');
const usersTypesController = require('./controllers/usersTypesController');
const foodsController = require('./controllers/foodsController');
const recipesController = require('./controllers/recipesController');
const menuTabsController = require('./controllers/menuTabsController');
const menuController = require('./controllers/menuController');
require('dotenv').config()
const session = require('express-session')

const pool = require('./config/database')
const db = pool.db

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(express.json())
app.use(session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.ENVIRONMENT === 'production' ? 'true' : 'auto',
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax"
    }
}))

const chavePrivada = "ximira-xablau";
const middlewareValidarJWT = (req, res, next) => {
    const authorization = req.headers["authorization"];

    // Efetuando a validação do JWT:
    jwt.verify(authorization, chavePrivada, (err, userInfo) => {
        if (err) {
            console.log(err)
            res.status(401).end();
            return;
        }
        req.userInfo = userInfo;
        next();
    });
};

app.post('/api/login', async (req, res) => {
    const { user, password } = req.query;

    const sql = `
        SELECT
            u.id,
            u.name,
            u.password,
            system_id
        FROM users as u
                 inner join user_types as ut on ut.id = u.user_type_id
        where u.username = $1 and u.password = $2
    `;

    const has_user = await db.query(sql, [user, password])
    if (has_user.rows.length > 0) {
        req.session.user = {
            user,
            id: has_user.rows[0].id,
            user_type: has_user.rows[0].system_id
        }
        res.json(req.session.user)
    } else {
        res.json({status: 'invlaid'})
    }
})

app.get('/api/user-types', usersTypesController.index)

app.get('/api/cardapio', menuController.index)

app.get('/api/foods', foodsController.index)
app.get('/api/foods/:id', foodsController.show)
app.post('/api/foods', foodsController.store)
app.put('/api/foods/:id', foodsController.update)
app.delete('/api/foods/:id', foodsController.destroy)

app.get('/api/recipes', recipesController.index)
app.get('/api/recipes/:id', recipesController.show)
app.post('/api/recipes', recipesController.store)
app.put('/api/recipes/:id', recipesController.update)
app.delete('/api/recipes/:id', recipesController.destroy)

app.get('/api/menu-tabs', menuTabsController.index)

app.get('/api/users', usersController.index)
app.get('/api/users/:id', usersController.show)
app.post('/api/users', usersController.store)
app.put('/api/users/:id', usersController.update)
app.delete('/api/users/:id', usersController.destroy)

app.listen(3000)
