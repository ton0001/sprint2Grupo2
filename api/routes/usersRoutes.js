const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
  login,
} = require("../controllers/usersController");

const cartsController = require("../controllers/cartsController");

const verifyJWT = require("../middlewares/verifyJWT");
const isAuthenticated = require("../middlewares/verifyRoles");

router.get("/", getUsers);
router.get(
  "/:id/cart",
  verifyJWT,
  isAuthenticated(["GOD", "ADMIN", "GUESTID"]),
  cartsController.listCart
);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put(
  "/:id/cart",
  verifyJWT,
  isAuthenticated(["GOD", "ADMINID", "GUESTID"]),
  cartsController.updateCart
);
router.put("/:id", updateUser);
router.delete("/:id", deleteUserById);

router.post("/login", login);

module.exports = router;
