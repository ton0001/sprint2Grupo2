const fs = require('fs');
const path = require('path');


const getPictureByProductId = (req, res) =>{


    try {
        const ruta=path.join(__dirname, '..', 'data', 'gallery.json')
        let pictures = fs.readFileSync(ruta, 'utf-8'); 
        pictures = JSON.parse(pictures);

        const resp = pictures.filter(elem => elem.productId === parseInt(req.query.product));
       
        if(resp.length>0){
            res.status(200).json({
                ok: true,
                resp
            })
        }else{
            res.status(404).json({
                ok: false,
                msg: 'no existen coincidencias'
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'server error'
        });
    }
}


//funcion que devuelve una imagen por el id de la misma
const getPictureById = (req, res) =>{

    try {
        const ruta=path.join(__dirname, '..', 'data', 'gallery.json')
        console.log(ruta)
        let pictures = fs.readFileSync(ruta, 'utf-8');
        pictures = JSON.parse(pictures);
        
        const resp = pictures.find(elem => elem.id === parseInt(req.params.id))

        if(!resp){
            res.status(404).json({
                ok: false,
                msg: 'no existe imagen con tal id'
            })
        }
        else{
            res.status(200).json({
                ok: true,
                resp
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'server error'
        });
    }


}

//funcion para crear una nueva picture
const createPic = (req, res) =>{
    try {
        const ruta=path.join(__dirname, '..', 'data', 'gallery.json')
        let pictures = fs.readFileSync(ruta, 'utf-8');        
        pictures = JSON.parse(pictures);

        
        const bodyId = pictures.at(-1).id + 1
        const bodyUrl = req.body.url;
        const bodyDescription = req.body.description;
        const bodyProductId = req.body.productId

        if(!estanLosDatos(bodyId,bodyUrl,bodyDescription, bodyProductId)){
            res.status(400).json({
                ok:false,
                msg:'todos los campos son requeridos, lee la doc! seguro te falta el producID revisa tu body'
            });
        }else{
            
            pictures.push({
            id: bodyId,
            url: bodyUrl,
            description: bodyDescription,
            productId: bodyProductId
            });

            try{
                const rutaProducts=path.join(__dirname, '..', 'data', 'products.json')
                let ProductsDB = fs.readFileSync(rutaProducts, 'utf-8');      
                ProductsDB = JSON.parse(ProductsDB);
    
                if (ProductsDB.find(prod => prod.id === Number(bodyProductId))){
                    ProductsDB.forEach(prod => {
                        if(prod.id === bodyProductId){
                            prod.gallery.push(
                                {
                                    picture_id: bodyId ,
                                    picture_url: bodyUrl
                                })
                        }
                    });
        
                     fs.writeFileSync(rutaProducts, JSON.stringify(ProductsDB));
                }
                else{
                    res.status(404).json({
                        ok: false,
                        msg: 'Product not found'
                    });
                }

            }
            catch(error){
                console.log(error)
                res.status(500).json({
                    ok:false,
                    msg:'server error'
                });
            }
           


            res.status(200).json({
                ok: true,
                msg: 'imagen agregada'
            });
            fs.writeFileSync(ruta, JSON.stringify(pictures));
        }  
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'server error'
        });
    }
}   

//funcion que actualiza los datos de una picture
const updatePic = (req,res) =>{
    try { 
        const ruta=path.join(__dirname, '..', 'data', 'gallery.json')
        let pictures = fs.readFileSync(ruta, 'utf-8');
        pictures = JSON.parse(pictures);

        const id = req.params.id;
        const url = req.body.url;
        const description = req.body.description;
        const productId = req.body.productId;


        if(!url && !description && !productId){
            res.status(400).json({
                ok:false,
                msg:'debe indicar el dato a editar'
            });
        }
        else{
            //const editar = pictures.find(elem => elem.id === parseInt(req.body.id));
            let encontro = false;
            for(let i = 0; i<pictures.length && !encontro; i++){
                if(pictures[i].id === parseInt(id)){
                    if(url){
                        pictures[i].url = url;
                    }
                    if(description){
                        pictures[i].description = description;
                    }
                    if(productId){
                        pictures[i].productId = productId;
                    }
                    encontro = true;
                }
            }

            fs.writeFileSync(ruta, JSON.stringify(pictures));

            res.status(200).json({
                ok: true,
                msg: 'imagen editada'
            });
        }


    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'server error'
        });
    }
}

//funcion para eliminar una picture
const deletePicture = (req, res) => {
    try {
        const ruta=path.join(__dirname, '..', 'data', 'gallery.json')
        let pictures = fs.readFileSync(ruta, 'utf-8');
        pictures = JSON.parse(pictures);
        
        const resp = pictures.find(elem => elem.id === parseInt(req.params.id))

        if(!resp){
            
            res.status(404).json({
                ok: false,
                msg: 'no existe imagen con tal id'
            });
        }
        else{
            const nuevo = pictures.filter(elem => elem.id !== resp.id);
            pictures = nuevo;
            fs.writeFileSync(ruta, JSON.stringify(pictures));
            res.status(200).json({
                ok: true,
                msg: 'imagen eliminada con exito'
            })
            
        }



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'server error'
        });
    }
}



//funcion auxiliar
const estanLosDatos = (id, url, description, prodId) => {
    let ret = true;
    if(!id || !url || !description || !prodId)
        ret = false;
    return ret;
}

module.exports = {
    createPic,
    updatePic,
    getPictureById,
    deletePicture,
    getPictureByProductId,
}
