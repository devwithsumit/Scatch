const express = require("express")
const router = express();
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product");
const userModel = require("../models/user");

router.get("/", function (req, res) {
    const [error, success] = [req.flash("error"), req.flash("success")];
    res.render("index", { error, success });
})

router.get("/home", isLoggedin, async function (req, res) {
    const [error, success] = [req.flash("error"), req.flash("success")];
    res.render("home", { error, success });
})

router.get("/shop", isLoggedin, async function (req, res) {
    let products = await productModel.find();
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("shop", { products, error, success });
})

router.get("/cart", isLoggedin, async function (req, res) {
    try {
        const [error, success] = [req.flash("error"), req.flash("success")];
        let user = await userModel.findOne({ email: req.user.email }).populate("cart")
        let products = user.cart
        // console.log(products);
        res.render("cart", { products, error, success });
    } catch (error) {
        req.flash("error", error.message)
        res.send(error.message)
    }
})

router.get("/add-to-cart/:productid", isLoggedin, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email })

        // Check if product already exists in the cart using findIndex
        const existingIndex = user.cart.findIndex(productId => productId.toString() === req.params.productid);
        if (existingIndex !== -1) {
            req.flash("error", "Product already added to the cart.");
            return res.redirect("/shop"); // Early return to prevent unnecessary processing
        }
        user.cart.push(req.params.productid);
        await user.save();
        req.flash("success", "Product added to cart successfully.")
        res.redirect("/shop");
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/shop")
    }
})

router.get("/delete/:productid", isLoggedin, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email })

        if (req.params.productid === -1) {
            req.flash("error", "Product not found in the cart.");
            return res.redirect("/cart");
        }

        // Remove the product ID from the cart
        user.cart.splice(req.params.productid, 1);
        await user.save();

        req.flash("success", "Product removed from the cart successfully.");
        res.redirect("/cart");
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/cart")
    }
})
module.exports = router