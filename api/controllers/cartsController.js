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
              as: 'product_carts',
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
    let productDB = {};
    let noStock = false;

    try {
      // Obtengo el id del cart
      let cart_ID = await models.carts.findOne({
        where: {
          user_id: req.params.id
        }
      })
      
      //Evaluo si existe el cart_ID
      if (!cart_ID){
        return res.status(404).json({
            ok: false,
            message: 'El usuario buscado no existe'
        })
      } else {
        //Guardo el id del cart
        cart_ID = cart_ID.dataValues.id
      }

      //Obtengo los productos del cart
      let cartDB = await models.product_cart.findAll(
        {
          where: {cart_id: cart_ID}
        }
      )      

      //Agrego el stock del carrito anterior a la db
      let stockQuantity = {};
      let plusQuantity = 0;
      if(cartDB.length > 0){
        cartDB.forEach(async (product) =>{
          stockQuantity = await models.products.findByPk(product.dataValues.product_id)
          plusQuantity = product.dataValues.quantity + stockQuantity.dataValues.stock;
          console.log(plusQuantity)
          await models.products.update({stock: plusQuantity},
            {
              where: {
                id: product.dataValues.product_id
              }
            });
          console.log((await models.products.findByPk(product.dataValues.product_id, {
            attributes: ['id', 'stock']
          })).dataValues)
        })  
      }

      //Evaluo si hay stock para crear el proximo carrito
      req.body.forEach(async (product) => {
        productDB = await models.products.findByPk(product.product_id);

        if(productDB.dataValues.stock < product.quantity) {
          console.log('entro')
          noStock = true;
        }
      })

      //Espero un tiempo para que cargue la base de datos?
      setTimeout(async ()=>{
        //Envio respustas segun corresponda
        if(noStock){
          //Quito el stock del carrito anterior a la db
          cartDB.forEach(async (product) =>{
            stockQuantity = await models.products.findByPk(product.dataValues.product_id)
            await models.products.update({stock: stockQuantity.dataValues.stock - product.dataValues.quantity },
              {
                where: {
                  id: product.dataValues.product_id
                }
              });
          })  
          
          res.status(400).json({
            ok: false,
            message: 'No hay stock suficiente'
          })
        }else {
          //Borro el carrito anterior
          await models.product_cart.destroy({
            where: {
              cart_id: cart_ID
            }
          })
  
          //Creo el carrido nuevo con los datos del body       
          req.body.forEach(async (product) => {
            await models.product_cart.create({
              cart_id: cart_ID,
              product_id: product.product_id,
              quantity: product.quantity
            })
          })
  
          //Actualizo el stock del carrito quitando los datos nuevos
          let stockQuantityNew = {};
          let plusQuantityNew = 0;
          req.body.forEach(async (product) =>{
            stockQuantityNew = await models.products.findByPk(product.product_id);
            plusQuantityNew = stockQuantityNew.dataValues.stock - product.quantity;
            console.log(plusQuantityNew);
            await models.products.update({stock: plusQuantityNew},
              {
                where: {
                  id: product.product_id
                }
              });
            console.log((await models.products.findByPk(product.product_id, {
              attributes: ['id', 'stock']
            })).dataValues)
          })  
          
          //Obtengo los productos del cart actualizado
          let cartDBupdate = {}
          setTimeout(async ()=>{
            cartDBupdate = await models.product_cart.findAll(
              {
                where: {cart_id: cart_ID},
                attributes: ['product_id', 'quantity', 'created_at', 'updated_at']
              }
            ) 
            res.status(200).json(cartDBupdate)
          }, 30)
        }
      }, 75)
    } catch (err){
      console.log(err)
      res.status(500).json({
        ok:false,
        message: 'Error interno del servidor'
      });
    }
    
  }
};

module.exports = controllerCart;