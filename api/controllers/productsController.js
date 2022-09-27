
const { Op } = require('sequelize');
const initModels = require("../../database/models/init-models");
const { sequelize } = require("../../database/models");


const models = initModels(sequelize);

const productController = {

    //   ----------------------   //


  allProduct: async function (req, res) {
    
    try {
      const getAllProduct = await models.products.findAll({
        include: [
          {
            model: models.category,
            as: "category",
          },
        ],
      });

      res.status(200).json(getAllProduct);
    } catch (error) {
      res.status(500).json({
        message: "Error del servidor al cargar los productos",
      });
      console.log("Catch error" + error);
    }
  },


  //   ----------------------   //


  oneProduct: async function (req, res) {
   

    try {
      const oneProduct = await models.products.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: models.category,
            as: "category",
          },
        ],
      });

      if (!oneProduct) {
        res.status(404).json({
          ok: false,
          msg: "El producto no existe",
        });
      } else {
        res.status(200).json(oneProduct);
      }
    } catch (error) {
      res.send(error);
      console.log("Catch error " + error);
    }
  },

  //   ----------------------   //


  createProdut: async function (req, res) {  
   

    try {
      models.products.create({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category_id: req.body.category,
        mostwanted: req.body.mostwanted,
        stock: req.body.stock,
      });

      res.status(200).json({
        ok: false,
        message: "Producto Agregado",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Error del servidor al crear el producto",
      });
    }
  },

  //   ----------------------   //

  productEdit: async function (req, res) { 
    

    try {
      await models.products.update(
        {
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          category_id: req.body.category,
          mostwanted: req.body.mostwanted,
          stock: req.body.stock,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.status(200).json({
        ok: true,
        message: "producto modificado",
      });
    } catch (error) {
      console.log(error);
      res.send("Error inesperado");
    }
  },

  //   ----------------------   //

  mostWanted: async function (req, res) {    
    try {
      const mostwanted =  await models.products.findAll({
        where: {
          mostwanted : true
        }
      });

      res.status(200).json(mostwanted)

    } catch (err) {
      console.log(err);
      res.status(400).json({
        ok: false,
        message: "Error inesperado",
      });
    }
  },

  //   ----------------------   //


  getPicByProductId: async (req, res) => {
    const paramsId = req.params.id;

    try {

      const productImage = await models.products.findByPk( paramsId ,{
        attributes: { exclude: ['price', 'description', 'category_id', 'mostwanted', 'stock']},
        include: [
          {
            model: models.pictures,
            as: "pictures",
            attributes: {
              exclude: ['product_id']
            }
          }]
      } 
      )

        if(productImage.pictures.length === 0){
       
            res.json("Este producto no tiene imagenes asociadas")
        } else {
          res.json(productImage)
        }
      
     
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "server error",
      });
    }
  },

   //   ----------------------   //

  listCategory: (req, res) => {
    
    let category = req.query.category;

    try {
      let dbProduct = fs.readFileSync("api/data/products.json", "utf-8");
      dbProduct = JSON.parse(dbProduct);

      let categoryFind = dbProduct.find(
        (el) => el.category.toLowerCase() === category.toLowerCase()
      );

      if (categoryFind) {
        let dbProductFilter = dbProduct.filter(
          (el) => el.category.toLowerCase() === category.toLowerCase()
        );
        res.status(200).send(dbProductFilter);
      } else {
        res.status(404).json({
          msg: "Not Found",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg: "Error interno",
      });
    }
  },

  rutaProducts: (req, res) => {
    if (req.query.category) {
      productController.listCategory(req, res);
    } else {
      productController.allProduct(req, res);
    }
  },

   //   ----------------------   //

  searchProduct: async (req, res) => {
    try {
     const keyWord = req.query.q
      const filteredProducto = await models.products.findAll({ where: {  [Op.or] : [ 
        //title: {[Op.like]: `%${req.query.q}%`} 
        {title: { 
           $iLike : "%" + keyWord + "%"}

      }]}
        
        // title: { [Op.like]: "%" + keyWord + "%" } 
        /*[Op.or]: [
          {title:       { [Op.like]: `%${search}%`}},
          {description: { [Op.like]: `%${search}%`}}
        ]
}*/
        // where: { [Op.or]: [{title: { 
        //   [Op.substring]: "%" + keyWord + "%"}
        // }] }
        //  title: {[Op.substring]: `%${req.query.q}%`} ]}
    })
    
    
    if (filteredProducto.length === 0) {
       res.status(404).send({ message: "No se encontraron productos" });
       } else {
        res.json(filteredProducto)
       }
    } catch (error) {
      res.status(500).send({ message: "Error al obtener los productos" });
    }
  },

//   ----------------------   //

  deleteProduct: async (req, res) => {
    const { id } = req.params;

    try {
       const searchingProductToDelete = await models.products.findByPk(id);
       
      if(searchingProductToDelete != undefined) {
        await searchingProductToDelete.destroy();
        res.status(200).json({
          ok: true,
          message: "El producto se eliminó con exito"
        })
      } else {
        
        res.status(400).json("El producto que desea eliminar no existe en nuestra base de datos")
      }
        
      
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Error del servidor al eliminar el producto",
      });
    }
  },
};

module.exports = productController;

// const estanLosDatos = (campos)=>{
//   let ret=true
//   if(!campos.title || !campos.price || !campos.description ||  !campos.image || !campos.gallery || !campos.category || !campos.mostWanted || !campos.stock){
//     ret = false
//   }
//   return ret

// }
