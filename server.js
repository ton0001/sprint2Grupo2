require("dotenv").config();

const { sequelize } = require('./database/models')
const express = require("express");
const app = express();
const swaggerUi = require('swagger-ui-express')
const cors = require('cors')
const PORT = process.env.PORT;

const productRoutes = require("./api/routes/productsRoutes");
const usersRoutes = require("./api/routes/usersRoutes");
const pictureRoutes = require('./api/routes/pictureRoutes')
const cartRoutes = require('./api/routes/cartsRoutes')

const {login} = require("./api/controllers/usersController");

const YAML = require('yamljs');
const { Sequelize } = require("sequelize");
const swaggerDocument = YAML.load('./swagger.yaml');


app.use(express.json());
app.use(cors())

app.use('/api/v2/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/api/v2',  (req, res)=>{ res.status(200).send("API funcionando correctamente")})
app.post('/api/v2/login', login)

app.use('/api/v2/products',productRoutes)
app.use('/api/v2/pictures',pictureRoutes)
app.use('/api/v2/carts', cartRoutes)
app.use('/api/v2/users', usersRoutes);



app.listen(PORT, ()=> {
    console.log(`server corriendo en ${PORT}`);
    sequelize.sync({ alter: true });
})


