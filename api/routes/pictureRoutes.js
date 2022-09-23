const express = require('express');
const router = express.Router();
const {getPictureById, updatePic, createPic, deletePicture, getPictureByProductId} = require('../controllers/picturesController');
const verifyJWT = require('../middlewares/verifyJWT');
const isAuthenticated = require('../middlewares/verifyRoles');

router.get('/:id', verifyJWT, getPictureById);
router.get('/', verifyJWT, getPictureByProductId)

router.post('/', verifyJWT, isAuthenticated(['GOD']), createPic);

// <<< --- RUTAS DE PRUEBA SIN LOGIN --- >>>
//router.post('/', createPic);
router.delete('/:id', deletePicture)

// <<<<<<< - - - - - - >>>>>>>>>

router.put('/:id', verifyJWT, isAuthenticated(['GOD', 'ADMIN']), updatePic);

//router.delete('/:id', verifyJWT, isAuthenticated(['GOD']), deletePicture);

module.exports = router;
