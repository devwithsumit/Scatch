const userModel = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { generateToken } = require("../utils/generateToken");

const userValidateSchema = Joi.object({
    fullname: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
})

module.exports.registerUser = async function (req, res) {
    const { fullname, email, password } = req.body;

    //Validation process of user details
    const { error } = userValidateSchema.validate({ fullname, email, password }, { abortEarly: false });
    if (error) {
        req.flash("error", "Please fill all the required fields correctly !");
        return res.redirect("/")

        // return res.status(400).send({
        //     message: error.details.map(detail => {
        //         return detail.message
        //     })
        // });
    }

    try {
        let find = await userModel.findOne({ email: email })
        if (find) {
            req.flash("error", "Email already registered !")
            return res.status(401).redirect("/");
        };
        const hashed = await bcrypt.hash(password, 10)
        let user = await userModel.create({
            fullname,
            email,
            password: hashed,
        });
        let token = generateToken(user)
        res.cookie("token", token)

        req.flash("error", "Congratulations Account created now you can login");
        return res.redirect("/")
        // Return status 201 for successful creation
        res.redirect("/");
        // res.status(201).json({
        //     message: "User created successfully",
        //     createdUser: user,
        // });
    } catch (error) {
        // Use status 500 for server errors
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
}

module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        // Find user by email
        let user = await userModel.findOne({ email: email })
        if (!user){ 
            req.flash("error", "No user found! Please create your account");
            return res.redirect("/")
        }
        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            let token = generateToken(user)
            res.cookie("token", token)
            return res.redirect("/shop")
            // return res.status(200).send("Password matches! You can log in.");
        } else {
            req.flash("error", "Something went wrong!");
            return res.redirect("/");
        }
    } catch (error) {
        req.flash("error", "An error occured during login");
        return res.redirect("/")
    }
}

module.exports.logout = async function (req, res) {
    res.clearCookie("token");
    res.redirect("/");
}