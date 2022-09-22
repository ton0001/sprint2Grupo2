const jwt =  require('jsonwebtoken')

const verifyJWT = (req, res, next) =>{

    const token = extractToken(req)
    // const {authorization: token} = req.headers
    try {

        req.tokenID= jwt.verify(token, process.env.JWT_PRIVATE).id
        next();
    }
    catch (err){ 
        console.log(err)
        return res.status(401).json({
            ok: false, 
            msg: "Token Invalido"
        })
    }
}

const extractToken = (req)=>{

    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === "Bearer"){
        return req.headers.authorization.split(' ')[1]
    }
    return null
}

module.exports = verifyJWT  