const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

const { registerUser, loginUser, logout } = require("../controllers/authController");
const isLoggedin = require("../middlewares/isLoggedin");

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
router.post("/create", registerUser);

router.post("/login", loginUser);
 
router.get("/logout", logout)
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
