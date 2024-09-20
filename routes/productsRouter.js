const express = require("express")
const router = express.Router()
const upload = require("../config/multer-config")
const productModel = require("../models/product")

router.post("/create", upload.single("image"), async function (req, res) {
    try {
        let { name, price, discount } = req.body;
        let products = await productModel.create({
            name,
            price,
            discount,
            image: req.file.buffer,
        })
        req.flash("success", "Product created successfully.");
        res.redirect("/owner/admin")

    } catch (error) {
        req.flash("error", "Some error creating new product !");
        res.redirect("/owner/admin")
    }
})

module.exports = router;