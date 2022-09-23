const path = require("path");
const initModels = require("../../database/models/init-models");
const { sequelize } = require('../../database/models');
const models = initModels(sequelize);

const getPictureByProductId = (req, res) => {
  try {
    const ruta = path.join(__dirname, "..", "data", "gallery.json");
    let pictures = fs.readFileSync(ruta, "utf-8");
    pictures = JSON.parse(pictures);

    const resp = pictures.filter(
      (elem) => elem.productId === parseInt(req.query.product)
    );

    if (resp.length > 0) {
      res.status(200).json({
        ok: true,
        resp,
      });
    } else {
      res.status(404).json({
        ok: false,
        msg: "no existen coincidencias",
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
    const ruta = path.join(__dirname, "..", "data", "gallery.json");
    console.log(ruta);
    let pictures = fs.readFileSync(ruta, "utf-8");
    pictures = JSON.parse(pictures);

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
const updatePic = (req, res) => {
  try {
    const ruta = path.join(__dirname, "..", "data", "gallery.json");
    let pictures = fs.readFileSync(ruta, "utf-8");
    pictures = JSON.parse(pictures);

    const id = req.params.id;
    const url = req.body.url;
    const description = req.body.description;
    const productId = req.body.productId;

    if (!url && !description && !productId) {
      res.status(400).json({
        ok: false,
        msg: "debe indicar el dato a editar",
      });
    } else {
      //const editar = pictures.find(elem => elem.id === parseInt(req.body.id));
      let encontro = false;
      for (let i = 0; i < pictures.length && !encontro; i++) {
        if (pictures[i].id === parseInt(id)) {
          if (url) {
            pictures[i].url = url;
          }
          if (description) {
            pictures[i].description = description;
          }
          if (productId) {
            pictures[i].productId = productId;
          }
          encontro = true;
        }
      }

      fs.writeFileSync(ruta, JSON.stringify(pictures));

      res.status(200).json({
        ok: true,
        msg: "imagen editada",
      });
    }
  } catch (error) {
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

//funcion auxiliar
const estanLosDatos = (id, url, description, prodId) => {
  let ret = true;
  if (!id || !url || !description || !prodId) ret = false;
  return ret;
};

module.exports = {
  createPic,
  updatePic,
  getPictureById,
  deletePicture,
  getPictureByProductId,
};
