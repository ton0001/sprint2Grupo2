const path = require("path");
const initModels = require("../../database/models/init-models");
const { sequelize } = require('../../database/models');
const models = initModels(sequelize);

// busca en la tabla de pictures el id de producto que se desee buscar
const getPictureByProductId = async (req, res) => {
  try {
    const resp = await models.pictures.findAll({
        where: {id: req.query.id}
    })

    if(resp.length > 0){
        res.status(200).json({
            ok: true,
            resp
        });
    }else{
        res.status(404).json({
            ok: false,
            msg: 'no data found'
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "server error",
    });
  }
};

//funcion que devuelve una imagen por el id de la misma
const getPictureById = (req, res) => {
  try {

    const resp = pictures.find((elem) => elem.id === parseInt(req.params.id));

    if (!resp) {
      res.status(404).json({
        ok: false,
        msg: "no existe imagen con tal id",
      });
    } else {
      res.status(200).json({
        ok: true,
        resp,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "server error",
    });
  }
};


//funcion para crear una nueva picture
const createPic = async (req, res) => {

  try {

    // trae los datos necesarios desde el body
    const bodyUrl = req.body.url;
    const bodyDescription = req.body.description;
    const bodyProductId = req.body.product_id;

    //si no llegan los datos requeridos lanza una respuesta de error
    if(!bodyUrl || !bodyProductId){
        return res.status(400).json({
            ok: false,
            msg: 'faltan campos requeridos'
        })
    }


    await models.pictures.create({
        url : bodyUrl,
        description : bodyDescription,
        product_id : bodyProductId
    });

    res.status(200).json({
      ok: true,
      msg: "imagen agregada",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "server error",
    });
  }
};

//funcion que actualiza los datos de una picture
const updatePic = async (req, res) => {
    try {
        // trae los datos necesarios desde el body
        const bodyUrl = req.body.url;
        const bodyDescription = req.body.description;
        const bodyProductId = req.body.product_id;

    
        //si no llegan los datos requeridos lanza una respuesta de error
        if(!bodyUrl && !bodyProductId && !bodyUrl){
            return res.status(400).json({
                ok: false,
                msg: 'faltan campos requeridos'
            })
        }
    
        if(bodyUrl){
            await models.pictures.update({
                url : bodyUrl,
                
            },
            {
                where: {id: req.params.id}
            });
        }
        
        if(bodyDescription){
            await models.pictures.update({
                description : bodyDescription,
            },
            {
                where: {id: req.params.id}
            });
        }
        if(bodyProductId){
            await models.pictures.update({
                product_id : bodyProductId,
            },
            {
                where: {id: req.params.id}
            });
        }
    
        res.status(200).json({
          ok: true,
          msg: "imagen actualizada con exito",
        });
    
      } catch (error) {
        console.log(error);
        res.status(500).json({
          ok: false,
          msg: "server error",
        });
      }
};

//funcion para eliminar una picture
const deletePicture = async (req, res) => {
  try {

    await models.pictures.destroy({
        where: {id: req.params.id}
    })

    /*
    if (!imagenEncontrada) {
      res.status(404).json({
        ok: false,
        msg: "no existe imagen con tal id",
      });
    } 
    */
    res.status(200).json({
       ok: true,
       msg: "imagen eliminada con exito",
    });
    

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "server error",
    });
  }
};


module.exports = {
  createPic,
  updatePic,
  getPictureById,
  deletePicture,
  getPictureByProductId,
};
