const initModels = require("../../database/models/init-models");
const { sequelize } = require('../../database/models');

const models = initModels(sequelize);

const controllerCart = {
  listCart: async (req, res) => {
    try {
      const cartDB = await models.carts.findOne(
        {
          where: {user_id: req.params.id},
          include: [
            {
              model: models.product_cart,
              as: 'cart_products',
              attributes: ['product_id', 'quantity', 'created_at', 'updated_at']
            }
          ]
        }
      )

      if (!cartDB){
        return res.status(400).json({
          ok: false,
          message: 'El id solicitado no existe'
        });
      }

      res.status(200).json(cartDB)
    } catch (error) {
        console.log(error);
        res.status(500).json({
          ok: false,
          message: 'Error interno del servidor'
        });
    }
  },
  updateCart: async (req, res) => {
    const dataUpdate = req.body;

    try {
      const cartDBJson = await models.product_cart.update( dataUpdate, {
        where: {id: req.params.id}
      } )

      if (cartDBJson){
        res.status(200).json(cartDBJson)
      } else {
        res.status(404).json({
            ok: false,
            message: 'Not Found'
        })
      }
    } catch (error) {
        console.log(error);
        res.status(500).json({
           message: 'Error interno'
        });
    }
  }
};

module.exports = controllerCart;