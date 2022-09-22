
const controllerCart = {
  listCart: (req, res) => {
    const id = req.params.id;

    try {
      const cartDBJson = fs.readFileSync("api/data/carts.json", "utf-8");
      const cartDB = JSON.parse(cartDBJson);

      const cart = cartDB.find(el => el.user === Number(id));
      if (!cart){
        return res.status(400).json({
          msg: 'Bad request'
        });
      }
      res.status(200).send(cart.cart)
    } catch (error) {
        console.log(error);
        res.status(500).json({
           msg: 'Error interno'
        });
    }
  },
  updateCart: (req, res) => {
    const id = req.params.id;
    const dataUpdate = req.body;

    try {
      const cartDBJson = fs.readFileSync("api/data/carts.json", "utf-8");
      let cartDB = JSON.parse(cartDBJson);

      let cart = cartDB.find(el => el.user === Number(id));
      if (cart){
        cartDB.forEach(el => {
            if(el.user === Number(id)){
                el.cart = dataUpdate;
            }
        });

        cart = cartDB.find(el => el.user === Number(id))

        fs.writeFileSync("api/data/carts.json", JSON.stringify(cartDB));

        res.status(200).send(cart.cart)
      } else {
        res.status(404).json({
            msg: 'Not Found'
        })
      }
    } catch (error) {
        console.log(error);
        res.status(500).json({
           msg: 'Error interno'
        });
    }
  }
};

module.exports = controllerCart;