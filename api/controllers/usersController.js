const {generateJWT} = require('../../helpers/generateJWT');

const initModels = require("../../database/models/init-models");
const { sequelize } = require('../../database/models');

const models = initModels(sequelize);

//recupero la lista de usuarios, respondo con un array conteniendo todos los usuarios del sistema
const getUsers = async (req, res) => {
  try {
    const users = await models.users.findAll({
      include: [{
        model: models.carts,
        as: 'carts',
        attributes: {exclude: ['user_id']},
        include: [{
          model: models.product_cart,
          as: 'product_carts',
          attributes: ['product_id', 'quantity', 'created_at', 'updated_at'],
      }]
      }]
    }) 
    res.send(users);
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Error al obtener los usuarios" });
    const usersArray = JSON.parse(users);
    res.send(usersArray);
  }
};

//recupero el user con el id solicitado. Responde con la informacion completa del usuario solicitado
//si no existe, respondo con un mensaje de error

const getUserById = (req, res) => {
  try {
    let users = fs.readFileSync(
      path.join(__dirname, "../data/users.json"),
      "utf-8"
    );
    users = JSON.parse(users);
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el usuario" });
  }
};

//Creo un nuevo Usuario. Debe recibir un body con la informacion del usuario a crear. Responde con la indormacion completa del usuario creado

const createUser = (req, res) => {

  if(!estanLosDatos(req.body)){
      res.status(401).json({ message: "Faltan datos para crear el usuario"})
  }
  else{


  try {
    
    let users = fs.readFileSync(
      path.join(__dirname, "../data/users.json"),
      "utf-8"
    );
    users = JSON.parse(users);
    const newUser = {
      id: users.length + 1,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      profilepic: req.body.profilepic,
      role: req.body.role,
    };
    users.push(newUser);
    fs.writeFileSync(
      path.join(__dirname, "../data/users.json"),
      JSON.stringify(users)
    );
    res.send(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario" });
  }
}

};

/*Actualiza un usuario identificado con id. 
Debe recibir un body con la informacion del usuario a actualizar. 
Responde con la informacion completa del usuario actualizado.
responder con error 400 si el request es incorrecto
responder con error 404 si el usuario no existe
responder con error 500 si hay un error en el servidor*/

const updateUser = (req, res) => {
  try {
    let users = fs.readFileSync(
      path.join(__dirname, "../data/users.json"),
      "utf-8"
    );
    users = JSON.parse(users);
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if (user) {
      const updatedUser = {
        id: user.id,
        email: req.body.email || user.email,
        username: req.body.username || user.username,
        password: req.body.password || user.password,
        firstname: req.body.firstname || user.firstname,
        lastname: req.body.lastname || user.lastname,
        profilepic: req.body.profilepic || user.profilepic,
        role: req.body.role || user.role,
      };
      const index = users.indexOf(user);
      users[index] = updatedUser;
      fs.writeFileSync(
        path.join(__dirname, "../data/users.json"),
        JSON.stringify(users)
      );
      res.send(updatedUser);
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al actualizar el usuario" });
  }
};

//Elimina un usuario identificado con id. Cuando se elimina un usuario, antes debe vaciarse su carrito. Responde con informacion sobre la eliminacion realizada.

const deleteUser = (req, res) => {
  try {
    let users = fs.readFileSync(
      path.join(__dirname, "../data/users.json"),
      "utf-8"
    );
    users = JSON.parse(users);
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if (user) {
      const index = users.indexOf(user);
      users.splice(index, 1);
      fs.writeFileSync(
        path.join(__dirname, "../data/users.json"),
        JSON.stringify(users)
      );
      let carts = fs.readFileSync(path.join(__dirname, "../data/carts.json"))
      carts = JSON.parse(carts);
      const cartUser = carts.find(cart => cart.user === parseInt(req.params.id))
      if(cartUser){
        const index = carts.indexOf(cartUser);
        carts.splice(index, 1);
        fs.writeFileSync(
          path.join(__dirname, "../data/carts.json"),
          JSON.stringify(carts)
        )
      }
      res.send({ message: `Usuario ${user.id} eliminado` });
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar el usuario" });
  }
};


const login = async (req, res)=>{

  const {email, password} = req.body;

  try {
      const ruta=path.join(__dirname, '..', 'data', 'users.json')
      const dbUsers=fs.readFileSync(ruta, 'utf-8')
      const users=JSON.parse(dbUsers)


      const user = users.find(user => {
          return (user.email === email && user.password === password); 
          })

      if(!user){
          return res.status(400).json({
              ok: false,
              mgs: "User NOT found"
          })
      }

      const userLog = {
          id: user.id,
          username: user.name
       }

      const token = await generateJWT(userLog)

      res.status(200).json({
          "success": true,
          "message": "Authorized",
          "user": userLog,
          token,
      })

  }
  catch(error){
      console.log(error)
      res.status(500).json({
          ok:false,
          mgs: "Error login"
      })

  }
}


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login
};


const estanLosDatos = (campos)=>{
  let ret=true
  if(!campos.email || !campos.username || !campos.password || !campos.firstname || !campos.lastname || !campos.profilepic || !campos.role){
    ret = false
  }
  return ret

}