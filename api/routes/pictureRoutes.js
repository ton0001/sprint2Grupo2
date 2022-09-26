const express = require('express');
const router = express.Router();
const {getPictureById, updatePic, createPic, deletePicture, getPictureByProductId} = require('../controllers/picturesController');
const verifyJWT = require('../middlewares/verifyJWT');
const isAuthenticated = require('../middlewares/verifyRoles');


// <<<- RUTAS FINALES ->>>

//router.get('/:id', verifyJWT, getPictureById);
//router.get('/', verifyJWT, getPictureByProductId)
//router.post('/', verifyJWT, isAuthenticated(['GOD']), createPic);
//router.put('/:id', verifyJWT, isAuthenticated(['GOD', 'ADMIN']), updatePic);
//router.delete('/:id', verifyJWT, isAuthenticated(['GOD']), deletePicture);


// <<< --- RUTAS DE PRUEBA SIN LOGIN --- >>>
router.get('/', getPictureByProductId)
router.get('/:id', getPictureById);
router.post('/', createPic);
router.put('/:id', updatePic);
router.delete('/:id', deletePicture)
// <<<<<<< - - - - - - >>>>>>>>>

module.exports = router;
