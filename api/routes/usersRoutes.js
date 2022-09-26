const express = require("express");
const {check} = require("express-validator")

const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login
} = require("../controllers/usersController");



const cartsController = require('../controllers/cartsController');

const verifyJWT = require('../middlewares/verifyJWT');
const isAuthenticated = require('../middlewares/verifyRoles');
const handleErrors = require("../middlewares/handleErros");


const { verifyUnique } = require("../../helpers/verifyUnique");


router.get('/:id/cart', verifyJWT, isAuthenticated(['GOD', 'ADMIN', 'GUESTID']), cartsController.listCart);

router.get("/:id", getUserById);

router.put('/:id/cart', verifyJWT, isAuthenticated(['GOD', 'ADMINID', 'GUESTID']), cartsController.updateCart);
router.put("/:id", verifyJWT, isAuthenticated(['GOD', 'ADMINID', 'GUESTID']), updateUser);
router.delete("/:id", verifyJWT, isAuthenticated(['GOD', 'ADMINID', 'GUESTID']), deleteUser);

//PROBANDO DISTITNOS ROLES
router.get("/", verifyJWT, isAuthenticated(['ADMIN', 'GUEST']), getUsers);


router.post('/login',
      check('username', 'el username es requerido').not().isEmpty(),
      check('password', 'la contraseña es requerida').not().isEmpty(),
      handleErrors,
      login);

router.post("/", 
      check('username', 'el username es requerido').not().isEmpty(),
      check('email', 'el email es requerido').not().isEmpty(),
      check('password', 'la contraseña es requerida').not().isEmpty(),
      check('first_name', 'la contraseña es requerida').not().isEmpty(),
      check('last_name', 'la contraseña es requerida').not().isEmpty(),
      check('email', 'formato de email no es valido').isEmail(),
      check ('email').custom(verifyUnique.verifyEmail),
      check ('username').custom(verifyUnique.verifyUsername),
      handleErrors,
      createUser);





module.exports = router;



