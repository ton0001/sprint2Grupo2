const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');
const verifyJWT = require('../middlewares/verifyJWT');
const isAuthenticated = require('../middlewares/verifyRoles');

// router.get('/', verifyJWT, productController.listCategory)
//router.get('/', productController.allProduct)
router.get('/',/* verifyJWT,*/ productController.rutaProducts)
router.get('/mostwanted', /*verifyJWT,*/  productController.mostWanted)
router.get("/search", /*verifyJWT,*/ productController.searchProduct);
router.get('/:id/pictures', /* verifyJWT,*/ productController.getPicByProductId)
router.get('/:id', /*verifyJWT*/ productController.oneProduct)
router.post('/', /*verifyJWT, isAuthenticated(['GOD']),*/ productController.createProdut)
router.put('/:id', /*verifyJWT, isAuthenticated(['GOD', 'ADMIN']),*/ productController.productEdit)

router.delete("/:id", /*verifyJWT, isAuthenticated(['GOD', 'ADMIN']),*/ productController.deleteProduct)

module.exports = router;