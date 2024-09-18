const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

const userValidateSchema = Joi.object({
    fullname: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})
// Test route to verify the server is running
router.get("/", async function (req, res) {
    try {
        let allUsers = await userModel.find();
        res.send(allUsers);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

// Create a new user
router.post("/create", async function (req, res) {
    const { fullname, email, password } = req.body;

    //Validation process of user details
    const { error } = userValidateSchema.validate({ fullname, email, password }, { abortEarly: false });
    if (error) {
        return res.status(400).send({
            message: error.details.map(detail => {
                return detail.message
            })
        });
    }

    try {
        const hashed = await bcrypt.hash(password, 10)
        let user = await userModel.create({
            fullname,
            email,
            password: hashed,
        });
        let token = generateToken(user)
        res.cookie("token", token)
        // Return status 201 for successful creation
        res.status(201).json({
            message: "User created successfully",
            createdUser: user,
        });
    } catch (error) {
        // Use status 500 for server errors
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});

// Delete all users
router.delete("/deleteAllUsers", async (req, res) => {
    try {
        const result = await userModel.deleteMany({});  // This will delete all documents in the 'users' collection
        res.cookie("token", "");
        res.status(200).json({
            message: result.deletedCount > 0
                ? "All users deleted successfully"
                : "No users found to delete",
            deletedCount: result.deletedCount || undefined  // Returns the count of deleted documents
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while deleting users",
            error: error.message
        });
    }
});

module.exports = router;
