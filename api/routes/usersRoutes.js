const express = require("express");
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

router.get("/", verifyJWT, isAuthenticated(['GOD', 'ADMIN']), getUsers);
router.get('/:id/cart', verifyJWT, isAuthenticated(['GOD', 'ADMIN', 'GUESTID']), cartsController.listCart);
router.get("/:id", verifyJWT, isAuthenticated(['GOD', 'ADMIN', 'GUESTID']), getUserById);
router.post("/", createUser);
router.put('/:id/cart', verifyJWT, isAuthenticated(['GOD', 'ADMINID', 'GUESTID']), cartsController.updateCart);
router.put("/:id", verifyJWT, isAuthenticated(['GOD', 'ADMINID', 'GUESTID']), updateUser);
router.delete("/:id", verifyJWT, isAuthenticated(['GOD', 'ADMINID', 'GUESTID']), deleteUser);

router.post('/login', login);






module.exports = router;



