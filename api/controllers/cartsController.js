const initModels = require("../../database/models/init-models");
const { sequelize } = require('../../database/models');

const models = initModels(sequelize);

const controllerCart = {
  listCart: async (req, res) => {
    try {
      const cartDBJson = await models.carts.findAll(
        {
          include: [
            {
              model: models.users,
              as: 'users'
            },
            {
            model: models.product_cart,
            as: 'product_carts',
            attributes: ['product_id', 'quantity', 'created_at', 'updated_at'],
        }
        
      ],
        where: {id: req.params.id}
        }
      )

      // const cart = cartDB.find(el => el.user === Number(id));
      // if (!cart){
      //   return res.status(400).json({
      //     msg: 'Bad request'
      //   });
      // }
      res.status(200).send(cartDBJson)
    } catch (error) {
        console.log(error);
        res.status(500).json({
           msg: 'Error interno'
        });
    }
  },
  updateCart: (req, res) => {
    const id = req.params.id;
    const dataUpdate = req.body;

    try {
      const cartDBJson = fs.readFileSync("api/data/carts.json", "utf-8");
      let cartDB = JSON.parse(cartDBJson);

      let cart = cartDB.find(el => el.user === Number(id));
      if (cart){
        cartDB.forEach(el => {
            if(el.user === Number(id)){
                el.cart = dataUpdate;
            }
        });

        cart = cartDB.find(el => el.user === Number(id))

        fs.writeFileSync("api/data/carts.json", JSON.stringify(cartDB));

        res.status(200).send(cart.cart)
      } else {
        res.status(404).json({
            msg: 'Not Found'
        })
      }
    } catch (error) {
        console.log(error);
        res.status(500).json({
           msg: 'Error interno'
        });
    }
  }
};

module.exports = controllerCart;