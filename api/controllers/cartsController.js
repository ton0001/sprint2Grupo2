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
          message: 'El id del usuario solicitado no existe'
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

    req.body.forEach(product => {
      try{
        let productDB = models.products.findByPk(product.product_id);

        if(productDB.stock < product.quantity) {
          res.status(400).json({
            ok: false,
            message: 'No hay stock suficiente'
          })
        }
      } catch(err) {
        return res.status(500).json({
          ok:false,
          message: 'Error interno'
        });
      }
    })

    try {
      const cartDB = await models.product_cart.update( req.body, {
        where: {id: req.params.id}
      } )

      if (cartDB){
        res.status(200).json(cartDB)
      } else {
        res.status(404).json({
            ok: false,
            message: 'Not Found'
        })
      }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok:false,
           message: 'Error interno'
        });
    }

    req.body.forEach(product => {
      try{
        let productDB = models.products.findByPk(product.product_id);

        if(productDB.stock >= product.quantity) {
          models.products.update(product.quantity, {
            where: {
              id: product.product_id
            }
          })
        }
      } catch(err) {
        res.status(500).json({
          ok:false,
          message: 'Error interno'
        });
      }
    })
  }
};

module.exports = controllerCart;